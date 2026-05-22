ItemEvents.modification(event => {
    event.modify('diy_campfires:firewood', item => {
        item.burnTime = 600
    })
})
