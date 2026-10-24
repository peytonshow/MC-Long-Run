console.log('RECALL POTION SCRIPT LOADED - v5')

StartupEvents.registry('item', event => {
  function getData(stack, level) {
    const vanilla = stack.customData
    if (vanilla && vanilla.contains('dim')) return vanilla
    try {
      const comps = stack.save(level.registryAccess()).getCompound('components')
      const npc = comps.getCompound('easy_npc:custom_data')
      if (npc.contains('dim')) return npc
    } catch (e) {
      console.error('Recall potion fallback failed: ' + e)
    }
    return vanilla
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
        entity.tell('[v5] finishUsing ran')
        const data = getData(stack, level)
        const sound = 'playsound minecraft:entity.enderman.teleport player @a ~ ~ ~ 1 1'

        if (!data || !data.contains('dim')) {
          entity.tell('And before you knew it, you were there!')
        } else {
          entity.runCommandSilent(sound)
          entity.teleportTo(
            data.getString('dim'),
            data.getDouble('x'),
            data.getDouble('y'),
            data.getDouble('z'),
            entity.yaw,
            entity.pitch
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