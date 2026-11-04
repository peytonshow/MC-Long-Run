function replaceRecipe(event, filter, ...adders) {
    [].concat(filter).forEach(f => event.remove(f))
    adders.forEach(add => add())
}

ServerEvents.recipes(event => {

    replaceRecipe(event, { output: 'minecraft:mud', type: 'create:mixing' },
        () => event.recipes.create.mixing('minecraft:mud', [['minecraft:dirt','minecraft:coarse_dirt','minecraft:rooted_dirt'], Fluid.water(100)])
            .processingTime(12)
    )
    event.recipes.create.compacting( 'minecraft:packed_mud', '4x minecraft:mud').heated()

    // Sconce
    replaceRecipe(event, [
        { output: 'supplementaries:sconce' },
        { output: 'supplementaries:sconce_soul' }
    ],
        () => event.shaped(
            Item.of('3x supplementaries:sconce')
            , [
                '   ',
                'BAB',
                ' B '
            ], {
            A: 'minecraft:torch',
            B: ['minecraft:iron_nugget', 'create:zinc_nugget', 'oreganized:lead_nugget']
        }),
        () => event.shaped(
            Item.of('3x supplementaries:sconce_soul')
            , [
                '   ',
                'BAB',
                ' B '
            ], {
            A: 'minecraft:soul_torch',
            B: ['minecraft:iron_nugget', 'create:zinc_nugget', 'oreganized:lead_nugget']
        })
    )

    // Lantern
    replaceRecipe(event, [
        { output: 'minecraft:lantern' },
        { output: 'minecraft:copper_lantern' },
        { output: 'minecraft:soul_lantern' }
    ],
        () => event.shaped(
            Item.of('4x minecraft:lantern')
            , [
                ' B ',
                'BAB',
                ' B '
            ], {
            A: 'minecraft:torch',
            B: ['minecraft:iron_nugget', 'create:zinc_nugget', 'oreganized:lead_nugget']
        }),
        () => event.shaped(
            Item.of('4x minecraft:copper_lantern')
            , [
                ' B ',
                'BAB',
                ' B '
            ], {
            A: 'minecraft:torch',
            B: 'create:copper_nugget'
        }),
        () => event.shaped(
            Item.of('4x minecraft:soul_lantern')
            , [
                ' B ',
                'BAB',
                ' B '
            ], {
            A: 'minecraft:soul_torch',
            B: ['minecraft:iron_nugget', 'create:zinc_nugget', 'oreganized:lead_nugget']
        })
    )
 
    // Flint
    
    replaceRecipe(event, 
        { output: 'create:metal_girder' },
        () => event.recipes.stonecutting('3x create:metal_girder', 'create:industrial_iron_block')
    )

    // Ash Brick
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
    })
    event.shaped('utopia:silver_gilded_blackstone', [
        'ABA',
        'BCB',
        'ABA'
    ], {
        A: 'minecraft:blackstone',
        B: 'oreganized:silver_ingot',
        C: 'minecraft:cinnabar'
    })
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
 