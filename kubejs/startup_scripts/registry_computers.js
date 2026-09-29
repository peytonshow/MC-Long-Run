const SOUND_COOLDOWN_TICKS = 100
const lastPlayed = new Map()

function playSound(level, block, sound, volume, pitch) {
  let key = `${level.dimension}|${block.x},${block.y},${block.z}`
  let now = level.time
  if (now - (lastPlayed.get(key) ?? -Infinity) < SOUND_COOLDOWN_TICKS) return false

  lastPlayed.set(key, now)
  level.runCommandSilent(`playsound ${sound} block @a ${block.x + 0.5} ${block.y + 0.5} ${block.z + 0.5} ${volume} ${pitch}`)
  return true
}

StartupEvents.registry('block', event => {
  event.create('utopia:computer_block', "kubejs:cardinal")
    .soundType('metal')
    .hardness(2)
    .resistance(6)
    .tagBlock('minecraft:mineable/pickaxe')
    .tagBlock('utopia:computer')
    .tagBlock('utopia:computer/working')
    .displayName('Computer')
    .requiresTool(false)

  event.create('utopia:computer_block_badsignal', "kubejs:cardinal")
    .soundType('metal')
    .resistance(160)
    .tagBlock('minecraft:mineable/pickaxe')
    .tagBlock('utopia:computer')
    .displayName('Computer')
    .requiresTool(true)
    .lightLevel(8 / 15)
    .unbreakable()
    .tagBlock('c:hidden_from_recipe_viewers')
    .tagBlock('create:non_movable')
    .tagBlock('minecraft:dragon_immune')
    .tagBlock('minecraft:wither_immune')
    .tagBlock('minecraft:features_cannot_replace')
    .tagBlock('nova_structures:explosion_resistand')
    .tagBlock('minecraft:lava_pool_stone_cannot_replace')


  event.create('utopia:broken_computer', "kubejs:cardinal")
    .soundType('metal')
    .hardness(2)
    .resistance(6)
    .tagBlock('minecraft:mineable/pickaxe')
    .displayName('Smashed Computer')
    .requiresTool(false)

  event.create('utopia:computer_block_terminal', "kubejs:cardinal")
    .soundType('metal')
    .hardness(2)
    .resistance(6)
    .tagBlock('minecraft:mineable/pickaxe')
    .tagBlock('c:hidden_from_recipe_viewers')
    .tagBlock('utopia:computer')
    .tagBlock('utopia:computer/working')
    .displayName('Computer')
    .requiresTool(false)
    .lightLevel(6 / 15)
    .randomTick(tick => {
      let { level, block } = tick
      let roll = Math.random()

      if (roll < 0.1 && level.dayTime % 24000 >= 13000) {
        playSound(level, block, 'utopia:computer_terminal_ambient', 0.3, 1.0)
      } else if (roll < 0.2) {
        playSound(level, block, 'utopia:computer_terminal_ambient', 0.3, 1.2)
      }
    })

  event.create('utopia:computer_block_data', "kubejs:cardinal")
    .soundType('metal')
    .hardness(2)
    .resistance(6)
    .tagBlock('minecraft:mineable/pickaxe')
    .tagBlock('c:hidden_from_recipe_viewers')
    .tagBlock('utopia:computer')
    .tagBlock('utopia:computer/working')
    .displayName('Computer')
    .requiresTool(false)
    .lightLevel(6 / 15)
    .randomTick(tick => {
      let { level, block } = tick
      let roll = Math.random()

      if (roll < 0.1 && level.dayTime % 24000 >= 13000) {
        playSound(level, block, 'utopia:computer_data_creepy', 0.3, 1.0)
      } else if (roll < 0.2) {
        playSound(level, block, 'utopia:computer_data_ambient', 0.3, 1.2)
      }
    })

  event.create('utopia:computer_block_space', "kubejs:cardinal")
    .soundType('metal')
    .hardness(2)
    .resistance(6)
    .tagBlock('minecraft:mineable/pickaxe')
    .tagBlock('c:hidden_from_recipe_viewers')
    .tagBlock('utopia:computer')
    .tagBlock('utopia:computer/working')
    .displayName('Computer')
    .requiresTool(false)
    .lightLevel(5 / 15)
    .randomTick(tick => {
      let { level, block, server } = tick
      let roll = Math.random()

      if (roll < 0.1) {
        playSound(level, block, 'utopia:computer_space_creepy', 0.3, 1.0)
      }
      else if (roll < 0.25 && level.dayTime % 24000 >= 13000) {
        playSound(level, block, 'utopia:computer_space_ambient', 0.3, 1.0)
      }
      else if (roll < 0.3 && level.isThundering() && level.getBlock(block.x, block.y + 1, block.z).id === 'minecraft:lightning_rod'
        && playSound(level, block, 'utopia:computer_space_badsignal', 1.0, 1.0)) {
        let ctx = {
          x: block.x, y: block.y, z: block.z,
          dim: level.dimension,
          facing: block.properties.get('facing') || 'north'
        }

        block.set('utopia:computer_block_badsignal', { facing: ctx.facing })

        server.scheduleInTicks(212, () => {
          try {
            level.runCommandSilent(`playsound utopia:computer_smash block @a ${ctx.x + 0.5} ${ctx.y + 0.5} ${ctx.z + 0.5} 1.0 1.0`)
            server.getLevel(ctx.dim)?.getBlock(ctx.x, ctx.y, ctx.z).set('utopia:broken_computer', { facing: ctx.facing })

            level.runCommandSilent(`particle minecraft:explosion_emitter ${ctx.x + 0.5} ${ctx.y + 0.5} ${ctx.z + 0.5} 0 0 0 1 1`)
            level.runCommandSilent(`advancement grant @a[x=${ctx.x},y=${ctx.y},z=${ctx.z},distance=..10] only utopia:voices_of_the_void`)
          } catch (e) {
            console.log('[utopia] scheduleInTicks callback threw:', e)
          }
        })
      }
    })
})