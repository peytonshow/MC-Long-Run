ItemEvents.modification(event => {
    event.modify('minecraft:sweet_berries', item => {
        item.foodProperties = food => {
            food.fastToEat(true)
        }
    })
})
