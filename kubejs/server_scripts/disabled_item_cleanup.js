const DISABLED_ITEMS = [
  /quark:vertical_.*_planks/,
  /tradeworks:.*_side_shelf/,

  'farmersdelight:wheat_dough',
  'frame_changer:crying_obsidian_brick_slab',
  'frame_changer:crying_polished_obsidian_stairs',
  'frame_changer:crying_obsidian_brick_stairs',
  'frame_changer:crying_polished_obsidian',
  'frame_changer:crying_polished_obsidian_wall',
  'frame_changer:crying_obsidian_bricks',
  'frame_changer:crying_obsidian_brick_wall',
  'frame_changer:crying_polished_obsidian_slab',
  'artifacts:lucky_scarf',
  'artifacts:eternal_steak',
  'artifacts:everlasting_beef',
  'supplementaries:quark/way_sign_ancient',
  'supplementaries:quark/cannon_boat_ancient',
  'supplementaries:quark/ancient_boat',
  'unusual_furniture:discord',
  'oreganized:bush_hammer',
  'parcool:grappling_hook',
  'parcool:hook',
  'parcool:traceur_gloves',
  'parcool:traceur_boots',
  'create_enchantment_industry:super_enchanting_template',
  'create_enchantment_industry:experience_cake_base',
  'create_enchantment_industry:experience_cake_slice'
]

ServerEvents.tags('item', event => {
  DISABLED_ITEMS.forEach(item => {
    event.add('utopia:disabled', item)
  })
})

ServerEvents.recipes(event => {
  event.remove({ output: '#utopia:disabled' })

  DISABLED_ITEMS.forEach(item => {
    event.remove({ output: item })
  })
})