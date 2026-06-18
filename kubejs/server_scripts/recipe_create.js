ServerEvents.recipes(event => {

    event.remove({ type: 'refurbished_furniture:cutting_board_slicing' })
    event.remove({ type: 'refurbished_furniture:cutting_board_combining' })
    event.remove({ input: 'minecraft:gravel', type: 'create:splashing' })
    event.remove({ output: 'oreganized:glance'})
    event.remove({ output: 'create:brass_ingot', type: 'create:mixing' })

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
        CreateItem.of('5x minecraft:iron_nugget', 0.20),
        CreateItem.of('3x create:zinc_nugget', 0.20),
        CreateItem.of('2x minecraft:gold_nugget', 0.20),
        CreateItem.of('utopia:catalyst', 0.99)
    ], [
        'utopia:catalyst', 'minecraft:gravel'
    ])
    //

    // Tumbling
    event.recipes.create.mixing([
        CreateItem.of('minecraft:raw_iron', 0.05),
        CreateItem.of('minecraft:amethyst_shard', 0.95)
    ], [
       Fluid.of('minecraft:water', 20), 'minecraft:amethyst_shard', 'minecraft:gravel'
    ])
    event.recipes.create.mixing([
        CreateItem.of('minecraft:raw_gold', 0.05),
        CreateItem.of('minecraft:amethyst_shard', 0.95)
    ], [
        Fluid.of('minecraft:water', 20),'minecraft:amethyst_shard', 'minecraft:red_sand'
    ])
    event.recipes.create.mixing([
        CreateItem.of('2x minecraft:quartz', 0.2),
        CreateItem.of('minecraft:amethyst_shard', 0.95)
    ], [
        Fluid.of('minecraft:water', 20),'minecraft:amethyst_shard', Ingredient.of('#minecraft:soul_fire_base_blocks')
    ])
    event.recipes.create.mixing([
        CreateItem.of('minecraft:gunpowder', 0.75),
        CreateItem.of('2x minecraft:gunpowder', 0.1)
    ], [
        '2x minecraft:sugar',
        '#minecraft:coals'
    ]).heated()





    event.recipes.create.milling([
        CreateItem.of('utopia:pepper', 0.20),
        CreateItem.of('utopia:pepper', 0.40)], [
        'minecraft:blackstone'
    ])
    event.recipes.create.milling([
        CreateItem.of('utopia:sea_salt', 0.10),
        CreateItem.of('utopia:sea_salt', 0.30)], [
        'minecraft:calcite'
    ])

    Ingredient.of('#utopia:spices').stacks.forEach(item => {
        event.remove({ input: item, type: 'create:crush' })
    })
    Ingredient.of('#utopia:washable').stacks.forEach(item => {
        event.recipes.create.splashing(item, item)
    })
})