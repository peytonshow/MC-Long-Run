ServerEvents.tags('item', event => {

    //7574201914505645599
    const addBill = (item) => {
        event.add('utopia:bills', item)
        event.add('utopia:currency', item)
    };
    const addCoin = (item) => {
        event.add('utopia:coins', item)
        event.add('utopia:currency', item)
    };

    event.removeAllTagsFrom('utopia:used_handcuffs')
    event.removeAllTagsFrom('utopia:used_shackles')
    event.removeAllTagsFrom('utopia:crown')
    event.removeAllTagsFrom('utopia:shattering_crown')

    const makeWashable = (item) => {
        event.removeAllTagsFrom(item)
        event.add('utopia:washable', item)
    };

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

    event.add('c:hidden_from_recipe_viewers', 'utopia:incomplete_netherite_helmet')
    event.add('c:hidden_from_recipe_viewers', 'utopia:incomplete_netherite_chestplate')
    event.add('c:hidden_from_recipe_viewers', 'utopia:incomplete_netherite_leggings')
    event.add('c:hidden_from_recipe_viewers', 'utopia:incomplete_netherite_boots')
    event.add('c:hidden_from_recipe_viewers', 'utopia:incomplete_circuit_board')
    event.add('c:hidden_from_recipe_viewers', 'utopia:shattered_crown')
    event.add('c:hidden_from_recipe_viewers', 'utopia:used_handcuffs')
    event.add('c:hidden_from_recipe_viewers', 'utopia:used_shackles')
    event.add('c:hidden_from_recipe_viewers', 'brewinandchewin:pizza')
    event.add('c:hidden_from_recipe_viewers', 'farmersdelight:wheat_dough')
    event.add('c:hidden_from_recipe_viewers', 'vc_gliders:reinforced_paper_iron')
    event.add('c:hidden_from_recipe_viewers', 'vc_gliders:reinforced_paper_gold')
    event.add('c:hidden_from_recipe_viewers', 'vc_gliders:reinforced_paper_diamond')
    event.add('c:hidden_from_recipe_viewers', 'vc_gliders:reinforced_paper_netherite')
    event.add('c:hidden_from_recipe_viewers', 'frame_changer:crying_obsidian_brick_slab')
    event.add('c:hidden_from_recipe_viewers', 'frame_changer:crying_polished_obsidian_stairs')
    event.add('c:hidden_from_recipe_viewers', 'frame_changer:crying_obsidian_brick_stairs')
    event.add('c:hidden_from_recipe_viewers', 'frame_changer:crying_polished_obsidian')
    event.add('c:hidden_from_recipe_viewers', 'frame_changer:crying_polished_obsidian_wall')
    event.add('c:hidden_from_recipe_viewers', 'frame_changer:crying_obsidian_bricks')
    event.add('c:hidden_from_recipe_viewers', 'frame_changer:crying_obsidian_brick_wall')
    event.add('c:hidden_from_recipe_viewers', 'frame_changer:crying_polished_obsidian_slab')
    event.add('c:hidden_from_recipe_viewers', 'artifacts:eternal_steak')
    event.add('c:hidden_from_recipe_viewers', 'artifacts:everlasting_beef')
    event.add('c:hidden_from_recipe_viewers', 'unusual_furniture:discord')
    // event.add('c:hidden_from_recipe_viewers', 'supplementaries:quark/way_sign_ancient')
    // event.add('c:hidden_from_recipe_viewers', 'supplementaries:quark/cannon_boat_ancient')
    // event.add('c:hidden_from_recipe_viewers', 'supplementaries:quark/ancient_boat')
    event.add('utopia:circuitry', 'utopia:circuit')
    event.add('utopia:circuitry', 'create_connected:control_chip')

    event.add('supplementaries:throwable_bricks', 'minecraft:resin_brick')

    event.add('utopia:conductive_material', [
            'minecraft:copper_ingot',
            'minecraft:gold_ingot'
    ] )
    event.add('utopia:conductive_material', )

    event.add('utopia:rare_templates', 'minecraft:netherite_upgrade_smithing_template')
    event.add('utopia:rare_templates', 'oreganized:electrum_upgrade_smithing_template')
    event.add('utopia:rare_templates', 'musketmod:musket_upgrade_smithing_template')

    event.add('supplementaries:throwable_bricks', 'minecraft:Plastic_brick')

    event.add('guardvillagers:convertable_guard_items', 'musketmod:musket')
    event.add('guardvillagers:convertable_guard_items', 'musketmod:musket_with_bayonet')
    event.add('guardvillagers:convertable_guard_items', 'musketmod:musket_with_scope')
    event.add('guardvillagers:convertable_guard_items', 'musketmod:blunderbuss')
    event.add('guardvillagers:convertable_guard_items', 'musketmod:pistol')

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

    event.add('utopia:diamonds', 'minecraft:diamond')
    event.add('utopia:diamonds', 'utopia:moissanite')

    event.add('create:pulpifiable', 'farmersdelight:tree_bark')
    event.add('create:upright_on_belt', '#utopia:beakers')

    event.add('utopia:electricity', 'create:experience_nugget')


    event.add('create:upright_on_belt', [
        'utopia:circuit', 
        'create_connected:control_chip'
    ] )
    //event.add('create:upright_on_belt', '#c:dusts')

    event.remove('minecraft:needs_stone_tool', 'quark:sturdy_stone')
    event.add('minecraft:needs_iron_tool', 'quark:sturdy_stone')
    event.add('minecraft:mineable/pickaxe', 'quark:sturdy_stone')
})
