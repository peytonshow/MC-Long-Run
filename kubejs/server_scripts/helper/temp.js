ServerEvents.commandRegistry(event => {
  const { commands } = event
  event.register(
    commands.literal('utopiaprint_visible_items').executes(context => {
      const hiddenTag = Ingredient.of('#c:hidden_from_recipe_viewers')
      let count = 0

      Ingredient.all.getItemIds().forEach(itemId => {
        if (!hiddenTag.test(itemId)) {
          console.info(itemId)
          count++
        }
      })

      context.source.sendSuccess(Text.green(`Printed ${count} items to logs/kubejs/server.txt`), true)
      return 1
    })
  )
})


const BuiltInRegistries = Java.loadClass('net.minecraft.core.registries.BuiltInRegistries')
const DataComponents = Java.loadClass('net.minecraft.core.component.DataComponents')

ServerEvents.commandRegistry(event => {
  const { commands: Commands, arguments: Arguments } = event

  const listFood = (ctx, threshold) => {
    const results = []

    BuiltInRegistries.ITEM.forEach(item => {
      const stack = item.getDefaultInstance()
      if (stack.isEmpty()) return
      if (stack.has(DataComponents.FOOD) && stack.getMaxStackSize() > threshold) {
        results.push({
          id: String(BuiltInRegistries.ITEM.getKey(item)),
          size: stack.getMaxStackSize()
        })
      }
    })

    results.sort((a, b) => b.size - a.size || a.id.localeCompare(b.id))

    ctx.source.sendSystemMessage(
      Text.gold(`Food items with stack size over ${threshold} (${results.length}):`)
    )
    results.forEach(r => {
      ctx.source.sendSystemMessage(
        Text.gray(' - ').append(Text.white(r.id)).append(Text.yellow(` (${r.size})`))
      )
    })

    return results.length
  }

  event.register(
    Commands.literal('utopiabigfood')
      .requires(src => src.hasPermission(2))
      .executes(ctx => listFood(ctx, 16))
      .then(
        Commands.argument('over', Arguments.INTEGER.create(event))
          .executes(ctx => listFood(ctx, Arguments.INTEGER.getResult(ctx, 'over')))
      )
  )
})