// s2
const HAMMER_ID = 'utopia:hammer'
const COOLDOWN_TICKS = 2
const HAMMERABLE_TAG = 'utopia:hammerable'

const ENABLE_CONNECTORS = true
const ENABLE_TRAPDOORS  = true
const ENABLE_LIT        = true
const ENABLE_STAIRS     = true

const SIDES = ['north', 'east', 'south', 'west']

const HANDPROOF_TRAPDOOR_KEYWORDS = ['iron']
const EXTRA_HANDPROOF_TRAPDOORS = []
const LIT_ALLOW_BLOCK_ENTITY = ['minecraft:campfire', 'minecraft:soul_campfire']
const BLACKLIST = []

const CLIP_KEY = 'utopia_hammer_clip'
const POST_REACH = 0.26   // post is 0.25 each way from the block center, plus a tiny margin

const $CrossCollisionBlock = Java.loadClass('net.minecraft.world.level.block.CrossCollisionBlock')
const $WallBlock = Java.loadClass('net.minecraft.world.level.block.WallBlock')
const $TrapDoorBlock = Java.loadClass('net.minecraft.world.level.block.TrapDoorBlock')
const $StairBlock = Java.loadClass('net.minecraft.world.level.block.StairBlock')
const $EntityBlock = Java.loadClass('net.minecraft.world.level.block.EntityBlock')
const $BuiltInRegistries = Java.loadClass('net.minecraft.core.registries.BuiltInRegistries')
const $Component = Java.loadClass('net.minecraft.network.chat.Component')

const has = (list, value) => list.indexOf(value) !== -1
const getProp = (block, name) => block.getStateDefinition().getProperty(name)
const isWall = block => block instanceof $WallBlock
const describe = props => Object.keys(props).map(k => k + '=' + props[k]).join(' ')

// Vec3 x/y/z are fields on some versions and methods on others.
const coord = (v, k) => Number(typeof v[k] === 'function' ? v[k]() : v[k])

function say(player, label, value) {
    player.displayClientMessage($Component.literal('§e' + label + '§7: §f' + value), true)
}

function loadClip(player) {
    const raw = String(player.persistentData.getString(CLIP_KEY))
    return raw == '' ? null : JSON.parse(raw)
}

function isHandproofTrapdoor(id) {
    return has(EXTRA_HANDPROOF_TRAPDOORS, id) || HANDPROOF_TRAPDOOR_KEYWORDS.some(k => id.indexOf(k) !== -1)
}

function classify(b, id) {
    if (has(BLACKLIST, id)) return null

    if (ENABLE_CONNECTORS
        && (b instanceof $CrossCollisionBlock || isWall(b))
        && getProp(b, 'north') != null) return 'connector'

    if (ENABLE_TRAPDOORS
        && b instanceof $TrapDoorBlock
        && isHandproofTrapdoor(id)
        && getProp(b, 'open') != null) return 'trapdoor'

    if (ENABLE_STAIRS
        && b instanceof $StairBlock
        && getProp(b, 'shape') != null) return 'stairs'

    if (ENABLE_LIT
        && getProp(b, 'lit') != null
        && (!(b instanceof $EntityBlock) || has(LIT_ALLOW_BLOCK_ENTITY, id))) return 'lit'

    return null
}

ServerEvents.tags('block', event => {
    $BuiltInRegistries.BLOCK.forEach(b => {
        const id = String($BuiltInRegistries.BLOCK.getKey(b))
        if (classify(b, id) != null) event.add(HAMMERABLE_TAG, id)
    })
})

// Auto side picking. Walls use the exact hit point: inside the post footprint it is the post,
// otherwise the arm runs perpendicular to the face you hit. Fences/panes use the clicked face,
// else your position.
function pickSide(event) {
    const block = event.block
    const state = block.blockState
    const hit = event.hit
    const face = String((hit == null ? event.facing : hit.getDirection()).getSerializedName())
    const loc = hit == null ? null : hit.getLocation()
    const byHit = loc != null && isWall(state.block)
    const origin = byHit ? loc : event.player
    const dx = coord(origin, 'x') - (Number(block.x) + 0.5)
    const dz = coord(origin, 'z') - (Number(block.z) + 0.5)

    if (byHit) {
        const upProp = getProp(state.block, 'up')
        const postOn = upProp != null && String(state.getValue(upProp)) == 'true'
        if (postOn && Math.abs(dx) <= POST_REACH && Math.abs(dz) <= POST_REACH) return 'up'

        if (face == 'east' || face == 'west') return dz > 0 ? 'south' : 'north'
        if (face == 'north' || face == 'south') return dx > 0 ? 'east' : 'west'
    } else {
        if (has(SIDES, face)) return face
        if (getProp(state.block, 'up') != null) return 'up'
    }

    if (Math.abs(dx) > Math.abs(dz)) return dx > 0 ? 'east' : 'west'
    return dz > 0 ? 'south' : 'north'
}

// Stairs: top/bottom face rotates the stair, any side face cycles its shape.
function stairProp(event) {
    const hit = event.hit
    const face = String((hit == null ? event.facing : hit.getDirection()).getSerializedName())
    return (face == 'up' || face == 'down') ? 'facing' : 'shape'
}

function propsFor(type, block) {
    if (type == 'trapdoor') return ['open']
    if (type == 'lit') return ['lit']
    if (type == 'stairs') return ['facing', 'half', 'shape']
    return getProp(block, 'up') != null ? SIDES.concat(['up']) : SIDES
}

function start(event) {
    const { item, block, player } = event
    if (item.id != HAMMER_ID || !block.hasTag(HAMMERABLE_TAG)) return null
    const type = classify(block.blockState.block, String(block.id))
    if (type == null) return null
    if (player.cooldowns.isOnCooldown(item.item)) {
        event.cancel()
        return null
    }
    return type
}

function wallBroken(state) {
    const block = state.block
    if (!isWall(block)) return false
    if (String(state.getValue(getProp(block, 'up'))) != 'false') return false
    const on = name => String(state.getValue(getProp(block, name))) != 'none'
    return !((on('north') && on('south')) || (on('east') && on('west')))
}

function pasteState(state, props) {
    let result = state
    const ok = Object.keys(props).every(name => {
        const prop = getProp(state.block, name)
        if (prop == null) return name == 'up'
        const parsed = prop.getValue(props[name])
        if (parsed == null || !parsed.isPresent()) return false
        result = result.setValue(prop, parsed.get())
        return true
    })
    return ok ? result : null
}

BlockEvents.rightClicked(event => {
    const { item: stack, block, player } = event
    const type = start(event)
    if (type == null) return

    const state = block.blockState
    const crouching = player.isCrouching()
    const clip = crouching ? loadClip(player) : null

    let sideName = null
    if (type == 'connector') sideName = pickSide(event)
    else if (type == 'stairs') sideName = stairProp(event)
    const prop = getProp(state.block, sideName != null ? sideName : propsFor(type, state.block)[0])

    let next = null
    let reason = null
    if (!crouching) {
        next = state.cycle(prop)
    } else if (clip == null) {
        reason = 'nothing saved'
    } else {
        next = clip.type == type ? pasteState(state, clip.props) : null
        if (next == null) reason = 'saved state does not fit this block'
    }

    if (next != null && wallBroken(next)) {
        reason = 'needs a post or a parallel pair of sides'
        next = null
    }

    if (next == null) {
        if (reason != null) say(player, 'hammer', reason)
        event.cancel()
        return
    }

    block.level.setBlock(block.pos, next, 18)
    if (crouching) say(player, 'pasted', describe(clip.props))
    else say(player, prop.getName(), String(next.getValue(prop)))
    player.cooldowns.addCooldown(stack.item, COOLDOWN_TICKS)
    event.cancel()
})

BlockEvents.leftClicked(event => {
    const { item: stack, block, player } = event
    const type = start(event)
    if (type == null) return

    const state = block.blockState

    if (!player.isCrouching()) {
        if (type == 'stairs') {
            const half = getProp(state.block, 'half')
            const next = state.cycle(half)
            block.level.setBlock(block.pos, next, 18)
            say(player, 'half', String(next.getValue(half)))
            player.cooldowns.addCooldown(stack.item, COOLDOWN_TICKS)
        }
        event.cancel()
        return
    }

    const props = {}
    propsFor(type, state.block).forEach(name => {
        const prop = getProp(state.block, name)
        props[name] = String(prop.getName(state.getValue(prop)))
    })
    player.persistentData.putString(CLIP_KEY, JSON.stringify({ type: type, props: props }))
    say(player, 'saved', describe(props))
    player.cooldowns.addCooldown(stack.item, COOLDOWN_TICKS)
    event.cancel()
})
