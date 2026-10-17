StartupEvents.registry('item', event => {
  event.create('utopia:recall_potion')
    .displayName('Recall Potion')
    .maxStackSize(1)
    .useAnimation('drink')
    .useDuration(stack => 32)
    .glow(true)
    .use((level, player, hand) => true) // allows holding right-click to drink
    .finishUsing((stack, level, entity) => {
      if (!entity.isPlayer()) return stack

      const data = stack.customData // the custom_data component as a compound tag

      if (!data || !data.contains('dim')) {
        // component is empty: just show the message
        entity.tell('And before you knew it, you were there!')
      } else if (!level.isClientSide()) {
        entity.teleportTo(
          data.getString('dim'),
          data.getDouble('x'),
          data.getDouble('y'),
          data.getDouble('z'),
          entity.yaw,
          entity.pitch
        )
      }

      // consume the potion and hand back an empty bottle
      if (!entity.isCreative()) {
        stack.shrink(1)
        if (stack.isEmpty()) return Item.of('minecraft:glass_bottle')
        entity.give('minecraft:glass_bottle')
      }
      return stack
    })
})