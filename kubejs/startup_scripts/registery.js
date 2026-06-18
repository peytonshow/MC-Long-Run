

StartupEvents.registry('item', event => {

    // Production
    event.create('utopia:incomplete_netherite_helmet', 'create:sequenced_assembly').texture('utopia:item/incomplete_netherite_helmet').displayName('Patchwork Netherite Helmet')
    event.create('utopia:incomplete_netherite_chestplate', 'create:sequenced_assembly').texture('utopia:item/incomplete_netherite_chestplate').displayName('Patchwork Netherite Chestplate')
    event.create('utopia:incomplete_netherite_leggings', 'create:sequenced_assembly').texture('utopia:item/incomplete_netherite_leggings').displayName('Patchwork Netherite Leggings')
    event.create('utopia:incomplete_netherite_boots', 'create:sequenced_assembly').texture('utopia:item/incomplete_netherite_boots').displayName('Patchwork Netherite Boots')
    event.create('utopia:overworld_upgrade_template').displayName('Manufactured Template').texture('utopia:item/overworld_upgrade_template')
    event.create('utopia:catalyst').displayName('Nature Catalyst').texture('utopia:item/catalyst').rarity('uncommon')
    event.create('utopia:uneven_raw_brass_precursor').displayName('Uneven Brass Precursor').texture('utopia:item/uneven_brass_precursor')

    event.create('utopia:encoder_stamp').displayName('Encoder Stamp').texture('utopia:item/encoder_stamp').rarity('rare')
    event.create('utopia:decoder_stamp').displayName('Decoder Stamp').texture('utopia:item/decoder_stamp').rarity('rare')
    event.create('utopia:paper_stamp').displayName('Paper Stamp').texture('utopia:item/paper_stamp').rarity('rare')


    // Copper tools.
    event.create('minecraft:copper_sword', 'sword').tier('stone').maxDamage(100)
    event.create('minecraft:copper_axe', 'axe').tier('stone').maxDamage(100)
    event.create('minecraft:copper_pickaxe', 'pickaxe').tier('stone').maxDamage(100)
    event.create('minecraft:copper_shovel', 'shovel').tier('stone').maxDamage(100)
    event.create('minecraft:copper_hoe', 'hoe').tier('stone').maxDamage(100)

    // FIAT!!!!
    event.create('utopia:1_dollar_bill').displayName('1$ Bill').texture('utopia:item/bill_one').burnTime(20).maxStackSize(50)
    event.create('utopia:5_dollar_bill').displayName('5$ Bill').texture('utopia:item/bill_five').burnTime(20).maxStackSize(50)
    event.create('utopia:20_dollar_bill').displayName('20$ Bill').texture('utopia:item/bill_twenty').rarity('uncommon').burnTime(30).maxStackSize(50)
    event.create('utopia:100_dollar_bill').displayName('100$ Bill').texture('utopia:item/bill_one_hundred').rarity('uncommon').burnTime(30).maxStackSize(50)
    event.create('utopia:500_dollar_bill').displayName('500$ Bill').texture('utopia:item/bill_five_hundred').rarity('uncommon').burnTime(30).maxStackSize(50)


    // Money thats technically actually worth something!
    event.create('utopia:coin_netherite').displayName('Scrap Coin').texture('utopia:item/coin_scrap').rarity('epic')
    event.create('utopia:coin_netherite_fractional').displayName('Scrap Fractional').texture('utopia:item/coin_scrap_fractional').rarity('epic')
    event.create('utopia:coin_diamond').displayName('Diamond Coin').texture('utopia:item/coin_diamond').rarity('rare')
    event.create('utopia:coin_diamond_fractional').displayName('Diamond Fractional').texture('utopia:item/coin_diamond_fractional').rarity('rare')
    event.create('utopia:coin_iron').displayName('Iron Coin').texture('utopia:item/coin_iron')
    event.create('utopia:coin_iron_fractional').displayName('Iron Fractional').texture('utopia:item/coin_iron_fractional')

    // Jail
    event.create('utopia:handcuffs').displayName('Silver Cuffs').texture('utopia:item/cuffs')
    event.create('utopia:shackles').displayName('Lead Shackles').texture('utopia:item/shackles')

    // Raw Food
    event.create('utopia:cookie_dough').maxStackSize(global.MAXFOODSIZE).food(food =>food
        .nutrition(0.5)
        .saturation(1)
        .effect("minecraft:hunger", 10, 240, 0.02).eatSeconds(2)
    )
    
    // Gordon, I need spices!
    event.create('utopia:cinnamon').food(food =>food
        .nutrition(1)
        .saturation(2.5)
        .eatSeconds(1.6)
    )
    event.create('utopia:pepper').food(food =>food
        .nutrition(3)
        .saturation(1)
        .eatSeconds(0.8)
    )
    event.create('utopia:sea_salt').food(food => food
      .nutrition(0.5)
      .saturation(3.0)
      .eatSeconds(3.2)
    )

})

StartupEvents.registry('block', event => {
  event.create('utopia:block_of_hyper_capitalism', "kubejs:cardinal") 
    .displayName('Block of Hyper-Capitalism') //1000
    .soundType('metal') 
    .hardness(3) 
    .resistance(0)
    .notSolid()
    .fullBlock(false)
    .item(ctx => {ctx.rarity("rare").unstackable()})
  event.create('utopia:block_of_extreme_capitalism', "kubejs:cardinal") 
    .displayName('Block of Extreme Capitalism') //100
    .soundType('metal') 
    .hardness(3) 
    .resistance(0)
    .notSolid()
    .fullBlock(false)
    .item(ctx => {ctx.rarity("rare").maxStackSize(5)})
  event.create('utopia:block_of_high_capitalism', "kubejs:cardinal") 
    .displayName('Block of High Capitalism') //20
    .soundType('wool') 
    .hardness(2) 
    .resistance(0)
    .notSolid()
    .fullBlock(false)
    .item(ctx => {ctx.rarity("uncommon").maxStackSize(25)})
  event.create('utopia:block_of_moderate_capitalism', "kubejs:cardinal") 
    .displayName('Block of Moderate Capitalism') //5
    .soundType('wool') 
    .hardness(2) 
    .resistance(0)
    .notSolid()
    .fullBlock(false)
    .item(ctx => {ctx.maxStackSize(25).maxStackSize(50)})
  event.create('utopia:block_of_capitalism', "kubejs:cardinal") 
    .displayName('Block of Capitalism') //1
    .soundType('wool') 
    .hardness(2) 
    .resistance(0)
    .notSolid()
    .fullBlock(false)
    .item(ctx => {ctx.maxStackSize(50)})
    
})
