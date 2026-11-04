function replaceRecipe(event, filter, ...adders) {
    [].concat(filter).forEach(f => event.remove(f))
    adders.forEach(add => add())
}

ServerEvents.recipes(event => {
    // Basically just items that can be directly turned into another
    // Use tagger.js!!

    event.stonecutting('minecraft:mud_bricks', 'minecraft:packed_mud')
    event.shapeless(
            'minecraft:packed_mud',
            [['minecraft:mud_bricks', 'quark:mud_brick_lattice', 'quark:carved_mud_bricks', 'quark:mud_pillar']]
    )

    // Glass
    Ingredient.of('#utopia:transmutable_panes').stacks.forEach(item => {
        event.shapeless(item, '#utopia:transmutable_panes')
    })
    Ingredient.of('#utopia:transmutable_glass').stacks.forEach(item => {
        event.shapeless(item, '#utopia:transmutable_glass')
    })
})
 