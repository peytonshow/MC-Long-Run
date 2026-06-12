ServerEvents.recipes(event => {

    event.smithing(
        'utopia:1_dollar_bill',    // arg 1: output
        'utopia:paper_stamp', // arg 2: the smithing template
        'minecraft:paper',    // arg 3: the item to be upgraded
        'minecraft:lime_dye'  // arg 4: the upgrade item
    )
    event.smithing(
        'utopia:5_dollar_bill', 
        'utopia:paper_stamp', 
        'minecraft:paper', 
        'minecraft:white_dye' 
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

    event.recipes.create.crushing(Item.of('utopia:100_dollar_bill', 5), 'utopia:500_dollar_bill')
    event.recipes.create.crushing(Item.of('utopia:20_dollar_bill', 5), 'utopia:100_dollar_bill')
    event.recipes.create.crushing(Item.of('utopia:5_dollar_bill', 4), 'utopia:20_dollar_bill')
    event.recipes.create.crushing(Item.of('utopia:1_dollar_bill', 5), 'utopia:5_dollar_bill')

    event.recipes.create.compacting('utopia:500_dollar_bill', Item.of('utopia:100_dollar_bill', 5))
    event.recipes.create.compacting('utopia:100_dollar_bill', Item.of('utopia:20_dollar_bill', 5))
    event.recipes.create.compacting('utopia:20_dollar_bill', Item.of('utopia:5_dollar_bill', 4))
    event.recipes.create.compacting('utopia:5_dollar_bill', Item.of('utopia:1_dollar_bill', 5))

    event.recipes.create.mechanical_crafting('utopia:block_of_hyper_capitalism', [
        'BBBBB',
        'BBBBB',
        'BBBBB',
        'BBBBB',
        'BBBBB',
        'SSSSS'
    ], {
        B: 'utopia:500_dollar_bill',
        S: '#minecraft:wooden_slabs'
    })
    event.recipes.create.crushing([Item.of('utopia:500_dollar_bill', 25), Item.of('minecraft:oak_slab', 5)], 'utopia:block_of_hyper_capitalism')
    event.recipes.create.mechanical_crafting('utopia:block_of_extreme_capitalism', [
        'BBBBB',
        'BBBBB',
        'BBBBB',
        'BBBBB',
        'BBBBB',
        'SSSSS'
    ], {
        B: 'utopia:100_dollar_bill',
        S: '#minecraft:wooden_slabs'
    })
    event.recipes.create.crushing([Item.of('utopia:100_dollar_bill', 25), Item.of('minecraft:oak_slab', 5)], 'utopia:block_of_extreme_capitalism')
    event.recipes.create.mechanical_crafting('utopia:block_of_high_capitalism', [
        'BBBBB',
        'BBBBB',
        'BBBBB',
        'BBBBB',
        'BBBBB',
        'SSSSS'
    ], {
        B: 'utopia:20_dollar_bill',
        S: '#minecraft:wooden_slabs'
    })
    event.recipes.create.crushing([Item.of('utopia:20_dollar_bill', 25), Item.of('minecraft:oak_slab', 5)], 'utopia:block_of_high_capitalism')
    event.recipes.create.mechanical_crafting('utopia:block_of_moderate_capitalism', [
        'BBBBB',
        'BBBBB',
        'BBBBB',
        'BBBBB',
        'BBBBB',
        'SSSSS'
    ], {
        B: 'utopia:5_dollar_bill',
        S: '#minecraft:wooden_slabs'
    })
    event.recipes.create.crushing([Item.of('utopia:5_dollar_bill', 25), Item.of('minecraft:oak_slab', 5)], 'utopia:block_of_moderate_capitalism')
    event.recipes.create.mechanical_crafting('utopia:block_of_capitalism', [
        'BBBBB',
        'BBBBB',
        'BBBBB',
        'BBBBB',
        'BBBBB',
        'SSSSS'
    ], {
        B: 'utopia:1_dollar_bill',
        S: '#minecraft:wooden_slabs'
    })
    event.recipes.create.crushing([Item.of('utopia:1_dollar_bill', 25), Item.of('minecraft:oak_slab', 5)], 'utopia:block_of_capitalism')

    event.recipes.create.deploying('8x utopia:coin_netherite', ['minecraft:netherite_ingot', 'utopia:encoder_stamp'])
    event.recipes.create.compacting('minecraft:netherite_ingot', ['utopia:decoder_stamp', Item.of('utopia:coin_netherite', 8)])
    event.recipes.create.mixing('minecraft:netherite_ingot', Item.of('utopia:coin_netherite', 10)).heated()
    event.shapeless(Item.of('utopia:coin_netherite_fractional', 2),['utopia:coin_netherite'])
    event.shapeless(Item.of('utopia:coin_netherite', 1),['utopia:coin_netherite_fractional','utopia:coin_netherite_fractional'])

    event.recipes.create.deploying('8x utopia:coin_diamond', ['minecraft:diamond', 'utopia:encoder_stamp'])
    event.recipes.create.compacting('minecraft:diamond', ['utopia:decoder_stamp', Item.of('utopia:coin_diamond', 8)])
    event.recipes.create.mixing('minecraft:diamond', Item.of('utopia:coin_diamond', 10)).heated()
    event.shapeless(Item.of('utopia:coin_diamond_fractional', 2),['utopia:coin_diamond'])
    event.shapeless(Item.of('utopia:coin_diamond', 1),['utopia:coin_diamond_fractional','utopia:coin_diamond_fractional'])

    event.recipes.create.deploying('8x utopia:coin_iron', ['minecraft:iron_ingot', 'utopia:encoder_stamp'])
    event.recipes.create.compacting('minecraft:iron_ingot', ['utopia:decoder_stamp', Item.of('utopia:coin_iron', 8)])
    event.recipes.create.mixing('minecraft:iron_ingot', Item.of('utopia:coin_iron', 10)).heated()
    event.shapeless(Item.of('utopia:coin_iron_fractional', 2),['utopia:coin_iron'])
    event.shapeless(Item.of('utopia:coin_iron', 1),['utopia:coin_iron_fractional','utopia:coin_iron_fractional'])


})
