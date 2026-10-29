// Forging
ServerEvents.recipes(event => {

    event.remove({ output: 'create:brass_ingot', type: 'create:mixing' })
    event.remove({ input: 'minecraft:gold_ingot', output: ['minecraft:netherite_ingot', 'oreganized:electrum_ingot']}) //alloy
 
    // Basic block-ification
    event.shapeless(Item.of('utopia:moissanite', 9), ['utopia:moissanite_block'])
    event.shaped('utopia:moissanite_block', [
        'AAA',
        'AAA',
        'AAA'
    ], {
        A: 'utopia:moissanite'
    })
    event.shapeless(Item.of('utopia:platinum_nugget', 9), ['utopia:platinum_ingot'])
    event.shaped('utopia:platinum_ingot', [
        'AAA',
        'AAA',
        'AAA'
    ], {
        A: 'utopia:platinum_nugget'
    })
    // Block of platinum?
 
    // De-sheet
    event.smelting('create:brass_ingot', 'create:brass_sheet').cookingTime(600)
    event.smelting('minecraft:copper_ingot', 'create:copper_sheet').cookingTime(600)
    event.smelting('minecraft:gold_ingot', 'create:golden_sheet').cookingTime(600)
    event.smelting('minecraft:iron_ingot', 'create:iron_sheet').cookingTime(600)


    const ingots = [
        { full: 'minecraft:copper_ingot', fluid: 'utopia:molten_copper', crushed : 'create:crushed_raw_copper', slagAmount : 25},
        { full: 'create:zinc_ingot', fluid: 'utopia:molten_zinc', crushed : 'create:crushed_raw_zinc', slagAmount : 25 },
        { full: 'create:brass_ingot', fluid: 'utopia:molten_brass' },
        { full: 'minecraft:iron_ingot', fluid: 'utopia:molten_iron', crushed : 'create:crushed_raw_iron', slagAmount : 50 },
        { full: 'oreganized:silver_ingot', fluid: 'utopia:molten_silver', crushed : 'create:crushed_raw_silver', slagAmount : 25 },
        { full: 'minecraft:gold_ingot', fluid: 'utopia:molten_gold', crushed : 'create:crushed_raw_gold', slagAmount : 25 },
        { full: 'utopia:platinum_ingot', fluid: 'utopia:molten_platinum' },
        { full: 'minecraft:netherite_scrap', fluid: 'utopia:molten_debrinium' },
        { full: 'minecraft:netherite_ingot', fluid: 'utopia:molten_netherite' },
        { full: 'oreganized:electrum_ingot', fluid: 'utopia:molten_electrum' },
        { full: 'oreganized:lead_ingot', fluid: 'oreganized:molten_lead', crushed : 'create:crushed_raw_lead', slagAmount : 75},
        { full: 'utopia:slag', fluid: 'utopia:molten_slag'}
    ];
    for (let item of ingots) {
        event.recipes.create.filling(item.full, [Fluid.of(item.fluid, 100), 'utopia:ingot_mold']);
        if(item.crushed && item.slagAmount){
            event.recipes.create.mixing(
                [Fluid.of(item.fluid, 200), Fluid.of('utopia:molten_slag', item.slagAmount)],
                [item.crushed, Ingredient.of('#utopia:flux')]
            ).heated()
        }
        event.recipes.create.mixing(Fluid.of(item.fluid, 100),
            [item.full, Ingredient.of('#utopia:flux')]
        ).heated()
    }
    
    // Rework tuff crushing
    event.recipes.create.compacting([
        CreateItem.of('minecraft:tuff', 0.25)
    ], [
        '10x minecraft:cobbled_deepslate',
    ]).processingTime(40).superheated()
    event.remove({ input: 'minecraft:tuff', type: 'create:crushing'})
    event.recipes.create.mixing([
        Fluid.of('utopia:molten_slag', 25),
        CreateItem.of('2x minecraft:gravel', .75)
    ], [
        'minecraft:tuff',
    ]).processingTime(40).heated()
    event.recipes.create.mixing([
        CreateItem.of('minecraft:copper_nugget', 0.1),
        CreateItem.of('minecraft:gold_nugget', 0.1),
        CreateItem.of('create:zinc_nugget', 0.15),
        CreateItem.of('2x minecraft:redstone', 0.1)
    ], [
        Fluid.of('utopia:molten_slag', 25),
        Fluid.of('utopia:nitric_acid', 25),
    ]).processingTime(30)


    event.recipes.create.mixing([Fluid.of('utopia:molten_netherite', 25), Fluid.of('utopia:molten_slag', 175)],
        [Fluid.of('utopia:molten_debrinium', 100), Fluid.of('utopia:molten_gold', 100)]
    ).heated()
    event.recipes.create.mixing([Fluid.of('utopia:molten_electrum', 25), Fluid.of('utopia:molten_slag', 175)],
        [Fluid.of('utopia:molten_silver', 100), Fluid.of('utopia:molten_gold', 100)]
    ).heated()
    event.recipes.create.mixing(Fluid.of('utopia:molten_brass', 200),
        [Fluid.of('utopia:molten_zinc', 100), Fluid.of('utopia:molten_copper', 100)]
    ).heated()
    event.recipes.create.mixing([
        CreateItem.of('create:powdered_obsidian', 0.65)
    ], [
        Fluid.of('minecraft:water', 50),Fluid.of('minecraft:lava', 50),
    ]).processingTime(15)
    event.shaped('utopia:ingot_mold', [
        'ABA',
        'ACA'
    ], {
        A: 'minecraft:clay_ball',
        B: 'create:sturdy_sheet',
        C: 'minecraft:clay',
    })
    replaceRecipe(event, { output: 'create:sturdy_sheet' },
        () => event.recipes.create.sequenced_assembly(
            [
                CreateItem.of('create:sturdy_sheet', 0.9),
                CreateItem.of('utopia:garbage', 0.1),
            ],
            'create:powdered_obsidian',
            [
                event.recipes.create.filling('create:unprocessed_obsidian_sheet',
                    ['create:unprocessed_obsidian_sheet', Fluid.sizedIngredientOf('#utopia:sturdy_sheet_fluids', 50)]), // 
                event.recipes.create.pressing('create:unprocessed_obsidian_sheet', 'create:unprocessed_obsidian_sheet'),
                event.recipes.create.pressing('create:unprocessed_obsidian_sheet', 'create:unprocessed_obsidian_sheet'),
            ]
        ).transitionalItem('create:unprocessed_obsidian_sheet').id('utopia:sturdy_sheet')
    )
});
