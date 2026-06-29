ItemEvents.toolTierRegistry(event => {
  
  event.addBasedOnExisting("platinum", "diamond", (tier) => {
    tier.uses = 400;
  });

  event.add('pencil', tier => {
    tier.uses = 12                 // Durability
    tier.speed = 2.0                 // Mining speed (matters if they clear cobwebs/leaves)
    tier.attackDamageBonus = 3.0     // Base damage bonus added to weapons
    tier.enchantmentValue = 0       // Enchantability level
    tier.repairIngredient = 'minecraft:stick' // Item used to fix it in an anvil (or '#c:gems/ruby')
  })
  event.add('utopia:hammer', tier => {
    tier.uses = 128
    tier.speed = 1.0
    tier.attackDamageBonus = 2.0
    tier.enchantmentValue = 0
    tier.repairIngredient = 'minecraft:oak_log'
  })
})


StartupEvents.registry('item', event => {

    // Production
    event.create('utopia:incomplete_netherite_helmet', 'create:sequenced_assembly').texture('utopia:item/incomplete_netherite_helmet').displayName('Patchwork Netherite Helmet')
    event.create('utopia:incomplete_netherite_chestplate', 'create:sequenced_assembly').texture('utopia:item/incomplete_netherite_chestplate').displayName('Patchwork Netherite Chestplate')
    event.create('utopia:incomplete_netherite_leggings', 'create:sequenced_assembly').texture('utopia:item/incomplete_netherite_leggings').displayName('Patchwork Netherite Leggings')
    event.create('utopia:incomplete_netherite_boots', 'create:sequenced_assembly').texture('utopia:item/incomplete_netherite_boots').displayName('Patchwork Netherite Boots')
    event.create('utopia:overworld_upgrade_template').displayName('Manufactured Template').texture('utopia:item/overworld_upgrade_template')
    event.create('utopia:catalyst').displayName('Catalyst').texture('utopia:item/catalyst').rarity('uncommon')
    event.create('utopia:uneven_raw_brass_precursor').displayName('Brass Precursor').texture('utopia:item/uneven_raw_brass_precursor')

    // Sciantest
    event.create('utopia:silica_dust').displayName('Silica Dust').texture('utopia:item/silica').tag('c:dusts').tag('utopia:chemistry')
    event.create('utopia:moissanite').displayName('Moissanite').texture('utopia:item/moissanite').tag('c:gems').tag('utopia:chemistry')
    event.create('utopia:beaker').tag('utopia:chemistry').tag('utopia:beakers').texture('utopia:item/beaker').displayName('Empty Beaker')
    event.create('utopia:beaker_oxygen').tag('utopia:chemistry').tag('utopia:beakers').texture('utopia:item/beaker_oxygen').useAnimation('drink')
    event.create('utopia:beaker_hydrogen').tag('utopia:chemistry').tag('utopia:beakers').texture('utopia:item/beaker_hydrogen')
    event.create('utopia:beaker_nitrogen').tag('utopia:chemistry').tag('utopia:beakers').texture('utopia:item/beaker_nitrogen').useAnimation('drink')
    event.create('utopia:beaker_ammonia').tag('utopia:chemistry').tag('utopia:beakers').texture('utopia:item/beaker_ammonia').useAnimation('drink')
    event.create('utopia:beaker_nitric_acid').tag('utopia:chemistry').tag('utopia:beakers').texture('utopia:item/beaker_nitric_acid').useAnimation('drink')
    event.create('utopia:beaker_bleach').tag('utopia:chemistry').tag('utopia:beakers').texture('utopia:item/bleach').displayName('Bleach').useAnimation('drink')
    event.create('utopia:beaker_propylene_glycol').tag('utopia:chemistry').tag('utopia:beakers').texture('utopia:item/propylene_glycol').displayName('Propylene Glycol').useAnimation('drink')

    // Ingots
    event.create('utopia:graphite_ingot').displayName('Graphite').texture('utopia:item/graphite_ingot')
    event.create('utopia:graphite_nugget').displayName('Graphite Rod').texture('utopia:item/graphite_nugget')
    event.create('utopia:platinum_ingot').displayName('Platinum Ingot').texture('utopia:item/platinum_ingot')
    event.create('utopia:platinum_nugget').displayName('Platinum Nugget').texture('utopia:item/platinum_nugget')

    // Copper tools.
    event.create('minecraft:copper_sword', 'sword').tier('stone').maxDamage(100)
    event.create('minecraft:copper_axe', 'axe').tier('stone').maxDamage(100)
    event.create('minecraft:copper_pickaxe', 'pickaxe').tier('stone').maxDamage(100)
    event.create('minecraft:copper_shovel', 'shovel').tier('stone').maxDamage(100)
    event.create('minecraft:copper_hoe', 'hoe').tier('stone').maxDamage(100)

    // 『 Star Platinum 』
    event.create('utopia:platinum_sword', 'sword').tier('platinum').maxDamage(400).texture('utopia:item/platinum_sword')
    event.create('utopia:platinum_axe', 'axe').tier('platinum').maxDamage(400).texture('utopia:item/platinum_axe')
    event.create('utopia:platinum_pickaxe', 'pickaxe').tier('platinum').maxDamage(400).texture('utopia:item/platinum_pickaxe')
    event.create('utopia:platinum_shovel', 'shovel').tier('platinum').maxDamage(400).texture('utopia:item/platinum_shovel')
    event.create('utopia:platinum_hoe', 'hoe').tier('platinum').maxDamage(400).texture('utopia:item/platinum_hoe')

    // Misc Tools
    event.create('utopia:pencil', 'sword').tier('pencil')
    event.create('utopia:hammer').maxDamage(32)

    // Stamps
    event.create('utopia:encoder_stamp').displayName('Encoder Stamp').texture('utopia:item/encoder_stamp').rarity('rare').tag('utopia:stamp')
    event.create('utopia:decoder_stamp').displayName('Decoder Stamp').texture('utopia:item/decoder_stamp').rarity('rare').tag('utopia:stamp')
    event.create('utopia:paper_stamp').displayName('Paper Stamp').texture('utopia:item/paper_stamp').rarity('rare').tag('utopia:stamp')

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

    // Gordon, I need spices!
    // (Food values are defined in food.js)
    event.create('utopia:cookie_dough').maxStackSize(global.MAXFOODSIZE).displayName('Cookie Dough')
    event.create('utopia:pepper').tag('utopia:spices')
    event.create('utopia:sea_salt').tag('utopia:spices')
    event.create('utopia:cinnamon').tag('utopia:spices')
    event.create('utopia:seasoned_cooked_beef').maxStackSize(global.MAXFOODSIZE).displayName('Seasoned Steak')
    event.create('utopia:seasoned_cooked_porkchop').maxStackSize(global.MAXFOODSIZE).displayName('Seasoned Porkchop')
    event.create('utopia:seasoned_cooked_chicken').maxStackSize(global.MAXFOODSIZE).displayName('Seasoned Chicken')
    event.create('utopia:seasoned_cooked_mutton').maxStackSize(global.MAXFOODSIZE).displayName('Seasoned Mutton')
    event.create('utopia:seasoned_cooked_rabbit').maxStackSize(global.MAXFOODSIZE).displayName('Seasoned Rabbit')
    event.create('utopia:seasoned_cooked_bushmeat').maxStackSize(global.MAXFOODSIZE).displayName('Seasoned Bushmeat')

})

StartupEvents.registry('block', event => {
  event.create('utopia:pink_salt_lamp') 
    .displayName('Pink Salt Rock Lamp')
    .soundType('glass') 
    .hardness(3) 
    .resistance(4)
    .lightLevel(11/15)
    .renderType('translucent')
    .notSolid()
    .fullBlock(false)
  event.create('utopia:lava_salt_lamp') 
    .displayName('Sulphuric Salt Rock Lamp')
    .soundType('glass') 
    .hardness(3) 
    .resistance(4)
    .lightLevel(13/15)
    .renderType('translucent')
    .notSolid()
    .fullBlock(false)
  event.create('utopia:iodide_salt_lamp') 
    .displayName('Iodide Salt Rock Lamp')
    .soundType('glass') 
    .hardness(3) 
    .resistance(4)
    .lightLevel(14/15)
    .renderType('translucent')
    .notSolid()
    .fullBlock(false)

event.create('utopia:moissanite_block')
    .displayName('Moissanite Block')
    .soundType('metal')
    .hardness(5.0)
    .resistance(6.0)
    .requiresTool(true) 
    .tagBlock('minecraft:mineable/pickaxe') 
    .tagBlock('minecraft:needs_iron_tool')
    
  event.create('utopia:sea_salt_block') 
    .displayName('Sea Salt Block')
    .soundType('sand') 
    .hardness(3) 
    .resistance(5)

  event.create('utopia:neon_block') 
    .displayName('Neon Block')
    .soundType('heavy_core') 
    .resistance(1)

  event.create('utopia:degree_law', "kubejs:cardinal") 
    .displayName('Law Degree')
    .soundType('scaffolding')
    .box(0, 0, 15, 16, 16, 16)
    .notSolid()
    .fullBlock(false)
    .tag('utopia:degree')
  event.create('utopia:degree_defense', "kubejs:cardinal") 
    .displayName('Defense Degree')
    .soundType('scaffolding')
    .box(0, 0, 15, 16, 16, 16)
    .notSolid()
    .fullBlock(false)
    .tag('utopia:degree')
  event.create('utopia:degree_chef', "kubejs:cardinal") 
    .displayName('Cooking Degree')
    .soundType('scaffolding')
    .box(0, 0, 15, 16, 16, 16)
    .notSolid()
    .fullBlock(false)
    .tag('utopia:degree')
  event.create('utopia:degree_anthropology', "kubejs:cardinal") 
    .displayName('Anthropology Degree')
    .soundType('scaffolding')
    .box(0, 0, 15, 16, 16, 16)
    .notSolid()
    .fullBlock(false)
    .tag('utopia:degree')
  event.create('utopia:degree_economics', "kubejs:cardinal") 
    .displayName('Economics Degree')
    .soundType('scaffolding')
    .box(0, 0, 15, 16, 16, 16)
    .notSolid()
    .fullBlock(false)
    .tag('utopia:degree')

  event.create('utopia:block_of_hyper_capitalism', "kubejs:cardinal") 
    .displayName('Block of Hyper-Capitalism') //1000
    .soundType('glass') 
    .hardness(1) 
    .resistance(1)
    .notSolid()
    .fullBlock(false)
    .item(ctx => {ctx.rarity("rare").maxStackSize(16)})
  event.create('utopia:block_of_extreme_capitalism', "kubejs:cardinal") 
    .displayName('Block of Extreme Capitalism') //100
    .soundType('metal') 
    .hardness(3) 
    .resistance(0)
    .notSolid()
    .fullBlock(false)
    .item(ctx => {ctx.rarity("rare").maxStackSize(16)})
  event.create('utopia:block_of_high_capitalism', "kubejs:cardinal") 
    .displayName('Block of High Capitalism') //20
    .soundType('wool') 
    .hardness(2) 
    .resistance(0)
    .notSolid()
    .fullBlock(false)
    .item(ctx => {ctx.rarity("uncommon").maxStackSize(16)})
  event.create('utopia:block_of_moderate_capitalism', "kubejs:cardinal") 
    .displayName('Block of Moderate Capitalism') //5
    .soundType('wool') 
    .hardness(2) 
    .resistance(0)
    .notSolid()
    .fullBlock(false)
    .item(ctx => {ctx.maxStackSize(32)})
  event.create('utopia:block_of_capitalism', "kubejs:cardinal") 
    .displayName('Block of Capitalism') //1
    .soundType('wool') 
    .hardness(2) 
    .resistance(0)
    .notSolid()
    .fullBlock(false)
    
})
