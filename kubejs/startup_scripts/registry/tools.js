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
        tier.repairIngredient = '#c:ingots/platinum_nugget'
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
        tier.enchantmentValue = 0
        tier.repairIngredient = '#c:ingots/zinc'
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
