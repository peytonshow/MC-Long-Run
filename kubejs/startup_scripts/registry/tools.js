ItemEvents.toolTierRegistry(event => {

    // event.add("copper", (tier) => {
    //     tier.uses = 230
    //     tier.attackDamageBonus = 2
    //     tier.speed = 5
    //     tier.enchantmentValue = 13
    //     tier.repairIngredient = '#c:ingots/copper'
    // })

    event.addBasedOnExisting("platinum", "netherite", (tier) => {
        tier.uses = 175;
        tier.attackDamageBonus = tier.attackDamageBonus + 2.0
        tier.speed = tier.speed + 3.0
        tier.enchantmentValue = 40
    });

    event.add('pencil', tier => {
        tier.uses = 44
        tier.speed = 2.0
        tier.attackDamageBonus = 2.0
        tier.enchantmentValue = 0
    })

    // Rare
    event.addBasedOnExisting("sharkat", "iron", (tier) => {
        tier.uses = 555;
        tier.attackDamageBonus = tier.attackDamageBonus + 2.0
        tier.speed = tier.speed + 1.0
        tier.enchantmentValue = 8
    });
    event.addBasedOnExisting("classicnium", "iron", (tier) => {
        tier.uses = 999;
        tier.attackDamageBonus = tier.attackDamageBonus + 1.5
        tier.speed = tier.speed + 1.5
        tier.repairIngredient = '#c:ingots/silver'
    });
    event.addBasedOnExisting("bone_pick", "iron", (tier) => {
        tier.uses = 777;
        tier.attackDamageBonus = tier.attackDamageBonus + 3.0;
        tier.speed = tier.speed + 0.5;
        tier.enchantmentValue = 3;
    });
    event.addBasedOnExisting("gemerald", "gold", (tier) => {
        tier.uses = 333;
        tier.attackDamageBonus = tier.attackDamageBonus + 1.5
        tier.speed = tier.speed + 2.0
        tier.repairIngredient = '#c:gems/emerald'
    });
})

StartupEvents.registry('item', event => {
    // Impossible (Worldedit)
    event.create('utopia:builder_ax', 'axe').tier('wood').tag('utopia:special').tag('utopia:special/creative')
    event.create('utopia:builder_pickax', 'pickaxe').tier('wood').tag('utopia:special').tag('utopia:special/creative')

    // Rares
    event.create('utopia:pencil', 'sword').tier('pencil').tag('utopia:special')
    event.create('utopia:sharket_axe', 'axe').tier('sharkat').tag('utopia:special').tag('utopia:special/rare').tag('c:hidden_from_recipe_viewers')
    event.create('utopia:classicnium_axe', 'axe').tier('classicnium').tag('utopia:special').tag('utopia:special/rare').tag('c:hidden_from_recipe_viewers')
    event.create('utopia:bone_pick', 'pickaxe').tier('bone_pick').tag('utopia:special').tag('utopia:special/rare').tag('c:hidden_from_recipe_viewers')
    event.create('utopia:gemerald_shovel', 'shovel').tier('gemerald').tag('utopia:special').tag('utopia:special/rare').tag('c:hidden_from_recipe_viewers')
    // 『 Star Platinum 』
    event.create('utopia:platinum_sword', 'sword').tier('platinum').maxDamage(400).texture('utopia:item/platinum_sword')
    event.create('utopia:platinum_axe', 'axe').tier('platinum').maxDamage(400).texture('utopia:item/platinum_axe')
    event.create('utopia:platinum_pickaxe', 'pickaxe').tier('platinum').maxDamage(400).texture('utopia:item/platinum_pickaxe')
    event.create('utopia:platinum_shovel', 'shovel').tier('platinum').maxDamage(400).texture('utopia:item/platinum_shovel')
    event.create('utopia:platinum_hoe', 'hoe').tier('platinum').maxDamage(400).texture('utopia:item/platinum_hoe')

    // Copper - Only use if not using latest vanilla backport!
    // event.create('minecraft:copper_sword', 'sword').tier('copper').texture('minecraft:item/copper_sword')
    // event.create('minecraft:copper_axe', 'axe').tier('copper').texture('minecraft:item/copper_axe')
    // event.create('minecraft:copper_pickaxe', 'pickaxe').tier('copper').texture('minecraft:item/copper_pickaxe')
    // event.create('minecraft:copper_shovel', 'shovel').tier('copper').texture('minecraft:item/copper_shovel')
    // event.create('minecraft:copper_hoe', 'hoe').tier('copper').texture('minecraft:item/copper_hoe')
})


ItemEvents.modification(event => {

    const dur = [
        // Scribe
        { item: 'oreganized:scribe', durability: 1250 },

        // Hoez
        { item: 'minecraft:wooden_hoe', durability: 14 },
        { item: 'minecraft:stone_hoe', durability: 38 },
        { item: 'minecraft:golden_hoe', durability: 168 },
        { item: 'minecraft:iron_hoe', durability: 200 },

        // Misc
        { item: 'minecraft:trident', durability: 325 },
        { item: 'minecraft:flint_and_steel', durability: 12 },

        // Gold durability buffs
        { item: 'minecraft:golden_spear', durability: 45 },
        { item: 'minecraft:golden_sword', durability: 150 },
        { item: 'minecraft:golden_axe', durability: 170 },
        { item: 'minecraft:golden_pickaxe', durability: 170 },
        { item: 'minecraft:golden_shovel', durability: 170 },
        { item: 'minecraft:golden_helmet', durability: 142 },
        { item: 'minecraft:golden_chestplate', durability: 200 },
        { item: 'minecraft:golden_leggings', durability: 196 },
        { item: 'minecraft:golden_boots', durability: 169 },

        // Early tools (wood)
        { item: 'minecraft:wooden_spear', durability: 85 },
        { item: 'minecraft:wooden_sword', durability: 86 },
        { item: 'minecraft:wooden_axe', durability: 92 },
        { item: 'minecraft:wooden_pickaxe', durability: 88 },
        { item: 'minecraft:wooden_shovel', durability: 90 },

        // Early tools (stone)
        { item: 'minecraft:stone_spear', durability: 85 },
        { item: 'minecraft:stone_sword', durability: 86 },
        { item: 'minecraft:stone_axe', durability: 92 },
        { item: 'minecraft:stone_pickaxe', durability: 88 },
        { item: 'minecraft:stone_shovel', durability: 90 },

        // Iron buff
        { item: 'minecraft:iron_spear', durability: 750 },
        { item: 'minecraft:iron_sword', durability: 750 },
        { item: 'minecraft:iron_axe', durability: 750 },
        { item: 'minecraft:iron_pickaxe', durability: 750 },
        { item: 'minecraft:iron_shovel', durability: 750 },

        // Netherite
        { item: 'minecraft:netherite_spear', durability: 3000 },
        { item: 'minecraft:netherite_sword', durability: 3000 },
        { item: 'minecraft:netherite_axe', durability: 3000 },
        { item: 'minecraft:netherite_pickaxe', durability: 3000 },
        { item: 'minecraft:netherite_shovel', durability: 3000 },
    ];

    for (let entry of dur) {
        event.modify(entry.item, item => {
            item.maxDamage = entry.durability
        })
    }

})