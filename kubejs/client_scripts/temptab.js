ClientEvents.loggedIn(event => {
  const BuiltInRegistries = Java.loadClass('net.minecraft.core.registries.BuiltInRegistries')
  const registry = BuiltInRegistries.CREATIVE_MODE_TAB

  console.log('=== Creative Tabs ===')

  let count = 0
  registry.entrySet().forEach(entry => {
    let id = entry.getKey().location()
    let name = entry.getValue().getDisplayName().getString()
    console.log(`${id} -> ${name}`)
    count++
  })

  console.log(`Total: ${count} tabs`)
})
