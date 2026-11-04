ItemEvents.rightClicked('utopia:letter_of_invitation', event => {
  const { player, level, item } = event
  if (level.isClientSide()) return

  const dim = String(level.dimension)
  const inNether = dim.includes('the_nether')
  const inEnd = dim.includes('the_end')

  function spawnVillager(baby) {
    const villager = level.createEntity('minecraft:villager')
    villager.setPosition(player.x, player.y, player.z)
    if (baby) villager.mergeNbt({ Age: -24000 })
    villager.spawn()
  }

  // Consume the letter
  item.shrink(1)
  player.addItemCooldown('utopia:letter_of_invitation', 200)

  if (inNether || inEnd) {
    // Unreliable delivery: 0 or 1 villager, right on top of the player
    if (Math.random() < 0.5) {
      spawnVillager(Math.random() < 0.33)
    }
    player.tell('Your invitation has been delivered!')
    return
  }

  // Everywhere else: 2 adults + 1 baby, all on the player
  spawnVillager(false)
  spawnVillager(false)
  spawnVillager(true)

  player.tell('Your invitation has been delivered!')
})