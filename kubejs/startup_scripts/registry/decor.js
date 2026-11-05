// Enjun.
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
    b.tagItem('utopia:decor')

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
    tags: ['minecraft:mineable/pickaxe']
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
    .displayName('Silver Gilded Blackstone')
    .soundType('gilded_blackstone')
    .hardness(1.5)
    .resistance(6.0)
    .requiresTool(true)
    .tagBlock('minecraft:mineable/pickaxe')
    .tagItem('utopia:decor')

  // Smooth Stone Stairs
  event.create('utopia:smooth_stone_stairs', 'stairs')
    .hardness(2.0)
    .resistance(6.0)
    .soundType('stone')
    .requiresTool(true)
    .texture('utopia:block/smooth_stone_stair')
    .tagBlock('minecraft:mineable/pickaxe')
    .tagItem('utopia:decor')
})


StartupEvents.registry('block', event => {
  [
    ['wormwood_paneling', 'wood', 'basic'],      // chiseled_bookshelf_top
    ['wormwood_polished', 'wood', 'cardinal'],   // chiseled_bookshelf_side
    ['blastar_polished', 'stone', 'basic'],      // blast_furnace_top
    ['poster_paneling', 'wood', 'basic'],        // composter sides
    ['poster_polished', 'wood', 'basic'],        // composter bottom
    ['solstice_paneling', 'wood', 'basic'],      // daylight_detector_top
    ['hivium_paneling', 'wood', 'basic'],        // beehive_top (ends) & beehive_side (sides)
    ['hivium_polished', 'wood', 'basic'],        // beehive_top
    ['loominum_paneling', 'wood', 'basic'],      // loom_side
    ['loominum_polished', 'wood', 'basic'],      // loom_bottom
    ['spruce_paneling', 'wood', 'pillar'],       // barrel_bottom (ends) & barrel_side (sides)
    ['spruce_polished', 'wood', 'basic'],        // barrel_bottom
    ['polished_dark_oak_wood', 'wood', 'basic'], // cartography_table_side3
    ['smithistone_paneling', 'stone', 'basic'],  // smithing_table_bottom
    ['smithistone_polished', 'stone', 'basic'],  // smithing_table_top
    ['lodium', 'stone', 'basic'],                // lodestone_top
  ].forEach(([id, type, builderType]) => {
    // Determine the KubeJS builder type dynamically
    let block = builderType !== 'basic'
      ? event.create(`utopia:${id}`, `kubejs:${builderType}`)
      : event.create(`utopia:${id}`)

    block.soundType(type)
      .hardness(type === 'wood' ? 2 : 1.5)
      .resistance(type === 'wood' ? 3 : 6)
      .tagBlock(type === 'wood' ? 'mineable/axe' : 'mineable/pickaxe')
      .requiresTool(type === 'stone')
      .tagItem('utopia:decor')
  })
})