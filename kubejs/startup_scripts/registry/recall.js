StartupEvents.registry('item', event => {
  // Recursively search a compound tag for one that has a 'dim' key
  const findDim = tag => {
    if (tag.contains('dim')) return tag
    for (const k of tag.getAllKeys()) {
      if (tag.getTagType(k) != 10) continue // 10 = compound
      const hit = findDim(tag.getCompound(k))
      if (hit) return hit
    }
    return null
  }

  const getData = (stack, level) => {
    try {
      return findDim(stack.save(level.registryAccess()))
    } catch (e) {
      console.error('Recall potion lookup failed: ' + e)
      return null
    }
  }

  event.create('utopia:recall_potion')
    .displayName('Recall Potion')
    .maxStackSize(1)
    .useAnimation('drink')
    .useDuration(stack => 32)
    .glow(true)
    .use((level, player, hand) => true)
    .finishUsing((stack, level, entity) => {
      if (!entity.isPlayer()) return stack

      if (!level.isClientSide()) {

        const data = getData(stack, level)
        const sound = 'playsound minecraft:entity.enderman.teleport player @a ~ ~ ~ 1 1'

        if (!data) {
          entity.tell('And before you knew it, you were there!')
        } else {
          entity.runCommandSilent(sound)
          entity.teleportTo(
            data.getString('dim'), data.getDouble('x'), data.getDouble('y'), data.getDouble('z'),
            entity.yaw, entity.pitch
          )
          entity.runCommandSilent(sound)
        }
      }

      if (!entity.isCreative()) {
        stack.shrink(1)
        if (stack.isEmpty()) return Item.of('minecraft:glass_bottle')
        if (!level.isClientSide()) entity.give('minecraft:glass_bottle')
      }
      return stack
    })
})