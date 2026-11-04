// --- Hammer --------------------------------------------------
const HAMMER_ID = 'utopia:hammer'           // the item that acts as a hammer
const COOLDOWN_TICKS = 2                   // 20 ticks = 1 second
const HAMMERABLE_TAG = 'utopia:hammerable'  // block tag, auto-filled at data load

// --- Which block categories are affected ---------------------
const ENABLE_CONNECTORS = true
const ENABLE_TRAPDOORS  = true 
const ENABLE_LIT        = true 

// --- Category rules ------------------------------------------
const SIDES = ['north', 'east', 'south', 'west']

const HANDPROOF_TRAPDOOR_KEYWORDS = ['iron']
const EXTRA_HANDPROOF_TRAPDOORS = [
]

// These are the exceptions that work fine:
const LIT_ALLOW_BLOCK_ENTITY = ['minecraft:campfire', 'minecraft:soul_campfire']

const BLACKLIST = [
    // 'modid:blah'
]

// --- Feedback ------------------------------------------------
const SOUND_CONNECTOR      = 'STONE_BUTTON_CLICK_ON'   // field names of SoundEvents
const SOUND_LIT            = 'LEVER_CLICK'
const SOUND_TRAPDOOR_OPEN  = 'IRON_TRAPDOOR_OPEN'
const SOUND_TRAPDOOR_CLOSE = 'IRON_TRAPDOOR_CLOSE'
const SOUND_COPY           = 'AMETHYST_BLOCK_CHIME'    // crouch + left click (save state)
const SOUND_VOLUME = 1.0
const SOUND_PITCH  = 1.0
const SHOW_ACTIONBAR = true
const formatMessage = (label, value) => '§e' + label + '§7: §f' + value




const $CrossCollisionBlock = Java.loadClass('net.minecraft.world.level.block.CrossCollisionBlock') // fences, panes, bars
const $WallBlock = Java.loadClass('net.minecraft.world.level.block.WallBlock')
const $TrapDoorBlock = Java.loadClass('net.minecraft.world.level.block.TrapDoorBlock')
const $EntityBlock = Java.loadClass('net.minecraft.world.level.block.EntityBlock')
const $BuiltInRegistries = Java.loadClass('net.minecraft.core.registries.BuiltInRegistries')
const $SoundEvents = Java.loadClass('net.minecraft.sounds.SoundEvents')
const $SoundSource = Java.loadClass('net.minecraft.sounds.SoundSource')
const $Component = Java.loadClass('net.minecraft.network.chat.Component')

// Saved states per player uuid. Cleared on server restart.
const CLIPBOARD = {}

function getProp(block, name) {
    return block.getStateDefinition().getProperty(name)
}

function isHandproofTrapdoor(id) {
    if (EXTRA_HANDPROOF_TRAPDOORS.indexOf(id) !== -1) return true
    return HANDPROOF_TRAPDOOR_KEYWORDS.some(k => id.indexOf(k) !== -1)
}

function classify(b, id) {
    if (BLACKLIST.indexOf(id) !== -1) return null

    if (ENABLE_CONNECTORS
        && (b instanceof $CrossCollisionBlock || b instanceof $WallBlock)
        && getProp(b, 'north') != null) return 'connector'

    if (ENABLE_TRAPDOORS
        && b instanceof $TrapDoorBlock
        && isHandproofTrapdoor(id)
        && getProp(b, 'open') != null) return 'trapdoor'

    if (ENABLE_LIT
        && getProp(b, 'lit') != null
        && (!(b instanceof $EntityBlock) || LIT_ALLOW_BLOCK_ENTITY.indexOf(id) !== -1)) return 'lit'

    return null
}

ServerEvents.tags('block', event => {
    $BuiltInRegistries.BLOCK.forEach(b => {
        const id = String($BuiltInRegistries.BLOCK.getKey(b))
        if (classify(b, id) != null) event.add(HAMMERABLE_TAG, id)
    })
})

function pickSide(event) {
    const face = String(event.facing.getSerializedName())
    if (SIDES.indexOf(face) !== -1) return face
    if (getProp(event.block.blockState.block, 'up') != null) return 'up'
    const dx = event.player.x - (event.block.x + 0.5)
    const dz = event.player.z - (event.block.z + 0.5)
    if (Math.abs(dx) > Math.abs(dz)) return dx > 0 ? 'east' : 'west'
    return dz > 0 ? 'south' : 'north'
}

function hammerType(event) {
    const { item, block } = event
    if (item.id != HAMMER_ID || !block.hasTag(HAMMERABLE_TAG)) return null
    return classify(block.blockState.block, String(block.id))
}

const propsFor = (type, b) => type == 'connector'
    ? (b != null && getProp(b, 'up') != null ? SIDES.concat(['up']) : SIDES)
    : [type == 'trapdoor' ? 'open' : 'lit']

function say(player, label, value) {
    if (SHOW_ACTIONBAR) player.displayClientMessage($Component.literal(formatMessage(label, value)), true)
}

const describe = props => Object.keys(props).map(k => k + '=' + props[k]).join(' ')

function soundFor(type, newState) {
    if (type == 'connector') return $SoundEvents[SOUND_CONNECTOR]
    if (type == 'lit') return $SoundEvents[SOUND_LIT]
    const open = String(newState.getValue(getProp(newState.block, 'open'))) == 'true'
    return $SoundEvents[open ? SOUND_TRAPDOOR_OPEN : SOUND_TRAPDOOR_CLOSE]
}

// Plays a sound at a block position for everyone nearby, including the clicking player.
// A plain level.playSound(null, pos, ...) is ambiguous in Rhino (null matches Player and Entity,
// numbers match float and double), so the exact overload is selected by its full signature.
const PLAY_SOUND_SIG = 'playSound(net.minecraft.world.entity.player.Player,net.minecraft.core.BlockPos,net.minecraft.sounds.SoundEvent,net.minecraft.sounds.SoundSource,float,float)'

function playSoundAt(level, pos, sound) {
    level[PLAY_SOUND_SIG](null, pos, sound, $SoundSource.BLOCKS, SOUND_VOLUME, SOUND_PITCH)
}

function pasteState(state, props) {
    let result = state
    const ok = Object.keys(props).every(name => {
        const prop = getProp(state.block, name)
        if (prop == null && name == 'up') return true
        const parsed = prop == null ? null : prop.getValue(props[name])
        if (parsed == null || !parsed.isPresent()) return false
        result = result.setValue(prop, parsed.get())
        return true
    })
    return ok ? result : null
}

BlockEvents.rightClicked(event => {
    const { item: stack, block, player } = event

    const type = hammerType(event)
    if (type == null) return

    if (player.cooldowns.isOnCooldown(stack.item)) {
        event.cancel()
        return
    }

    // Everything is declared at the top level of the function: Rhino breaks on const/let inside if/else blocks
    const state = block.blockState
    const crouching = player.isCrouching()
    const clip = CLIPBOARD[String(player.uuid)]
    const prop = crouching ? null : getProp(state.block, type == 'connector' ? pickSide(event) : propsFor(type)[0])

    const newState = crouching
        ? (clip != null && clip.type == type ? pasteState(state, clip.props) : null)
        : state.cycle(prop)

    if (newState == null) {
        say(player, 'hammer', clip == null ? 'nothing saved' : 'saved state does not fit this block')
        event.cancel()
        return
    }

    // Flag 18 = update clients, skip neighbour updates (same as the vanilla debug stick)
    block.level.setBlock(block.pos, newState, 18)
    playSoundAt(block.level, block.pos, soundFor(type, newState))
    say(player, crouching ? 'pasted' : prop.getName(), crouching ? describe(clip.props) : String(newState.getValue(prop)))

    // Cooldown first, so it still applies if the hammer breaks
    player.cooldowns.addCooldown(stack.item, COOLDOWN_TICKS)
    player.damageHeldItem(event.hand)
    event.cancel()
})

// Registered last and wrapped, so the right click still works if this event doesn't exist

try {
    BlockEvents.leftClicked(event => {
        // Everything is declared at the top level of the function: Rhino breaks on const/let inside try/if blocks
        const { item: stack, block, player } = event
        if (!player.isCrouching()) return

        const type = hammerType(event)
        if (type == null) return

        const state = block.blockState
        const props = {}
        const key = String(player.uuid)
        let ok = true

        // event.cancel() ends the handler immediately, so it comes after all the work
        if (player.cooldowns.isOnCooldown(stack.item)) event.cancel()

        try {
            propsFor(type, state.block).forEach(name => {
                const prop = getProp(state.block, name)
                props[name] = prop.getName(state.getValue(prop))
            })
            CLIPBOARD[key] = { type: type, props: props }
        } catch (err1) {
            ok = false
            console.error('Hammer: save failed: ' + err1)
            say(player, 'hammer', 'save failed, check log')
        }

        if (ok) {
            try {
                playSoundAt(block.level, block.pos, $SoundEvents[SOUND_COPY])
            } catch (err2) {
                console.error('Hammer: sound failed: ' + err2)
            }
            say(player, 'saved', describe(props))
            player.cooldowns.addCooldown(stack.item, COOLDOWN_TICKS)
        }

        event.cancel()
    })
} catch (e) {
    console.error('Hammer: could not register left click handler: ' + e)
}