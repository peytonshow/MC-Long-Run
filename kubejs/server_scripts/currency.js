ServerEvents.recipes(event => {
    event.recipes.create.deploying('8x utopia:bills_netherite', ['minecraft:netherite_ingot', 'utopia:encoder_stamp'])
    event.shapeless(Item.of('utopia:bills_netherite_slip', 2),['utopia:bills_netherite'])
    event.shapeless(Item.of('utopia:bills_netherite', 1),['utopia:bills_netherite_slip','utopia:bills_netherite_slip'])
    event.shapeless(Item.of('utopia:coin_diamond', 5),['utopia:bills_netherite'])


    event.recipes.create.deploying('8x utopia:coin_diamond', ['minecraft:diamond', 'utopia:encoder_stamp'])
    event.shapeless(Item.of('utopia:coin_diamond_fractional', 2),['utopia:coin_diamond'])
    event.shapeless(Item.of('utopia:coin_diamond', 1),['utopia:coin_diamond_fractional','utopia:coin_diamond_fractional'])
    event.shapeless(Item.of('utopia:coin_iron', 5),['utopia:coin_diamond'])


    event.recipes.create.deploying('8x utopia:coin_iron', ['minecraft:iron_ingot', 'utopia:encoder_stamp'])
    event.shapeless(Item.of('utopia:coin_iron_fractional', 2),['utopia:coin_iron'])
    event.shapeless(Item.of('utopia:coin_iron', 1),['utopia:coin_iron_fractional','utopia:coin_iron_fractional'])
})
