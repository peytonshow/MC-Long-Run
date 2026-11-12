function replaceRecipe(event, filter, ...adders) {
    [].concat(filter).forEach(f => event.remove(f))
    adders.forEach(add => add())
}

ServerEvents.recipes(event => {


    const families = [
        { functional: 'minecraft:cartography_table', variants: ['polished_dark_oak_wood'] },
        { functional: 'minecraft:loom', variants: ['loominum_paneling', 'loominum_polished'] },
        { functional: 'minecraft:barrel', variants: ['spruce_paneling', 'spruce_polished'] },
        { functional: 'minecraft:smithing_table', variants: ['smithistone_paneling', 'smithistone_polished'] },
        { functional: 'minecraft:lodestone', variants: ['lodium'] },
        { functional: 'minecraft:beehive', variants: ['hivium_paneling', 'hivium_polished'] },
        { functional: 'minecraft:chiseled_bookshelf', variants: ['wormwood_paneling', 'wormwood_polished'] },
        { functional: 'minecraft:blast_furnace', variants: ['blastar_polished'] },
        { functional: 'minecraft:composter', variants: ['poster_paneling', 'poster_polished'] },
        { functional: 'minecraft:daylight_detector', variants: ['solstice_paneling'] },
    ].forEach(family => {
        family.variants.forEach(id => {
            event.stonecutting(`16x utopia:${id}`, family.functional)
        })

        family.variants.forEach(from => {
            family.variants.forEach(to => {
                if (from !== to) {
                    event.stonecutting(`utopia:${to}`, `utopia:${from}`)
                }
            })
        })
    })

    replaceRecipe(event, { output: 'minecraft:light_gray_concrete_powder' },
        () => event.shapeless('8x minecraft:light_gray_concrete_powder', [
            '4x minecraft:sand',
            '4x minecraft:gravel'
        ])
    )


    replaceRecipe(event, { output: 'minecraft:mud', type: 'create:mixing' },
        () => event.recipes.create.mixing('minecraft:mud', [
            ['minecraft:dirt', 'minecraft:coarse_dirt', 'minecraft:rooted_dirt'], Fluid.water(100)]).processingTime(12),
        () => event.recipes.create.splashing(CreateItem.of('minecraft:mud', 0.4),
            Ingredient.of(['minecraft:dirt', 'minecraft:coarse_dirt', 'minecraft:rooted_dirt']))
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
 
    // girders
    replaceRecipe(event, { output: 'create:metal_girder' },
        () => event.recipes.stonecutting('3x create:metal_girder', 'create:industrial_iron_block')
    )

    // Calcite / Aka Calcium-basically-carbonate
    event.recipes.create.mixing(['3x minecraft:calcite'], ['3x supplementaries:ash','3x minecraft:bone_meal', Fluid.of('minecraft:water', 100)]).processingTime(80)

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
    event.shaped('6x utopia:smooth_stone_wall', [
        '   ',
        'SSS',
        'SSS'
    ], {
        S: 'minecraft:smooth_stone'
    })
    event.stonecutting('utopia:smooth_stone_wall', 'minecraft:smooth_stone')

    // Decraft
    event.stonecutting('minecraft:smooth_stone', '#utopia:stone_types/smooth_stone')
    event.stonecutting('utopia:polished_flint', '#utopia:stone_types/polished_flint')
    event.stonecutting('minecraft:packed_mud', '#utopia:stone_types/packed_mud')
    event.stonecutting('minecraft:bricks', '#utopia:stone_types/bricks')
 
    replaceRecipe(event, { output: 'minecraft:redstone_lamp' },
        () => event.shaped('2x minecraft:redstone_lamp', [
            ' B ',
            'BAB',
            ' B '
        ], {
            A: 'minecraft:glowstone',
            B: 'minecraft:redstone'
        })
    )

    replaceRecipe(event, { output: 'supplementaries:flower_box' },
        () => event.shaped('2x supplementaries:flower_box', [
            '   ',
            'AAA',
            'BBB'
        ], {
            A: 'minecraft:flower_pot',
            B: '#minecraft:wooden_slabs'
        })
    )

    replaceRecipe(event, { output: 'create:ornate_iron_window' },
        () => event.shaped('3x create:ornate_iron_window', [
            ' A ',
            'ABA',
            '   '
        ], {
            A: '#utopia:metal_beads',
            B: 'minecraft:glass',
        })
    )
    replaceRecipe(event, { output: 'create:industrial_iron_window' },
        () => event.shaped('3x create:industrial_iron_window', [
            ' A ',
            'ABA',
            '   '
        ], {
            A: 'create:industrial_iron_block',
            B: 'minecraft:glass'
        })
    )
        

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
    event.shaped('4x utopia:sea_salt_lamp', [
        ' A ',
        'ABA',
        ' A '
    ], {
        A: 'utopia:sea_salt_block',
        B: 'minecraft:torch'
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
 