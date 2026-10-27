// stop having really obscure minecraft knowledge ! ! ! 😡😡😡
BlockEvents.rightClicked('minecraft:spawner', event => {
  if (event.player.username == 'peytonshow') return

  if (event.item.id.endsWith('_spawn_egg') || event.item.hasTag('c:spawn_eggs')) {
    event.cancel()
  }
})