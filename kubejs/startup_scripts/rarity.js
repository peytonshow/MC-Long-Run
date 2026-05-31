ItemEvents.modification(event => {
    event.modify('create_permits:ironpermit', item => {
        item.rarity = 'UNCOMMON'
    })
    event.modify('create_permits:gold_permit', item => {
        item.rarity = 'RARE'
    })
    event.modify('create_permits:diamondpermit', item => {
        item.rarity = 'EPIC'
    })
})

