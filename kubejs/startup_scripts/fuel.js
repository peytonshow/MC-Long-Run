ItemEvents.modification(event => {
    event.modify('diy_campfires:firewood', item => {
        item.burnTime = 600
    })
    event.modify('spearsmod:wooden_spear', item => {
        item.burnTime = 200
    })
})
