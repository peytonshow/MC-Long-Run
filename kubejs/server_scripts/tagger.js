// ServerEvents.tags('item', event => {
//     // Seeds
//     event.add('utopia:seed_common', [
//             'minecraft:wheat_seeds'
//     ] )

//     event.add('utopia:seed_uncommon', [
//             'supplementaries:flax_seeds',
//             'farmersdelight:tomato_seeds',
//             'farmersdelight:cabbage_seeds',
//     ] )

//     event.add('utopia:seed_rare', [
//             'minecraft:pumpkin_seeds',
//             'farmersdelight:rice_panicle',
//             'farmersdelight:onion',
//     ] )

//     event.add('utopia:seed_epic', [
//             'minecraft:beetroot_seeds',
//             'minecraft:potato',
//             'minecraft:carrot',
//     ] )

// })

ServerEvents.tags('item', event => {
    const addBill = (item) => {
        event.add('utopia:bills', item)
        event.add('utopia:currency', item)
    };
    const addCoin = (item) => {
        event.add('utopia:coins', item)
        event.add('utopia:currency', item)
    };

    // event.removeAllTagsFrom('utopia:used_handcuffs')
    // event.removeAllTagsFrom('utopia:used_shackles')
    event.removeAllTagsFrom('utopia:crown')
    event.removeAllTagsFrom('utopia:shattering_crown')

    const makeWashable = (item) => {
        event.removeAllTagsFrom(item)
        event.add('utopia:washable', item)
    };

    
    event.add('c:hidden_from_recipe_viewers', 'artifacts:artifacts')

    const makeKindaNotSword = (item) => {
        event.removeAllTagsFrom(item)
    };

    makeWashable('utopia:gilded_suit')
    makeWashable('utopia:gilded_pants')
    makeWashable('utopia:gilded_shoes')
    makeWashable('nirvana:deerstalker')
    makeWashable('utopia:detective_suit')
    makeWashable('utopia:detective_pants')
    makeWashable('utopia:detective_shoes')

    event.add('c:hidden_from_recipe_viewers', 'utopia:shattered_crown')


    event.add('c:tools', 'quark:trowel')
    event.add('c:tools/trowel', 'quark:trowel')

    
    event.add('utopia:circuitry', 'utopia:basic_circuit')
    event.add('utopia:circuitry', 'utopia:advanced_circuit')

    event.add('supplementaries:throwable_bricks', 'minecraft:resin_brick')
    event.add('utopia:conductive_material', [
            'minecraft:copper_ingot',
            'minecraft:gold_ingot'
    ] )

    // Transmutable
    event.add('utopia:transmutable_panes', [
        'create:framed_glass_pane',
        'create:horizontal_framed_glass_pane',
        'create:vertical_framed_glass_pane',
        'create:tiled_glass_pane',
        'minecraft:glass_pane'
    ] )
    event.add('utopia:transmutable_glass', [
        'create:framed_glass',
        'create:horizontal_framed_glass',
        'create:vertical_framed_glass',
        'create:tiled_glass',
        'minecraft:glass'
    ] )

    event.add('utopia:rare_templates', 'minecraft:netherite_upgrade_smithing_template')
    event.add('utopia:rare_templates', 'oreganized:electrum_upgrade_smithing_template')
    event.add('utopia:rare_templates', 'musketmod:musket_upgrade_smithing_template')


    event.add('guardvillagers:convertable_guard_items', 'musketmod:musket')
    event.add('guardvillagers:convertable_guard_items', 'musketmod:musket_with_bayonet')
    event.add('guardvillagers:convertable_guard_items', 'musketmod:musket_with_scope')
    event.add('guardvillagers:convertable_guard_items', 'musketmod:blunderbuss')
    event.add('guardvillagers:convertable_guard_items', 'musketmod:pistol')


    event.remove('artifacts:artifacts', [
        'artifacts:everlasting_beef',
        'artifacts:eternal_steak'
    ])

    event.remove('minecraft:enchantable/durability', [
        'utopia:platinum_sword',
        'utopia:platinum_pickaxe',
        'utopia:platinum_axe',
        'utopia:platinum_shovel',
        'utopia:platinum_hoe'
    ])

    addBill('utopia:1_dollar_bill')
    addBill('utopia:5_dollar_bill')
    addBill('utopia:20_dollar_bill')
    addBill('utopia:100_dollar_bill')
    addBill('utopia:500_dollar_bill')

    addCoin('utopia:coin_iron')
    addCoin('utopia:coin_iron_fractional')
    addCoin('utopia:coin_diamond')
    addCoin('utopia:coin_diamond_fractional')
    addCoin('utopia:coin_netherite')
    addCoin('utopia:coin_netherite_fractional')

    makeKindaNotSword('utopia:pencil')

    event.add('utopia:diamonds', [
        'minecraft:diamond', 
        'utopia:moissanite'
    ])

    event.add('utopia:bricks', [
        'minecraft:brick', 
        'minecraft:nether_brick', 
        'supplementaries:ash_brick',
        'minecraft:resin_brick', 
    ])

    event.add('create:pulpifiable', 'farmersdelight:tree_bark')
    event.add('create:upright_on_belt', '#utopia:beakers')

    event.add('utopia:electricity', 'create:experience_nugget')


    event.add('create:upright_on_belt', [
        'utopia:basic_circuit', 
        'utopia:advanced_circuit'
    ] )

    event.add('utopia:coal_blocks', [
        'minecraft:coal_block', 
        'quark:charcoal_block'
    ] )

    event.add('utopia:campfires', [
        'minecraft:campfire', 
        'minecraft:soul_campfire'
    ] )

    event.add('utopia:twine', [
        'supplementaries:rope', 
        'minecraft:string'
    ])

    event.add('utopia:remove_nether_roof', [
        "minecraft:netherrack",
        "minecraft:nether_quartz_ore",
        "minecraft:nether_gold_ore",
        "minecraft:blackstone",
        "minecraft:gravel",
        "minecraft:basalt"
    ] )

    event.add('utopia:upgradable_to_nether_template', [
        "minecraft:host_armor_trim_smithing_template",
        "minecraft:raiser_armor_trim_smithing_template",
        "minecraft:shaper_armor_trim_smithing_template",
        "minecraft:wayfinder_armor_trim_smithing_template"
    ] )

    event.add('utopia:leathers', [
        "minecraft:leather",
        "minecraft:rabbit_hide"
    ] )

    event.add('utopia:bolts', [
        "minecraft:iron_nugget",
        "create:zinc_nugget",
        "create:copper_nugget",
        "create:brass_nugget",
    ] )

    event.add('utopia:metal_beads', [
        "create:copper_nugget",
        "create:zinc_nugget",
        "create:brass_nugget",
        "minecraft:iron_nugget",
        "oreganized:lead_nugget",
    ] )

    event.add('utopia:normal_key', [
        "supplementaries:key",
        "storagedrawers:drawer_key",
        "storagedrawers:quantify_key",
        "storagedrawers:shroud_key",
        "storagedrawers:priority_key"
    ] )

    event.add('utopia:flux', [
        "supplementaries:ash",
        "utopia:silica_dust"
    ] )

    event.add('curios:back', [
        'musketmod:musket',
        'musketmod:musket_with_bayonet',
        'musketmod:musket_with_scope',
        'musketmod:blunderbuss'
    ])
    event.add('curios:belt', 'musketmod:pistol')
    event.add('curios:feet', 'musketmod:pistol')

    // used in recipe decor for decrafting
    event.add('utopia:stone_types/smooth_stone', [
        // "minecraft:smooth_stone",
        "utopia:smooth_stone_wall",
        "utopia:smooth_stone_stairs",
        
    ] )
    event.add('utopia:stone_types/polished_flint', [
        "utopia:polished_flint",
        "utopia:polished_flint_stairs",
        "utopia:polished_flint_wall",
        
    ] )
    event.add('utopia:stone_types/packed_mud', [
        // "minecraft:packed_mud",
        "minecraft:mud_bricks",
        "minecraft:mud_brick_stairs",
        "minecraft:mud_brick_wall",
        "quark:mud_pillar",
        "quark:carved_mud_bricks",
    ] )
    event.add('utopia:stone_types/bricks', [
        // "minecraft:packed_mud",
        "minecraft:bricks",
        "minecraft:brick_stairs",
        "minecraft:brick_wall"
    ] )

    // create buggin'
    event.add('create:stone_types/granite', [
        "minecraft:granite_stairs",
        "minecraft:granite_wall",
        "minecraft:polished_granite",
        "minecraft:polished_granite_stairs"
        
    ] )
    //event.add('create:upright_on_belt', '#c:dusts')

    event.remove('minecraft:needs_stone_tool', 'quark:sturdy_stone')
    event.add('minecraft:needs_iron_tool', 'quark:sturdy_stone')
    event.add('minecraft:mineable/pickaxe', 'quark:sturdy_stone')

    event.add('utopia:burlap', /^nirvana:.*woven_burlap.*$/)

    event.add('utopia:soap', [
        'supplementaries:soap',
        'utopia:beaker_bleach'
    ])
})

ServerEvents.tags('block', event => {
    const makeImmovable = (item) => {
        event.add('create:non_movable', item)
        event.add('minecraft:dragon_immune', item)
        event.add('minecraft:wither_immune', item)
        event.add('minecraft:features_cannot_replace', item)
        event.add('nova_structures:explosion_resistand', item)
        event.add('minecraft:lava_pool_stone_cannot_replace', item)
    };
    makeImmovable('selling_bin:selling_bin')

    // ONLY USE WITH TREELIABLE
    // event.add('c:ores', [
    //         "minecraft:diorite",
    //         "minecraft:granite",
    //         "minecraft:andesite",
    //         "minecraft:tuff",
    //         "minecraft:basalt",
    //         "create:limestone",
    //         "create:scoria",
    //         "create:scorchia",
    //         "create:crimsite",
    //         "create:ochrum",
    //         "create:veridium",
    //         "create:asurine",
    //         "minecraft:bone_block",
    //         "minecraft:amethyst_block",
    //         "minecraft:calcite",
    //     ] )

})

ServerEvents.tags('fluid', event => {
    event.add('utopia:molten', [
        "oreganized:molten_lead"
        // All other molten tags are handled by reg
    ] )

    event.add('utopia:sturdy_sheet_fluids', [
        'minecraft:lava',
        'utopia:molten_slag'
    ])
})
