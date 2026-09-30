const DISABLED_REGEX = [
  /^quark:vertical_.*_planks$/,
  /^tradeworks:.*_side_shelf$/
]

const DISABLED_IDS = [
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
  'create_enchantment_industry:experience_cake',
  'create_enchantment_industry:experience_cake_slice',
  'storagedrawers:personal_key_ftb',
  'storagedrawers:personal_key_unlock',
  'storagedrawers:suspend_key',
  'storagedrawers:magnet_upgrade_2',
  'storagedrawers:magnet_upgrade_3',
  'storagedrawers:remote_upgrade',
  'storagedrawers:remote_group_upgrade',
  'storagedrawers:magnet_upgrade',
  'storagedrawers:portability_upgrade',
  'storagedrawers:framing_table',
  'storagedrawers:drawer_puller',
  'create_connected:incomplete_control_chip',
  'create_connected:control_chip'
]

const ALL_DISABLED = DISABLED_IDS.concat(DISABLED_REGEX)

ServerEvents.tags('item', event => {
  DISABLED_IDS.forEach(id => event.removeAllTagsFrom(id))
  DISABLED_IDS.forEach(id => event.add('utopia:disabled', id))
  DISABLED_REGEX.forEach(re => event.add('utopia:disabled', re))
})