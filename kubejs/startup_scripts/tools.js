ItemEvents.toolTierRegistry(event => {

  event.add("copper", (tier) => {
    tier.uses = 230
    tier.attackDamageBonus = 2
    tier.speed = 5
    tier.enchantmentValue = 13
    tier.repairIngredient = '#c:ingots/copper'
  })

  event.addBasedOnExisting("platinum", "netherite", (tier) => {
    tier.uses = 155;
    tier.attackDamageBonus = tier.attackDamageBonus + 2.0
    tier.speed = tier.speed + 3.0
    tier.enchantmentValue = 40
  });

  event.add('pencil', tier => {
    tier.uses = 20
    tier.speed = 2.0
    tier.attackDamageBonus = 2.0 
    tier.enchantmentValue = 0
  })
})

StartupEvents.registry('item', event => {
    event.create('utopia:pencil', 'sword').tier('pencil')
    // 『 Star Platinum 』
    event.create('utopia:platinum_sword', 'sword').tier('platinum').maxDamage(400).texture('utopia:item/platinum_sword')
    event.create('utopia:platinum_axe', 'axe').tier('platinum').maxDamage(400).texture('utopia:item/platinum_axe')
    event.create('utopia:platinum_pickaxe', 'pickaxe').tier('platinum').maxDamage(400).texture('utopia:item/platinum_pickaxe')
    event.create('utopia:platinum_shovel', 'shovel').tier('platinum').maxDamage(400).texture('utopia:item/platinum_shovel')
    event.create('utopia:platinum_hoe', 'hoe').tier('platinum').maxDamage(400).texture('utopia:item/platinum_hoe')

    // Copper
    event.create('minecraft:copper_sword', 'sword').tier('copper').texture('minecraft:item/copper_sword')
    event.create('minecraft:copper_axe', 'axe').tier('copper').texture('minecraft:item/copper_axe')
    event.create('minecraft:copper_pickaxe', 'pickaxe').tier('copper').texture('minecraft:item/copper_pickaxe')
    event.create('minecraft:copper_shovel', 'shovel').tier('copper').texture('minecraft:item/copper_shovel')
    event.create('minecraft:copper_hoe', 'hoe').tier('copper').texture('minecraft:item/copper_hoe')

    // Misc Tools
    event.create('utopia:platinum_pocketwatch').maxDamage(32)
})


ItemEvents.modification(event => {
    // Scribe
    event.modify('oreganized:scribe', item => {
        item.maxDamage = 650
    })

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

    event.modify('minecraft:golden_spear', item => {
        item.maxDamage = 45
    })

    event.modify('minecraft:golden_sword', item => {
        item.maxDamage = 150
    })
    event.modify('minecraft:golden_axe', item => {
        item.maxDamage = 170
    })
    event.modify('minecraft:golden_pickaxe', item => {
        item.maxDamage = 170
    })
    event.modify('minecraft:golden_shovel', item => {
        item.maxDamage = 170
    })
    event.modify('minecraft:golden_helmet', item => {
        item.maxDamage = 142
    })
    event.modify('minecraft:golden_chestplate', item => {
        item.maxDamage = 200
    })
    event.modify('minecraft:golden_leggings', item => {
        item.maxDamage = 196
    })
    event.modify('minecraft:golden_boots', item => {
        item.maxDamage = 169
    })


    // Early tools
    event.modify('minecraft:wooden_spear', item => {
        item.maxDamage = 85
    })
    event.modify('minecraft:wooden_sword', item => {
        item.maxDamage = 86
    })
    event.modify('minecraft:wooden_axe', item => {
        item.maxDamage = 92
    })
    event.modify('minecraft:wooden_pickaxe', item => {
        item.maxDamage = 88
    })
    event.modify('minecraft:wooden_shovel', item => {
        item.maxDamage = 90
    })
    event.modify('minecraft:flint_and_steel', item => {
        item.maxDamage = 12
    })
    event.modify('minecraft:stone_spear', item => {
        item.maxDamage = 85
    })
    event.modify('minecraft:stone_sword', item => {
        item.maxDamage = 86
    })
    event.modify('minecraft:stone_axe', item => {
        item.maxDamage = 92
    })
    event.modify('minecraft:stone_pickaxe', item => {
        item.maxDamage = 88
    })
    event.modify('minecraft:stone_shovel', item => {
        item.maxDamage = 90
    })

})


