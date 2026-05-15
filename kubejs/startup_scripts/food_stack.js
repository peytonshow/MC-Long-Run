ItemEvents.modification(event => {
    let count = 0

    // Get every item ID from the tag
    let foodTagItems = Ingredient.of('#c:foods').getItemIds()

    // Run each item ID through the modification script
    foodTagItems.forEach(id => {
        event.modify(id, item => {
            if (item.maxStackSize > 16) {
                item.maxStackSize = 16
                count++
            }
        })
    })

    console.log(`Modified ${count} items from c:foods`)
})
