ServerEvents.recipes(event => {

    event.recipes.create.mixing('utopia:catalyst', [Item.of('minecraft:emerald', 8), 'minecraft:heart_of_the_sea']).heated()
})