// stop having really obscure minecraft knowledge ! ! ! 😡😡😡
BlockEvents.rightClicked('minecraft:spawner', event => {
  const item = event.item
  if (item.id.endsWith('_spawn_egg') || item.hasTag('c:spawn_eggs')) {
    event.cancel()
  }
})