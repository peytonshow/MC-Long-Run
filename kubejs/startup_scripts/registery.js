
StartupEvents.registry('item', event => {
    // Chunkloading
    event.create('utopia:soul_token').texture('utopia:item/soul_token').unstackable().tag('curios:necklace').tag('curios:belt')

    // Mimic
    event.create('utopia:shadow_key').texture('utopia:item/shadow_key').unstackable()
    event.create('utopia:chroma_key').texture('utopia:item/chroma_key').unstackable()

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
    event.create('utopia:wire_spool').texture('utopia:item/wire_spool').tag('utopia:electricity').maxDamage(32).unstackable()
    event.create('utopia:basic_circuit').texture('utopia:item/circuit_board').tag('utopia:electricity').maxStackSize(16)
    event.create('utopia:advanced_circuit').texture('utopia:item/advanced_circuit_board').tag('utopia:electricity').maxStackSize(16)
    event.create('utopia:circuit_upgrade_template').texture('utopia:item/circuit_upgrade_template')

    // Forgin'!
    // event.create('utopia:uneven_raw_brass_precursor')
    event.create('utopia:slag').texture('utopia:item/slag').tag('c:ingots').tag('c:ingots/slag')
    event.create('utopia:ingot_mold').texture('utopia:item/mold')

    // Ingots
    event.create('utopia:graphite_ingot').tag('c:ingots').tag('c:ingots/graphite')
    event.create('utopia:platinum_ingot').tag('c:ingots').tag('c:ingots/platinum')
    event.create('utopia:platinum_nugget')
    event.create('utopia:plastic_ingot').tag('utopia:chemistry').texture('utopia:item/plastic').tag('c:ingots')

    // Jail (stupd, die)
    // event.create('utopia:handcuffs')
    // event.create('utopia:shackles')

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


// Engin
global.BLOCKSETS = []

global.createBlockset = (event, id, opts) => {
  if (!id) throw new Error('createBlockset: id is required')

  const { prefix = id, skip = [], texture, sound, hardness, resistance, requiresTool, tags, extra, recipes } = opts || {}
  const pieces = {}

  const piece = (type) => {
    const pieceId = type === 'block' ? id : `${prefix}_${type}`
    const b = type === 'block' ? event.create(pieceId) : event.create(pieceId, type)

    if (texture) b.texture(texture)
    if (sound) b.soundType(sound)
    if (hardness !== undefined) b.hardness(hardness)
    if (resistance !== undefined) b.resistance(resistance)
    if (requiresTool) b.requiresTool(true)

    // Array = every piece; object = per piece, e.g. { wall: ['minecraft:walls'] }
    ;(Array.isArray(tags) ? tags : (tags && tags[type]) || []).forEach(t => b.tagBlock(t))

    if (extra) extra(b, type)

    pieces[type] = pieceId
  }

  piece('block') // the base block is always created
  ;['stairs', 'slab', 'wall'].forEach(type => {
    if (!skip.includes(type)) piece(type)
  })

  if (recipes !== false) global.BLOCKSETS.push(pieces)
}

StartupEvents.registry('block', event => {
  // Flint blockset
  global.createBlockset(event, 'utopia:polished_flint', {
    texture: 'utopia:block/polished_flint_block',
    prefix: 'utopia:polished_flint',
    slabSideTexture: 'utopia:block/polished_flint_slab_side',
    sound: 'stone',
    hardness: 2.0,
    resistance: 7.5,
    tags: ['c:storage_blocks', 'c:storage_blocks/flint']
  })

  // bobblestone
  global.createBlockset(event, 'utopia:classicnium', {
    texture: 'utopia:block/classic/cobblestone',
    sound: 'stone',
    hardness: 1.4,
    resistance: 5.5,
    tags: ['minecraft:mineable/pickaxe']
  })

  //mossy bobblestone
  global.createBlockset(event, 'utopia:mossy_classicnium', {
    texture: 'utopia:block/classic/mossy_cobblestone',
    sound: 'stone',
    hardness: 1.4,
    resistance: 5.5,
    tags: ['minecraft:mineable/pickaxe']
  })


  // Gilded Silver Blackstone
  event.create('utopia:silver_gilded_blackstone')
    .displayName('Gilded Blackstone Copy')
    .soundType('gilded_blackstone')
    .hardness(1.5)
    .resistance(6.0)
    .requiresTool(true)
    .tagBlock('minecraft:mineable/pickaxe')
    .textureAll('minecraft:block/gilded_blackstone')

  // Smooth Stone Stairs
  event.create('utopia:smooth_stone_stairs', 'stairs')
    .hardness(2.0)
    .resistance(6.0)
    .soundType('stone')
    .requiresTool(true)
    .tagBlock('minecraft:mineable/pickaxe')
    .texture('utopia:block/smooth_stone_stair')

  // Salt
  event.create('utopia:sea_salt_lamp')
    .soundType('glass')
    .hardness(3)
    .resistance(4)
    .lightLevel(14 / 15)
    .renderType('translucent')
    .notSolid()
    .fullBlock(false)
  event.create('utopia:sea_salt_block')
    .soundType('sand')
    .hardness(3)
    .resistance(5)

  // Moissanite
  event.create('utopia:moissanite_block')
    .soundType('metal')
    .hardness(5.0)
    .resistance(6.0)
    .requiresTool(true)
    .tagBlock('minecraft:mineable/pickaxe')
    .tagBlock('minecraft:needs_iron_tool')

  event.create('utopia:neon_block')
    .soundType('shroomlight')
    .tagBlock('minecraft:mineable/pickaxe')
    .resistance(1)
    .hardness(5.0)
    .resistance(6.0)
})
