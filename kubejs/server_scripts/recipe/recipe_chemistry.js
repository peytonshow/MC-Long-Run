// Chemistry recipes (split out of recipe_98a6ac.js)

ServerEvents.recipes(event => {

    fermenting(event, {
        ingredients: ['minecraft:rotten_flesh'],
        result: 'utopia:nitrogen',
        amount: 200
    })

    // Gunpowder
    event.recipes.create.crushing([
        CreateItem.of('6x utopia:sulfur_dust', 0.25),
        CreateItem.of('3x utopia:sulfur_dust', 0.5),
        'utopia:sulfur_dust'
    ], [
        'minecraft:potent_sulfur'
    ])
    event.recipes.create.mixing([
        CreateItem.of('minecraft:gunpowder')
    ], [
        '4x minecraft:sugar',
        'minecraft:coal'
    ]).heated()
    event.recipes.create.mixing([
        CreateItem.of('3x minecraft:gunpowder')
    ], [
        '4x minecraft:sugar',
        'minecraft:coal',
        'minecraft:blaze_powder'
    ]).heated()
    event.recipes.create.mixing(
        CreateItem.of('3x minecraft:gunpowder'),
        [
        'utopia:sulfur_dust',
        'minecraft:coal',
        'utopia:ammonium_nitrate'
    ]).heated()
    event.recipes.create.mixing([
        CreateItem.of('2x minecraft:bone_meal', 0.5),
        CreateItem.of('minecraft:bone_meal', 0.5)
    ], [
        'utopia:ammonium_nitrate',
        Fluid.of('minecraft:water', 250),
    ]).processingTime(200)

    replaceRecipe(event, { output: 'create:rose_quartz', type: 'create:mixing' },
        () => event.recipes.create.mixing([
            CreateItem.of('create:rose_quartz', 0.83)
        ], [
            'minecraft:quartz',
            '8x minecraft:glowstone_dust',
            Fluid.of('utopia:nitric_acid', 200),
            'create:experience_nugget'
        ]).processingTime(200)
    )

    // Silica
    event.recipes.create.mixing([
        CreateItem.of('7x utopia:silica_dust'),
        CreateItem.of('6x utopia:silica_dust', 0.9),
        CreateItem.of('2x minecraft:quartz', 0.4)
    ], [
        'minecraft:quartz_block',
        Fluid.of('utopia:nitric_acid', 100)
    ]).processingTime(160)
    event.recipes.create.milling([
        '3x utopia:silica_dust'
    ], [
        'minecraft:quartz'
    ])
    event.recipes.create.crushing([
        CreateItem.of('utopia:silica_dust', 0.55),
    ], [
        'minecraft:sand'
    ])
    replaceRecipe(event, { output: 'minecraft:glass_bottle', type: 'minecraft:crafting_shaped' },
        () => event.recipes.create.compacting([
            CreateItem.of('minecraft:glass_bottle'),
        ], [
            'utopia:silica_dust'
        ]).heated()
    )
    event.recipes.create.compacting([
        CreateItem.of('utopia:beaker'),
    ], [
        '1x minecraft:black_dye',
        '2x minecraft:glass_bottle'
    ]).heated()

    // Chemistry!!!
    const beakers = [
        { full: 'utopia:beaker_nitrogen', empty: 'utopia:beaker', fluid: 'utopia:nitrogen', amount: 200 },
        { full: 'utopia:beaker_oxygen', empty: 'utopia:beaker', fluid: 'utopia:oxygen', amount: 200 },
        { full: 'utopia:beaker_hydrogen', empty: 'utopia:beaker', fluid: 'utopia:hydrogen', amount: 200 },
        { full: 'utopia:beaker_ammonia', empty: 'utopia:beaker', fluid: 'utopia:ammonia', amount: 200 },
        { full: 'utopia:beaker_nitric_acid', empty: 'utopia:beaker', fluid: 'utopia:nitric_acid', amount: 200 },
        { full: 'utopia:beaker_bleach', empty: 'utopia:beaker', fluid: 'utopia:bleach', amount: 200 },
        { full: 'utopia:beaker_propylene_glycol', empty: 'utopia:beaker', fluid: 'utopia:propylene_glycol', amount: 200 }
    ];

    for (let item of beakers) {
        event.recipes.create.emptying([Fluid.of(item.fluid, item.amount), item.empty], item.full);
        event.recipes.create.filling(item.full, [Fluid.of(item.fluid, item.amount), item.empty]);
    }

    event.recipes.create.filling('supplementaries:lumisene_bottle', [Fluid.of('supplementaries:lumisene', 250), 'minecraft:glass_bottle'])

    event.recipes.create.compacting([
        'minecraft:glass_bottle',
        Fluid.of('utopia:nitrogen', 50),
    ], [
        'quark:cloud',
    ])
    event.recipes.create.mixing([
        Fluid.of('utopia:propylene_glycol', 1000)
    ], [
        Ingredient.of('#c:coal'),
        Fluid.of('utopia:hydrogen', 600),
        Fluid.of('utopia:oxygen', 400)
    ]).heated()
    event.recipes.create.mixing([
        CreateItem.of('utopia:sea_salt', .5),
        Fluid.of('utopia:oxygen', 200),
        Fluid.of('utopia:hydrogen', 400)
    ], [
        Fluid.of('minecraft:water', 600),
        '3x create:experience_nugget'
    ]).heated()
    event.recipes.create.mixing([
        'utopia:ammonium_nitrate'
    ], [
        Fluid.of('utopia:ammonia', 600),
        Fluid.of('utopia:nitric_acid', 600)
    ]).heated()

    event.recipes.create.mixing([
        Fluid.of('utopia:nitric_acid', 200)
    ], [
        Fluid.of('utopia:nitrogen', 200),
        Fluid.of('minecraft:water', 500)
    ])
    event.recipes.create.compacting([
        CreateItem.of('utopia:neon_block', 0.15),
        '16x minecraft:glass_bottle'
    ], [
        'create_enchantment_industry:super_experience_nugget',
        '16x quark:cloud',
        Fluid.of('utopia:propylene_glycol', 600),
        Fluid.ingredientOf('create:potion', {
            'create:potion_fluid_bottle_type': 'regular',
            'minecraft:potion_contents': {
                potion: 'quark:resilience',
            },
        }).withAmount(100)
    ])
    event.recipes.create.mixing([
        Fluid.of('utopia:bleach', 200)
    ], [
        '2x utopia:sea_salt',
        'supplementaries:ash',
        Fluid.of('minecraft:water', 200),
        Fluid.of('utopia:nitric_acid', 200)
    ]).heated().processingTime(300)

    // Ammonia
    // Haber Process
    event.recipes.create.compacting([
        Fluid.of('utopia:ammonia', 400)
    ], [
        Fluid.of('utopia:nitrogen', 200),
        Fluid.of('utopia:hydrogen', 600)
    ]).heated()
    // Ostwald Process
    event.recipes.create.mixing([
        Fluid.of('utopia:ammonia', 400),
        '9x utopia:platinum_nugget'
    ], [
        Fluid.of('utopia:nitric_acid', 200),
        Fluid.of('utopia:oxygen', 200),
        'utopia:platinum_ingot'
    ]).processingTime(100)


    event.recipes.create.compacting([
        '1x quark:cloud',
        'minecraft:heart_of_the_sea'
    ], [
        'minecraft:glass_bottle',
        'minecraft:heart_of_the_sea'
    ]).heated()
    event.recipes.create.compacting([
        Fluid.of('minecraft:water', 200),
        'minecraft:blue_ice',
        'minecraft:heart_of_the_sea'
    ], [
        'minecraft:blue_ice',
        'minecraft:heart_of_the_sea'
    ]).heated()
    event.recipes.create.mixing([
        CreateItem.of('utopia:garbage')
    ], [
        Fluid.of('utopia:propylene_glycol', 1000),
        Fluid.of('utopia:nitric_acid', 1000)
    ]).processingTime(200)

    //Garbage
    event.recipes.create.mixing([
        CreateItem.of('3x supplementaries:ash', 0.5),
        CreateItem.of('2x supplementaries:ash', 0.25),
        CreateItem.of('supplementaries:ash', 0.25),
    ], [
        'utopia:garbage',
        Fluid.of('utopia:nitric_acid', 200)
    ]).heated().processingTime(200)
    event.recipes.create.mixing([
        CreateItem.of('3x utopia:garbage', 0.5),
        CreateItem.of('2x utopia:garbage', 0.25),
        CreateItem.of('utopia:garbage', 0.25),
    ], [
        Fluid.of('utopia:ammonia', 200),
        Fluid.of('utopia:bleach', 200)
    ]).heated().processingTime(1000)

    // Graphite & Plastic
    event.recipes.create.compacting([
        CreateItem.of('utopia:graphite_ingot'),
    ], [
        'minecraft:coal_block'
    ]).heated()

    event.recipes.create.mixing([
        CreateItem.of('2x utopia:plastic_ingot'),
        CreateItem.of('utopia:plastic_ingot', 0.30)
    ], [
        'oreganized:refined_asbestos',
        Fluid.of('utopia:propylene_glycol', 400),
        Fluid.of('utopia:nitric_acid', 400)
    ]).heated().processingTime(600)

})