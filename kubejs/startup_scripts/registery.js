
StartupEvents.registry('item', event => {
    // Mimic
    event.create('utopia:shadow_key').texture('utopia:item/shadow_key').maxStackSize(16)
    event.create('utopia:chroma_key').texture('utopia:item/chroma_key').maxStackSize(1).maxDamage(5)

    // Production
    event.create('utopia:incomplete_netherite_helmet', 'create:sequenced_assembly').texture('utopia:item/incomplete_netherite_helmet').tag('c:hidden_from_recipe_viewers')
    event.create('utopia:incomplete_netherite_chestplate', 'create:sequenced_assembly').texture('utopia:item/incomplete_netherite_chestplate').tag('c:hidden_from_recipe_viewers')
    event.create('utopia:incomplete_netherite_leggings', 'create:sequenced_assembly').texture('utopia:item/incomplete_netherite_leggings').tag('c:hidden_from_recipe_viewers')
    event.create('utopia:incomplete_netherite_boots', 'create:sequenced_assembly').texture('utopia:item/incomplete_netherite_boots').tag('c:hidden_from_recipe_viewers')
    event.create('utopia:incomplete_basic_circuit', 'create:sequenced_assembly').texture('utopia:item/incomplete_basic_circuit').tag('c:hidden_from_recipe_viewers')
    event.create('utopia:incomplete_advanced_circuit', 'create:sequenced_assembly').texture('utopia:item/incomplete_advanced_circuit').tag('c:hidden_from_recipe_viewers')
    event.create('utopia:incomplete_ingot', 'create:sequenced_assembly').texture('utopia:item/incomplete_ingot').tag('c:hidden_from_recipe_viewers')
    // event.create('utopia:incomplete_wire_spool', 'create:sequenced_assembly')
    
    // Usable
    event.create('utopia:letter_of_invitation').maxStackSize(16)

    // Sciantest
    event.create('utopia:beaker').tag('utopia:chemistry').tag('utopia:beakers').texture('utopia:item/beaker')
    event.create('utopia:beaker_oxygen').tag('utopia:chemistry').tag('utopia:beakers').texture('utopia:item/beaker_oxygen').useAnimation('drink')
    event.create('utopia:beaker_hydrogen').tag('utopia:chemistry').tag('utopia:beakers').texture('utopia:item/beaker_hydrogen').useAnimation('drink')
    event.create('utopia:beaker_nitrogen').tag('utopia:chemistry').tag('utopia:beakers').texture('utopia:item/beaker_nitrogen').useAnimation('drink')
    event.create('utopia:beaker_ammonia').tag('utopia:chemistry').tag('utopia:beakers').texture('utopia:item/beaker_ammonia').useAnimation('drink')
    event.create('utopia:beaker_nitric_acid').tag('utopia:chemistry').tag('utopia:beakers').texture('utopia:item/beaker_nitric_acid').useAnimation('drink')
    event.create('utopia:beaker_bleach').tag('utopia:chemistry').tag('utopia:beakers').texture('utopia:item/bleach').useAnimation('drink')
    event.create('utopia:beaker_propylene_glycol').tag('utopia:chemistry').tag('utopia:beakers').texture('utopia:item/propylene_glycol').useAnimation('drink')
    event.create('utopia:garbage').texture('utopia:item/garbage').tag('c:dusts').tag('utopia:chemistry')
    event.create('utopia:silica_dust').texture('utopia:item/silica').tag('c:dusts').tag('utopia:chemistry')
    event.create('utopia:moissanite').texture('utopia:item/moissanite').tag('c:gems').tag('utopia:chemistry')
    event.create('utopia:ammonium_nitrate').tag('utopia:chemistry').texture('utopia:item/ammonium_nitrate')
    event.create('utopia:sulfur_dust').tag('c:dusts').tag('utopia:chemistry').texture('utopia:item/sulphur')

    // Electricity
    //event.create('utopia:battery_charged')
    event.create('utopia:wire').texture('utopia:item/wire').tag('utopia:electricity')
    event.create('utopia:wire_spool').texture('utopia:item/wire_spool').tag('utopia:electricity').maxDamage(25).unstackable()
    event.create('utopia:basic_circuit').texture('utopia:item/circuit_board').tag('utopia:electricity').maxStackSize(16)
    event.create('utopia:advanced_circuit').texture('utopia:item/advanced_circuit_board').tag('utopia:electricity').maxStackSize(16)
    event.create('utopia:circuit_upgrade_template').texture('utopia:item/circuit_upgrade_template')

    // Forgin'!
    // event.create('utopia:uneven_raw_brass_precursor')
    event.create('utopia:slag').texture('utopia:item/slag').tag('c:ingots').tag('c:ingots/slag')
    event.create('utopia:ingot_mold').texture('utopia:item/mold')

    // Ingots
    event.create('utopia:graphite_ingot').texture('utopia:item/graphite_ingot').tag('c:ingots').tag('c:ingots/graphite')
    event.create('utopia:platinum_ingot').texture('utopia:item/platinum_ingot').tag('c:ingots').tag('c:ingots/platinum')
    event.create('utopia:platinum_nugget')
    event.create('utopia:plastic_ingot').tag('utopia:chemistry').texture('utopia:item/plastic').tag('c:ingots')

    // Stamps
    event.create('utopia:encoder_stamp').texture('utopia:item/encoder_stamp').rarity('rare').tag('utopia:stamp')
    event.create('utopia:decoder_stamp').texture('utopia:item/decoder_stamp').rarity('rare').tag('utopia:stamp')
    event.create('utopia:paper_stamp').texture('utopia:item/paper_stamp').rarity('rare').tag('utopia:stamp')

    // FIAT!!!!
    event.create('utopia:1_dollar_bill')
    event.create('utopia:5_dollar_bill')
    event.create('utopia:20_dollar_bill')
    event.create('utopia:100_dollar_bill')
    event.create('utopia:500_dollar_bill')

    // Money thats technically actually worth something!
    event.create('utopia:coin_netherite')
    event.create('utopia:coin_netherite_fractional')
    event.create('utopia:coin_diamond')
    event.create('utopia:coin_diamond_fractional')
    event.create('utopia:coin_iron')
    event.create('utopia:coin_iron_fractional')

    // Jail
    event.create('utopia:handcuffs')
    event.create('utopia:shackles')

    // Gordon, I need spices!
    // (Food values are defined in food.js)
    event.create('utopia:cookie_dough').maxStackSize(global.MAXFOODSIZE)
    event.create('utopia:pepper').tag('utopia:spices')
      .tag('c:foods')
    event.create('utopia:sea_salt').tag('utopia:spices').tag('c:dusts')
      .tag('c:foods')
    event.create('utopia:seasoned_cooked_beef').maxStackSize(global.MAXFOODSIZE)
      .tag('c:animal_foods')
      .tag('c:foods')
      .tag('c:foods/cooked_beef')
      .tag('c:foods/cooked_meat')
      .tag('c:foods/cooked_meats')
      .tag('minecraft:meat')
      .tag('minecraft:wolf_food')
    event.create('utopia:seasoned_cooked_porkchop').maxStackSize(global.MAXFOODSIZE)
      .tag('c:animal_foods')
      .tag('c:foods')
      .tag('c:foods/cooked_pork')
      .tag('c:foods/cooked_meat')
      .tag('c:foods/cooked_meats')
      .tag('minecraft:meat')
      .tag('minecraft:piglin_food')
      .tag('minecraft:wolf_food')
    event.create('utopia:seasoned_cooked_chicken').maxStackSize(global.MAXFOODSIZE)
      .tag('c:animal_foods')
      .tag('c:foods')
      .tag('c:foods/cooked_chicken')
      .tag('c:foods/cooked_meat')
      .tag('c:foods/cooked_meats')
      .tag('minecraft:meat')
      .tag('minecraft:wolf_food')
    event.create('utopia:seasoned_cooked_mutton').maxStackSize(global.MAXFOODSIZE)
      .tag('c:animal_foods')
      .tag('c:foods')
      .tag('c:foods/cooked_mutton')
      .tag('c:foods/cooked_meat')
      .tag('c:foods/cooked_meats')
      .tag('minecraft:meat')
      .tag('minecraft:wolf_food')
    event.create('utopia:seasoned_cooked_rabbit').maxStackSize(global.MAXFOODSIZE)
      .tag('c:animal_foods')
      .tag('c:foods')
      .tag('c:foods/cooked_rabbit')
      .tag('c:foods/cooked_meat')
      .tag('c:foods/cooked_meats')
      .tag('minecraft:meat')
      .tag('minecraft:wolf_food')

})

StartupEvents.registry('block', event => {
  event.create('utopia:sea_salt_lamp') 
    
    .soundType('glass') 
    .hardness(3) 
    .resistance(4)
    .lightLevel(14/15)
    .renderType('translucent')
    .notSolid()
    .fullBlock(false)

  event.create('utopia:moissanite_block')
    
    .soundType('metal')
    .hardness(5.0)
    .resistance(6.0)
    .requiresTool(true) 
    .tagBlock('minecraft:mineable/pickaxe') 
    .tagBlock('minecraft:needs_iron_tool')
  event.create('utopia:sea_salt_block') 
    
    .soundType('sand') 
    .hardness(3) 
    .resistance(5)
  event.create('utopia:neon_block') 
    
    .soundType('shroomlight') 
    .resistance(1)

  // Degrees
  event.create('utopia:degree_law', "kubejs:cardinal") 
    
    .soundType('scaffolding')
    .box(0, 0, 15, 16, 16, 16)
    .notSolid()
    .fullBlock(false)
    .tag('utopia:degree')
  event.create('utopia:degree_defense', "kubejs:cardinal") 
    
    .soundType('scaffolding')
    .box(0, 0, 15, 16, 16, 16)
    .notSolid()
    .fullBlock(false)
    .tag('utopia:degree')
  event.create('utopia:degree_chef', "kubejs:cardinal") 
    
    .soundType('scaffolding')
    .box(0, 0, 15, 16, 16, 16)
    .notSolid()
    .fullBlock(false)
    .tag('utopia:degree')
  event.create('utopia:degree_anthropology', "kubejs:cardinal") 
    
    .soundType('scaffolding')
    .box(0, 0, 15, 16, 16, 16)
    .notSolid()
    .fullBlock(false)
    .tag('utopia:degree')
  event.create('utopia:degree_economics', "kubejs:cardinal") 
    
    .soundType('scaffolding')
    .box(0, 0, 15, 16, 16, 16)
    .notSolid()
    .fullBlock(false)
    .tag('utopia:degree')

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