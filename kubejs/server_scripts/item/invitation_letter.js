ItemEvents.rightClicked('utopia:letter_of_invitation', event => {
  const { player, level, item } = event
  if (level.isClientSide()) return

  const dim = String(level.dimension)
  const inNether = dim.includes('the_nether')
  const inEnd = dim.includes('the_end')

  const SLOW_FALL_TICKS = 20 * 60 * 10

  function spawnVillager(baby, x, y, z, slowFall) {
    const villager = level.createEntity('minecraft:villager')
    villager.setPosition(x, y, z)
    if (baby) villager.mergeNbt({ Age: -24000 })
    villager.spawn()
    if (slowFall) {
      villager.potionEffects.add('minecraft:slow_falling', SLOW_FALL_TICKS, 0, false, false)
    }
  }

  // Consume the letter
  item.shrink(1)
  player.addItemCooldown('utopia:letter_of_invitation', 10)

  if (inNether || inEnd) {
    // Unreliable delivery: 0 or 1 villager, right on top of the player
    if (Math.random() < 0.5) {
      spawnVillager(Math.random() < 0.33, player.x, player.y, player.z, false)
    }
    player.tell('The letter fizzles... the mail service doesn\'t reach this far.')
    return
  }

  // Everywhere else: drop 2 adults + 1 baby from the top of the world
  const topY = level.maxBuildHeight - 2
  spawnVillager(false, player.x + 0.5, topY, player.z, true)
  spawnVillager(false, player.x - 0.5, topY, player.z, true)
  spawnVillager(true, player.x, topY, player.z + 0.5, true)

  player.tell('Your invitation has been delivered!')
})