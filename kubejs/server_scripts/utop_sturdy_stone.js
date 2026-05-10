ServerEvents.tags('block', event => {
    // 1. Strip existing lower-tier requirements
    event.remove('minecraft:needs_stone_tool', 'quark:sturdy_stone')

    // 2. Force Diamond tier requirement
    event.add('minecraft:needs_iron_tool', 'quark:sturdy_stone')

    // 3. Ensure the game knows it specifically requires a pickaxe
    event.add('minecraft:mineable/pickaxe', 'quark:sturdy_stone')
})
