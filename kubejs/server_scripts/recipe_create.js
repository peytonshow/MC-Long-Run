ServerEvents.recipes(event => {

    event.recipes.create.mixing('utopia:catalyst', [
        Item.of('quark:moss_paste', 16),
        Item.of('minecraft:emerald', 32),
        'minecraft:heart_of_the_sea']).heated()
    event.recipes.create.mixing(Item.of('utopia:catalyst', 2), [
        Item.of('quark:moss_paste', 8),
        Item.of('royalvariations:royal_bone_meal', 1),
        'utopia:catalyst']).heated()


    event.recipes.create.mixing([
        CreateItem.of('minecraft:gunpowder', 0.75),
        CreateItem.of('minecraft:gunpowder', 0.4)
    ], [
        '2x minecraft:sugar',
        '#minecraft:coals'
    ]).heated()

    event.recipes.create.mixing([
        CreateItem.of('minecraft:iron_nugget', 0.08),
        CreateItem.of('minecraft:amethyst_shard', 0.95)
    ], [
        'minecraft:amethyst_shard', 'minecraft:gravel'
    ])


    event.recipes.create.mixing([
        CreateItem.of('minecraft:iron_nugget'),
        CreateItem.of('minecraft:iron_nugget', 0.12),
        CreateItem.of('utopia:catalyst', 0.99)
    ], [
        'utopia:catalyst', 'minecraft:iron_nugget'
    ])

    Ingredient.of('#utopia:washable').stacks.forEach(item => {
        event.recipes.create.splashing(item, item)
    })
})