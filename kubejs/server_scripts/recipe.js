ServerEvents.recipes(event => {
    event.remove({ input: 'minecraft:gravel', type: 'create:splashing' })
    event.remove({ output: 'oreganized:glance'})
    event.remove({ output: 'create:brass_ingot', type: 'create:mixing' })
    event.remove({ output: 'minecraft:paper', type: 'minecraft:crafting_shaped' })
    event.remove({ output: 'minecraft:paper', type: 'minecraft:crafting_shapeless' })
    event.remove({ output: 'minecraft:glass_bottle', type: 'minecraft:crafting_shaped' })
    event.remove({ output: 'minecraft:gold_nugget', type: 'create:splashing' })
    //////

    event.shaped(
        Item.of('utopia:platinum_sword'),[
            'A  ',
            'A  ',
            'B  '
        ],{
            A: 'utopia:platinum_ingot',
            B: 'minecraft:stick'
    })

    event.shaped(
        Item.of('supplementaries:jar'),[
            'A  ',
            'B  ',
            '   '
        ],{
            A: '#minecraft:wooden_slabs',
            B: 'utopia:beaker'
    })

    //////
    event.recipes.create.mixing('create:brass_ingot', [
        'utopia:uneven_raw_brass_precursor'
    ]).heated()        
    event.recipes.create.splashing([CreateItem.of('create:crushed_raw_zinc', 0.9),CreateItem.of('create:crushed_raw_copper')], 'utopia:uneven_raw_brass_precursor')

    event.recipes.create.milling(CreateItem.of('create:crushed_raw_copper', 0.8), [
        'minecraft:raw_copper'], 300)
    event.recipes.create.milling(CreateItem.of('create:crushed_raw_zinc', 0.8), [
        'create:raw_zinc'], 300)
    event.recipes.create.milling(CreateItem.of('create:crushed_raw_iron', 0.8), [
        'minecraft:raw_iron'], 300)
    event.recipes.create.milling(CreateItem.of('create:crushed_raw_gold', 0.8), [
        'minecraft:raw_gold'], 300)
    event.recipes.create.milling(CreateItem.of('create:crushed_raw_silver', 0.8), [
        'oreganized:raw_silver'], 300)
    event.recipes.create.milling(CreateItem.of('create:crushed_raw_lead', 0.8), [
        'oreganized:raw_lead'], 300)
    event.recipes.create.milling(CreateItem.of('3x oreganized:refined_asbestos', 0.75), [
        'oreganized:raw_asbestos'], 300)

    // Catalyst
    event.recipes.create.mixing('utopia:catalyst', [
        Item.of('quark:moss_paste', 16),
        'minecraft:heart_of_the_sea']).heated()
    event.recipes.create.mixing(Item.of('utopia:catalyst', 2), [
        Item.of('quark:moss_paste', 16),
        Item.of('quark:diamond_heart', 3),
        'utopia:catalyst']).heated()
    event.recipes.create.mixing([
        CreateItem.of('2x create:crushed_raw_iron', 0.75),
        CreateItem.of('utopia:catalyst', 0.95)
    ], [
        'utopia:catalyst', 'create:crushed_raw_iron'
    ])
    event.recipes.create.mixing([
        CreateItem.of('2x create:crushed_raw_zinc', 0.75),
        CreateItem.of('utopia:catalyst', 0.95)
    ], [
        'utopia:catalyst', 'create:crushed_raw_zinc'
    ])
    event.recipes.create.mixing([
        CreateItem.of('2x create:crushed_raw_gold', 0.75),
        CreateItem.of('utopia:catalyst', 0.95)
    ], [
        'utopia:catalyst', 'create:crushed_raw_gold'
    ])
    //

    // Tumbling
    event.recipes.create.mixing([
        CreateItem.of('minecraft:amethyst_shard', 0.90),
        CreateItem.of('create:crushed_raw_iron', 0.05)
    ], [
       Fluid.of('minecraft:water', 10), 'minecraft:amethyst_shard', 'minecraft:gravel'
    ])
    event.recipes.create.mixing([
        CreateItem.of('minecraft:amethyst_shard', 0.80),
        CreateItem.of('create:crushed_raw_gold', 0.075)
    ], [
        Fluid.of('minecraft:water', 10),'minecraft:amethyst_shard', 'minecraft:red_sand'
    ])
    event.recipes.create.mixing([
        CreateItem.of('minecraft:amethyst_shard', 0.90),
        CreateItem.of('1x minecraft:bone', 0.075)
    ], [
        Fluid.of('minecraft:water', 10),'minecraft:amethyst_shard', Ingredient.of('#minecraft:soul_fire_base_blocks')
    ])
    event.recipes.create.mixing([
        CreateItem.of('minecraft:amethyst_shard', 0.25),
        CreateItem.of('1x minecraft:diamond', 0.005)
    ], [
        Fluid.of('minecraft:water', 10),'minecraft:amethyst_shard',  'minecraft:cobbled_deepslate'
    ])

    // Gunpowder
    event.recipes.create.mixing([
        CreateItem.of('4x minecraft:gunpowder', 0.35),
        CreateItem.of('3x minecraft:gunpowder', 0.5),
        CreateItem.of('2x minecraft:gunpowder', 0.6),
    ], [
        '8x minecraft:sugar',
        Ingredient.of('#minecraft:coals')
    ]).heated()


    // Spices    
    event.recipes.create.milling([
        CreateItem.of('2x utopia:pepper', 0.20),
        CreateItem.of('utopia:pepper', 0.40)], [
        'minecraft:blackstone'
    ])
    event.recipes.create.milling([
        CreateItem.of('2x utopia:sea_salt', 0.10),
        CreateItem.of('utopia:sea_salt', 0.60)], [
        'minecraft:calcite'
    ])
    Ingredient.of('#utopia:spices').stacks.forEach(item => {
        event.remove({ input: item, type: 'create:crush' })
    })


    // Gravel
    event.recipes.create.crushing([
        CreateItem.of('3x minecraft:gravel')], [
        'minecraft:cobbled_deepslate'
    ])

    // Clothes Washing
    Ingredient.of('#utopia:washable').stacks.forEach(item => {
        event.recipes.create.mixing(item, [item, Fluid.of('minecraft:water', 250)]).processingTime(3000)
    })

    // Moissanite & Graphite
    event.recipes.create.compacting([
        CreateItem.of('utopia:graphite_ingot', 0.9),
    ], [
        'minecraft:coal_block'
    ]).heated()
    event.recipes.create.compacting([
        CreateItem.of('utopia:moissanite', 0.60),
    ], [
        '12x utopia:silica_dust',
        '12x utopia:graphite_ingot'
    ]).superheated()
     event.recipes.create.deploying('utopia:pencil', ['minecraft:stick', 'utopia:graphite_nugget'])

    // Silica
    event.recipes.create.crushing([
        CreateItem.of('farmersdelight:rice', 0.50),
        CreateItem.of('utopia:silica_dust', 0.15)
    ], [
        'farmersdelight:rice_panicle'
    ])
    event.recipes.create.milling([
        '3x utopia:silica_dust'
    ], [
        'minecraft:quartz'
    ])
    event.recipes.create.crushing([
        CreateItem.of('utopia:silica_dust', 0.70),
    ], [
        'minecraft:sand'
    ])
    event.recipes.create.compacting([
        CreateItem.of('minecraft:glass_bottle'),
    ], [
        'utopia:silica_dust'
    ]).heated()
    event.recipes.create.compacting([
        CreateItem.of('utopia:beaker'),
    ], [
        '3x utopia:silica_dust',
        'minecraft:glass_bottle'
    ]).heated()

    // Chemistry!!!
    const beakers = [
        { full: 'utopia:beaker_nitrogen', empty: 'utopia:beaker', fluid: 'utopia:liquid_nitrogen', amount: 200 },
        { full: 'utopia:beaker_oxygen', empty: 'utopia:beaker', fluid: 'utopia:liquid_oxygen', amount: 200 },
        { full: 'utopia:beaker_hydrogen', empty: 'utopia:beaker', fluid: 'utopia:liquid_hydrogen', amount: 200 },
        { full: 'utopia:beaker_ammonia', empty: 'utopia:beaker', fluid: 'utopia:ammonia', amount: 200 },
        { full: 'utopia:beaker_nitric_acid', empty: 'utopia:beaker', fluid: 'utopia:nitric_acid', amount: 200 },
        { full: 'utopia:beaker_bleach', empty: 'utopia:beaker', fluid: 'utopia:bleach', amount: 200 },
        { full: 'utopia:beaker_propylene_glycol', empty: 'utopia:beaker', fluid: 'utopia:propylene_glycol', amount: 200 }
    ];

    for (let item of beakers) {
        event.recipes.create.emptying([Fluid.of(item.fluid, item.amount), item.empty], item.full);
        event.recipes.create.filling(item.full, [Fluid.of(item.fluid, item.amount), item.empty]);
    }

    event.recipes.create.mixing([
        Fluid.of('utopia:propylene_glycol', 100)
    ], [
        Ingredient.of('#minecraft:coals'),
        Fluid.of('utopia:liquid_hydrogen', 80),
        Fluid.of('utopia:liquid_oxygen', 20)
    ]).superheated()

    event.recipes.create.mixing([
        Fluid.of('utopia:liquid_oxygen', 80),
        Fluid.of('utopia:liquid_hydrogen', 120)
    ], [
        Fluid.of('minecraft:water', 200),'create:experience_nugget'
    ]).heated()

    
    // Neon
    event.recipes.create.compacting([
        CreateItem.of('utopia:neon_block', 0.85),
    ], [
        '16x quark:bottled_cloud',
        '8x minecraft:blue_ice',
        '8x minecraft:glow_ink_sac'
    ])

    // Gold + Platinum
    event.recipes.create.splashing([
        '9x minecraft:gold_nugget',
        CreateItem.of('minecraft:quartz', 0.5),
        CreateItem.of('utopia:platinum_nugget', 0.01)
    ], [
        'create:crushed_raw_gold'
    ])



    // Remove crushing for milled-only items
    event.remove({ output: 'utopia:sea_salt', type: 'create:crush' })
    event.remove({ output: 'utopia:pepper', type: 'create:crush' })
})