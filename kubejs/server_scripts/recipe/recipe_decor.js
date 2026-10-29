function replaceRecipe(event, filter, ...adders) {
    [].concat(filter).forEach(f => event.remove(f))
    adders.forEach(add => add())
}

ServerEvents.recipes(event => {
 
    event.shapeless(Item.of('create:framed_glass'),['minecraft:glass'])
    event.shapeless(Item.of('create:horizontal_framed_glass'),['minecraft:glass'])
    event.shapeless(Item.of('create:vertical_framed_glass'),['minecraft:glass'])
    event.shapeless(Item.of('create:tiled_glass'),['minecraft:glass'])
    event.shapeless('minecraft:glass', [['create:framed_glass','create:horizontal_framed_glass','create:vertical_framed_glass','create:tiled_glass']])
 
    event.shapeless(Item.of('create:framed_glass_pane'), ['minecraft:glass_pane'])
    event.shapeless(Item.of('create:horizontal_framed_glass_pane'), ['minecraft:glass_pane'])
    event.shapeless(Item.of('create:vertical_framed_glass_pane'), ['minecraft:glass_pane'])
    event.shapeless(Item.of('create:tiled_glass_pane'), ['minecraft:glass_pane'])
    event.shapeless('minecraft:glass_pane', [['create:framed_glass_pane', 'create:horizontal_framed_glass_pane', 'create:vertical_framed_glass_pane', 'create:tiled_glass_pane']])
 
    // Decor
    event.shaped(
            Item.of('4x utopia:polished_flint')
            , [
            'AA ',
            'AA ',
            '   '
        ], {
            A: 'supplementaries:flint_block'
    })
 
    // Building
    event.recipes.create.pressing('supplementaries:ash_brick','supplementaries:ash')
 
    event.shaped('4x utopia:smooth_stone_stairs', [
        'S  ',
        'SS ',
        'SSS'
    ], {
        S: 'minecraft:smooth_stone'
    })
    event.stonecutting('utopia:smooth_stone_stairs', 'minecraft:smooth_stone')
 
    event.shaped('minecraft:gilded_blackstone', [
        'ABA',
        'BCB',
        'ABA'
    ], {
        A: 'minecraft:blackstone',
        B: 'minecraft:gold_ingot',
        C: 'minecraft:cinnabar'
    }).group('boat')
    event.shaped('utopia:silver_gilded_blackstone', [
        'ABA',
        'BCB',
        'ABA'
    ], {
        A: 'minecraft:blackstone',
        B: 'oreganized:silver_ingot',
        C: 'minecraft:cinnabar'
    }).group('boat')
    event.shaped('utopia:sea_salt_lamp', [
        'AAA',
        'ABA',
        'AAA'
    ], {
        A: 'utopia:sea_salt_block',
        B: 'minecraft:sea_lantern'
    })
 
    event.shaped(Item.of('minecraft:verdant_froglight', 4), [
        'ABA',
        'BCB',
        'ABA'
    ], {
        A: 'minecraft:snowball',
        B: 'minecraft:magma_cream',
        C: 'minecraft:verdant_froglight'
    })
    event.shaped(Item.of('minecraft:ochre_froglight', 4), [
        'ABA',
        'BCB',
        'ABA'
    ], {
        A: 'minecraft:slime_ball',
        B: 'minecraft:magma_cream',
        C: 'minecraft:ochre_froglight'
    })
    event.shaped(Item.of('minecraft:pearlescent_froglight', 4), [
        'AAA',
        'ABA',
        'AAA'
    ], {
        A: 'minecraft:magma_cream',
        B: 'minecraft:pearlescent_froglight'
    })
 
    // frame_changer: misc
    replaceRecipe(event, { output: 'frame_changer:crying_chiseled_obsidian' },
        () => event.stonecutting('frame_changer:crying_chiseled_obsidian', 'minecraft:crying_obsidian')
    )
    replaceRecipe(event, { output: 'frame_changer:crying_obsidian_pillar' },
        () => event.stonecutting('frame_changer:crying_obsidian_pillar', 'minecraft:crying_obsidian')
    )
 
    // Cheapen all cosmetic templates
    event.forEachRecipe({ type: 'minecraft:crafting_shaped', output: '#minecraft:trim_templates' }, recipe => {
        let keys = recipe.json.get('key')
 
        if (keys && keys.has('C') && keys.has('S')) {
            event.remove({ id: recipe.getId() })
 
            event.shaped(recipe.originalRecipeResult, [
                'CSC',
                'C#C',
                'CCC'
            ], {
                'C': keys.get('C'),
                'S': keys.get('S'),
                '#': '#utopia:diamonds'
            })
        }
    })
})
 