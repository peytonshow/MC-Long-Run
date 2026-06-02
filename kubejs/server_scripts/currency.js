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


    event.smithing(
        'utopia:1_dollar_bill',    // arg 1: output
        'utopia:paper_stamp', // arg 2: the smithing template
        'minecraft:paper',    // arg 3: the item to be upgraded
        'minecraft:lime_dye'  // arg 4: the upgrade item
    )
    event.smithing(
        'utopia:5_dollar_bill',    // arg 1: output
        'utopia:paper_stamp',  // arg 2: the smithing template
        'minecraft:paper',     // arg 3: the item to be upgraded
        'minecraft:white_dye'  // arg 4: the upgrade item
    )
    event.smithing(
        'utopia:20_dollar_bill',
        'utopia:paper_stamp',
        'minecraft:paper',
        'minecraft:blue_dye'
    )
    event.smithing(
        'utopia:100_dollar_bill',
        'utopia:paper_stamp',
        'minecraft:paper',
        'minecraft:purple_dye'
    )
    event.smithing(
        'utopia:1000_dollar_bill',
        'utopia:paper_stamp',
        'minecraft:paper',
        'minecraft:black_dye'
    )
})
