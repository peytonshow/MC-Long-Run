ItemEvents.modification(event => {
    event.modify('diy_campfire:firewood', item => {
        item.burnTime = 600
    })
})
