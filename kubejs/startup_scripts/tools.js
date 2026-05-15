ItemEvents.modification(event => {



    // Hoez
    event.modify('minecraft:wooden_hoe', item => {
        item.maxDamage = 14
    })
    event.modify('minecraft:stone_hoe', item => {
        item.maxDamage = 38
    })
    event.modify('minecraft:golden_hoe', item => {
        item.maxDamage = 168
    })
    event.modify('minecraft:iron_hoe', item => {
        item.maxDamage = 195
    })


    event.modify('minecraft:trident', item => {
        item.maxDamage = 325
    })

    // Gold Durability Buffs

    event.modify('spearsmod:golden_spear', item => {
        item.maxDamage = 45
    })

    event.modify('minecraft:golden_sword', item => {
        item.maxDamage = 225
    })
    event.modify('minecraft:golden_axe', item => {
        item.maxDamage = 225
    })
    event.modify('minecraft:golden_pickaxe', item => {
        item.maxDamage = 225
    })
    event.modify('minecraft:golden_shovel', item => {
        item.maxDamage = 225
    })
    event.modify('minecraft:golden_helmet', item => {
        item.maxDamage = 152
    })
    event.modify('minecraft:golden_chestplate', item => {
        item.maxDamage = 220
    })
    event.modify('minecraft:golden_leggings', item => {
        item.maxDamage = 206
    })
    event.modify('minecraft:golden_boots', item => {
        item.maxDamage = 179
    })


    // Early tools
    event.modify('spearsmod:wooden_spear', item => {
        item.maxDamage = 5
    })
    event.modify('minecraft:wooden_sword', item => {
        item.maxDamage = 16
    })
    event.modify('minecraft:wooden_axe', item => {
        item.maxDamage = 22
    })
    event.modify('minecraft:wooden_pickaxe', item => {
        item.maxDamage = 18
    })
    event.modify('minecraft:wooden_shovel', item => {
        item.maxDamage = 20
    })
    event.modify('minecraft:flint_and_steel', item => {
        item.maxDamage = 12
    })

})


