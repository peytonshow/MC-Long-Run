const SOUND_COOLDOWN_TICKS = 100 // 5 seconds
const NIGHT_START = 13000
const lastPlayed = new Map()

const keyOf = (dim, x, y, z) => `${dim}|${x},${y},${z}`
const isNight = level => level.dayTime % 24000 >= NIGHT_START
const centre = (x, y, z) => `${x + 0.5} ${y + 0.5} ${z + 0.5}`

function playSound(level, block, sound, volume, pitch) {
  const key = keyOf(level.dimension, block.x, block.y, block.z)
  if (level.time - (lastPlayed.get(key) ?? -Infinity) < SOUND_COOLDOWN_TICKS) return false

  lastPlayed.set(key, level.time)
  level.runCommandSilent(`playsound ${sound} block @a ${centre(block.x, block.y, block.z)} ${volume} ${pitch}`)
  return true
}

// Night-only ambience: roll < 0.1 plays `low`, roll < 0.2 plays `high` at a higher pitch
const ambientTick = (low, high) => tick => {
  const { level, block } = tick
  const roll = Math.random()

  if (!isNight(level)) return
  if (roll < 0.1) playSound(level, block, low, 0.3, 1.0)
  else if (roll < 0.2) playSound(level, block, high, 0.3, 1.2)
}

const terminalTick = ambientTick('utopia:computer_terminal_ambient', 'utopia:computer_terminal_ambient')
const dataTick = ambientTick('utopia:computer_data_creepy', 'utopia:computer_data_ambient')

const spaceTick = prefix => tick => {
  const { level, block, server } = tick
  const roll = Math.random()

  if (roll < 0.1 && isNight(level)) {
    playSound(level, block, 'utopia:computer_space_creepy', 0.3, 1.0)
  } else if (roll < 0.25 && isNight(level)) {
    playSound(level, block, 'utopia:computer_space_ambient', 0.3, 1.0)
  } else if (roll < 0.3 && level.isThundering() && level.getBlock(block.x, block.y + 1, block.z).id === 'minecraft:lightning_rod'
    && playSound(level, block, 'utopia:computer_space_badsignal', 1.0, 1.0)) {
    const { x, y, z } = block
    const dim = level.dimension
    const facing = block.properties.get('facing') || 'north'

    block.set(`utopia:${prefix}computer_block_badsignal`, { facing })

    server.scheduleInTicks(212, () => {
      try {
        const target = server.getLevel(dim)
        if (!target) return

        target.runCommandSilent(`playsound utopia:computer_smash block @a ${centre(x, y, z)} 1.0 1.0`)
        target.getBlock(x, y, z).set(`utopia:${prefix}broken_computer`, { facing })
        target.runCommandSilent(`particle minecraft:explosion_emitter ${centre(x, y, z)} 0 0 0 1 1`)
        target.runCommandSilent(`advancement grant @a[x=${x},y=${y},z=${z},distance=..10] only utopia:voices_of_the_void`)
        lastPlayed.delete(keyOf(dim, x, y, z))
      } catch (e) {
        console.log('[utopia] scheduleInTicks callback threw:', e)
      }
    })
  }
}

const defineSet = (event, prefix, color) => {
  const id = name => `utopia:${prefix}${name}`

  const plastic = event.create(id('block_of_plastic'))
    .displayName('Block of Plastic')
    .soundType('metal')
    .hardness(3)
    .resistance(6)
    .tag('utopia:plastic_block')
  if (prefix) plastic.tag(`utopia:plastic_block/${color}`)

  event.create(id('computanian'), 'kubejs:cardinal')
    .displayName('Mainframe')
    .soundType('metal')
    .hardness(3)
    .resistance(6)
    .lightLevel(4 / 15)
    .tag('utopia:computanian')
    .tagBlock(`utopia:mainframe/${color}`)

  // Working computers. Ones with `opts` are the ambient variants (hidden from recipe viewers, emit light, random tick)
  const computer = (name, opts) => {
    const block = event.create(id(name), 'kubejs:cardinal')
      .soundType('metal')
      .hardness(2)
      .resistance(6)
      .tagBlock('minecraft:mineable/pickaxe')
      .tagBlock('utopia:computer')
      .tagBoth(`utopia:computer/${color}`)
      .tagBoth(`utopia:computer/${color}/working`)
      .displayName('Computer')
      .requiresTool(false)
    if (opts) block.tagBlock('c:hidden_from_recipe_viewers').lightLevel(opts.light / 15).randomTick(opts.tick)
  }

  computer('computer_block')
  computer('computer_block_terminal', { light: 6, tick: terminalTick })
  computer('computer_block_coding', { light: 6, tick: terminalTick })
  computer('computer_block_data', { light: 6, tick: dataTick })
  computer('computer_block_space', { light: 5, tick: spaceTick(prefix) })

  event.create(id('computer_block_badsignal'), 'kubejs:cardinal')
    .soundType('metal')
    .resistance(160)
    .tagBlock('minecraft:mineable/pickaxe')
    .tagBlock('utopia:computer')
    .tagBoth(`utopia:computer/${color}`)
    .displayName('Computer')
    .requiresTool(true)
    .lightLevel(14 / 15)
    .unbreakable()
    .tagBlock('c:hidden_from_recipe_viewers')
    .tagBlock('create:non_movable')
    .tagBlock('minecraft:dragon_immune')
    .tagBlock('minecraft:wither_immune')
    .tagBlock('minecraft:features_cannot_replace')
    .tagBlock('nova_structures:explosion_resistand')
    .tagBlock('minecraft:lava_pool_stone_cannot_replace')

  event.create(id('broken_computer'), 'kubejs:cardinal')
    .soundType('metal')
    .hardness(2)
    .resistance(6)
    .tagBlock('minecraft:mineable/pickaxe')
    .tagBoth(`utopia:computer/${color}`)
    .displayName('Smashed Computer')
    .requiresTool(false)
}

StartupEvents.registry('block', event => {
  defineSet(event, '', 'blue')
  defineSet(event, 'tan_', 'tan')
})