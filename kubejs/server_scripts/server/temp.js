ServerEvents.commandRegistry(event => {
  const { commands } = event
  event.register(
    commands.literal('print_visible_items').executes(context => {
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