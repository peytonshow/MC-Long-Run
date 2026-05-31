ItemEvents.modification(event => {

    event.modify('spearsmod:wooden_spear', item => {
        item.burnTime = 200
    })
})
