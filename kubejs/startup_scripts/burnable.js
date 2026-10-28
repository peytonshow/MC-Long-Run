ItemEvents.modification(event => {
    event.modify('minecraft:moss_block', item => {
        item.burnTime = 300
    })
    event.modify('minecraft:moss_carpet', item => {
        item.burnTime = 100
    })
})