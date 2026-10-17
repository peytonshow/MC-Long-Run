
StartupEvents.registry('item', event => {
    // Stamps
    // event.create('utopia:encoder_stamp').texture('utopia:item/encoder_stamp').rarity('rare').tag('utopia:stamp')
    // event.create('utopia:decoder_stamp').texture('utopia:item/decoder_stamp').rarity('rare').tag('utopia:stamp')
    // event.create('utopia:paper_stamp').texture('utopia:item/paper_stamp').rarity('rare').tag('utopia:stamp')

    // FIAT!!!!
    event.create('utopia:1_dollar_bill').maxStackSize(50).texture('utopia:item/money/bill_one')
    event.create('utopia:5_dollar_bill').maxStackSize(50).texture('utopia:item/money/bill_five')
    event.create('utopia:20_dollar_bill').maxStackSize(50).texture('utopia:item/money/bill_twenty')
    event.create('utopia:100_dollar_bill').maxStackSize(50).texture('utopia:item/money/bill_one_hundred')
    event.create('utopia:500_dollar_bill').maxStackSize(50).texture('utopia:item/money/bill_five_hundred')

    // Money thats technically actually worth something!
    event.create('utopia:coin_scrap')
    event.create('utopia:coin_scrap_fractional')
    event.create('utopia:coin_diamond')
    event.create('utopia:coin_diamond_fractional')
    event.create('utopia:coin_iron')
    event.create('utopia:coin_iron_fractional')

})

StartupEvents.registry('block', event => {
  event.create('utopia:block_of_hyper_capitalism', "kubejs:cardinal") 
     //1000
    .soundType('glass') 
    .hardness(1) 
    .resistance(1)
    .notSolid()
    .fullBlock(false)
    .item(ctx => {ctx.rarity("rare").maxStackSize(16)})
  event.create('utopia:block_of_extreme_capitalism', "kubejs:cardinal") 
     //100
    .soundType('metal') 
    .hardness(3) 
    .resistance(0)
    .notSolid()
    .fullBlock(false)
    .item(ctx => {ctx.rarity("rare").maxStackSize(16)})
  event.create('utopia:block_of_high_capitalism', "kubejs:cardinal") 
     //20
    .soundType('wool') 
    .hardness(2) 
    .resistance(0)
    .notSolid()
    .fullBlock(false)
    .item(ctx => {ctx.rarity("uncommon").maxStackSize(16)})
  event.create('utopia:block_of_moderate_capitalism', "kubejs:cardinal") 
     //5
    .soundType('wool') 
    .hardness(2) 
    .resistance(0)
    .notSolid()
    .fullBlock(false)
    .item(ctx => {ctx.maxStackSize(32)})
  event.create('utopia:block_of_capitalism', "kubejs:cardinal") 
     //1
    .soundType('wool') 
    .hardness(2) 
    .resistance(0)
    .notSolid()
    .fullBlock(false)
})