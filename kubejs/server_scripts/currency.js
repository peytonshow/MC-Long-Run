ServerEvents.recipes(event => {
    event.recipes.create.deploying('8x utopia:coin_netherite', ['minecraft:netherite_ingot', 'utopia:encoder_stamp'])
    event.shaped(Item.of('minecraft:netherite_ingot', 1),[
        'BBB',
        'BAB',
        'BBB'
    ],{A: 'utopia:decoder_stamp',B: 'utopia:coin_netherite'})
    event.shapeless(Item.of('utopia:coin_netherite_fractional', 2),['utopia:coin_netherite'])
    event.shapeless(Item.of('utopia:coin_netherite', 1),['utopia:coin_netherite_fractional','utopia:coin_netherite_fractional'])


    event.recipes.create.deploying('8x utopia:coin_diamond', ['minecraft:diamond', 'utopia:encoder_stamp'])
    event.shaped(Item.of('minecraft:diamond', 1),[
        'BBB',
        'BAB',
        'BBB'], {
            A: 'utopia:decoder_stamp',B: 'utopia:coin_diamond'})
    event.shapeless(Item.of('utopia:coin_diamond_fractional', 2),['utopia:coin_diamond'])
    event.shapeless(Item.of('utopia:coin_diamond', 1),['utopia:coin_diamond_fractional','utopia:coin_diamond_fractional'])



    event.recipes.create.deploying('8x utopia:coin_iron', ['minecraft:iron_ingot', 'utopia:encoder_stamp'])
    event.shaped(Item.of('minecraft:iron_ingot', 1),[
        'BBB',
        'BAB',
        'BBB'], {
            A: 'utopia:decoder_stamp',B: 'utopia:coin_iron'})
    event.shapeless(Item.of('utopia:coin_iron_fractional', 2),['utopia:coin_iron'])
    event.shapeless(Item.of('utopia:coin_iron', 1),['utopia:coin_iron_fractional','utopia:coin_iron_fractional'])
})
