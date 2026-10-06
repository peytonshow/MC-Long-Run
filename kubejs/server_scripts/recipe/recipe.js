ServerEvents.recipes(event => {

    function replaceRecipe(filter, ...adders) {
        event.remove(filter)
        adders.forEach(add => add())
    }
    event.remove({ input: 'minecraft:soul_campfire', type: 'minecraft:crafting_shaped' })


    event.remove({ input: 'minecraft:gravel', type: 'create:splashing' })
    event.remove({ input: 'minecraft:sugar_cane', output: 'minecraft:sugar'})
    event.remove({ input: Ingredient.of('#c:cobblestones'), type: 'create:mixing', output: Fluid.of('minecraft:lava'),})
    event.remove({ output: 'oreganized:glance' })
    event.remove({ output: 'create:brass_ingot', type: 'create:mixing' })
    event.remove({ output: 'minecraft:paper', type: 'minecraft:crafting_shaped' })
    event.remove({ output: 'minecraft:paper', type: 'minecraft:crafting_shapeless' })
    event.remove({ output: 'minecraft:glass_bottle', type: 'minecraft:crafting_shaped' })
    event.remove({ output: 'minecraft:mushroom_stew', type: 'minecraft:crafting_shapeless' })
    event.remove({ output: 'minecraft:beetroot_soup', type: 'minecraft:crafting_shapeless' })
    event.remove({ output: 'create:rose_quartz', type: 'create:mixing' })

    event.remove({ output: 'minecraft:gold_nugget', type: 'create:splashing' })
    event.remove({ output: 'oreganized:silver_nugget', type: 'create:splashing' })

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

    // Forgin
    event.remove({ input: 'minecraft:gold_ingot', output: ['minecraft:netherite_ingot', 'oreganized:electrum_ingot']})
    const ingots = [
        { full: 'minecraft:copper_ingot', fluid: 'utopia:molten_copper', crushed : 'create:crushed_raw_copper', slagAmount : 25},
        { full: 'create:zinc_ingot', fluid: 'utopia:molten_zinc', crushed : 'create:crushed_raw_zinc', slagAmount : 25 },
        { full: 'create:brass_ingot', fluid: 'utopia:molten_brass' },
        { full: 'minecraft:iron_ingot', fluid: 'utopia:molten_iron', crushed : 'create:crushed_raw_iron', slagAmount : 50 },
        { full: 'oreganized:silver_ingot', fluid: 'utopia:molten_silver', crushed : 'create:crushed_raw_silver', slagAmount : 25 },
        { full: 'minecraft:gold_ingot', fluid: 'utopia:molten_gold', crushed : 'create:crushed_raw_gold', slagAmount : 25 },
        { full: 'utopia:platinum_ingot', fluid: 'utopia:molten_platinum' },
        { full: 'minecraft:netherite_scrap', fluid: 'utopia:molten_debrinium' },
        { full: 'minecraft:netherite_ingot', fluid: 'utopia:molten_netherite' },
        { full: 'oreganized:electrum_ingot', fluid: 'utopia:molten_electrum' },
        { full: 'oreganized:lead_ingot', fluid: 'oreganized:molten_lead', crushed : 'create:crushed_raw_lead', slagAmount : 75},
        { full: '3x utopia:garbage', fluid: 'utopia:molten_slag'}
    ];
    for (let item of ingots) {
        event.recipes.create.filling(item.full, [Fluid.of(item.fluid, 100), 'utopia:ingot_mould']);
        if(item.fluid == 'utopia:molten_slag') { continue; }


        if(item.crushed && item.slagAmount){
            event.recipes.create.mixing(
                [Fluid.of(item.fluid, 200), Fluid.of('utopia:molten_slag', item.slagAmount)],
                [item.crushed, Ingredient.of('#utopia:flux')]
            ).heated()
        }

        event.recipes.create.mixing(Fluid.of(item.fluid, 100),
            [item.full, Ingredient.of('#utopia:flux')]
        ).heated()
    }
    event.recipes.create.mixing([Fluid.of('utopia:molten_netherite', 25), Fluid.of('utopia:molten_slag', 175)],
        [Fluid.of('utopia:molten_debrinium', 100), Fluid.of('utopia:molten_gold', 100)]
    ).heated()
    event.recipes.create.mixing([Fluid.of('utopia:molten_electrum', 25), Fluid.of('utopia:molten_slag', 175)],
        [Fluid.of('utopia:molten_silver', 100), Fluid.of('utopia:molten_gold', 100)]
    ).heated()



    // Device
    replaceRecipe({ output: 'oreganized:unknown_device' },
        () => event.shaped(
            Item.of('oreganized:unknown_device')
            , [
            ' A ',
            'ABA',
            ' A '
        ], {
            A: 'minecraft:netherite_scrap',
            B: 'quark:redstone_randomizer'
    }))

    // BrewinNChewin
    replaceRecipe({ output: 'brewinandchewin:heating_cask' },
        () => event.shaped(
            Item.of('brewinandchewin:heating_cask')
            , [
            'CCC',
            'ADA',
            'BBB'
        ], {
            A: '#utopia:coal_blocks',
            B: '#minecraft:planks',
            C: '#minecraft:wooden_slabs',
            D: '#utopia:campfires'
    }))
    replaceRecipe({ output: 'brewinandchewin:ice_crate' },
        () => event.shaped(
            Item.of('brewinandchewin:ice_crate')
            , [
            'CAC',
            'BDB',
            'CBC'
        ], {
            A: 'farmersdelight:canvas',
            B: '#minecraft:planks',
            C: '#minecraft:wooden_slabs',
            D: 'minecraft:packed_ice'
    }))

    // Gliders
    event.shaped(
            Item.of('vc_gliders:paraglider_wood')
            , [
            'AAA',
            'BDB',
            'CBC'
        ], {
            A: 'farmersdelight:canvas',
            B: 'minecraft:stick',
            C: '#utopia:twine',
            D: 'minecraft:feather'
    })
    event.shaped(
            Item.of('vc_gliders:paraglider_iron')
            , [
            'AAA',
            'BDB',
            'CBC'
        ], {
            A: 'farmersdelight:canvas',
            B: 'minecraft:iron_ingot',
            C: 'minecraft:chain',
            D: 'minecraft:feather'
    })
    event.shaped(
            Item.of('vc_gliders:paraglider_gold')
            , [
            'AAA',
            'BDB',
            'CBC'
        ], {
            A: 'farmersdelight:canvas',
            B: 'minecraft:gold_ingot',
            C: 'minecraft:chain',
            D: 'minecraft:blaze_powder'
    })
    event.shaped(
            Item.of('vc_gliders:paraglider_diamond')
            , [
            'AAA',
            'CDC',
            'BCB'
        ], {
            A: 'farmersdelight:canvas',
            B: 'minecraft:feather',
            C: 'minecraft:breeze_rod',
            D: 'minecraft:diamond'
    })
    event.shaped(
            Item.of('vc_gliders:paraglider_netherite')
            , [
            'AAA',
            'CDC',
            'BCB'
        ], {
            A: 'farmersdelight:canvas',
            B: 'minecraft:blaze_powder',
            C: 'minecraft:blaze_rod',
            D: 'minecraft:netherite_scrap'
    })

    // Furnaces
    replaceRecipe({ output: 'minecraft:blast_furnace' },
        () => event.shaped(
            Item.of('minecraft:blast_furnace')
            , [
            'AAA',
            'ABA',
            'AAA'
        ], {
            A: ['minecraft:bricks', 'minecraft:packed_mud', 'minecraft:blackstone'],
            B: ['minecraft:campfire', 'minecraft:soul_campfire']
    }))
    
    // Chainmail
    const armorParts = ['helmet', 'chestplate', 'leggings', 'boots'];
    armorParts.forEach(part => {
      event.smithing(
          `minecraft:chainmail_${part}`,
          'minecraft:leather',
          `minecraft:leather_${part}`,
          'minecraft:chain'
      )
    });

    // Fiber unification
    event.shaped(
            Item.of('nirvana:deerstalker')
            , [
            '   ',
            'AAA',
            'A A'
        ], {
            A: '#utopia:burlap'
    })
    replaceRecipe({ output: 'nirvana:hemp_crate' },
        () => event.recipes.create.compacting([
            'nirvana:hemp_crate'
        ], [
            '9x nirvana:hemp',
            'create:cardboard'
    ]))
    replaceRecipe({ output: 'nirvana:weed_crate' },
        () => event.recipes.create.compacting([
            'nirvana:weed_crate'
        ], [
            '9x nirvana:weed',
            'create:cardboard'
    ]))
    event.shapeless('4x nirvana:hemp', '#utopia:burlap')
    event.shaped(
            Item.of('nirvana:woven_burlap')
            , [
            'AA ',
            'AA ',
            '   '
        ], {
            A: 'nirvana:hemp'
    })

    // Building
    event.recipes.create.pressing('supplementaries:ash_brick','supplementaries:ash')

    // Bones
    replaceRecipe({ input: 'minecraft:bone_block', output: 'minecraft:bone_meal'},
        () => event.shapeless(
            Item.of('9x minecraft:bone'),
            ['minecraft:bone_block']
    ))
    replaceRecipe({ output: 'minecraft:bone_block' },
        () => event.shaped(
            Item.of('minecraft:bone_block')
            , [
            'AAA',
            'AAA',
            'AAA'
        ], {
            A: 'minecraft:bone'
    }))

    // Food
    replaceRecipe({ input: 'farmersdelight:pumpkin_slice', output: 'minecraft:pumpkin_pie'},
        () => event.shaped(
            Item.of('minecraft:pumpkin_pie')
            ,[
            'ABA',
            'ACA',
            ' D '
        ], {
            A: 'farmersdelight:pumpkin_slice',
            B: Ingredient.of('#c:eggs'),
            C: 'minecraft:sugar',
            D: 'farmersdelight:pie_crust'
    }))
    replaceRecipe({ input: 'farmersdelight:pumpkin_slice', output: 'minecraft:pumpkin'},
        () => event.shaped(
            Item.of('minecraft:pumpkin')
            ,[
            'AAA',
            'AAA',
            'AAA'
        ], {
            A: 'farmersdelight:pumpkin_slice'
    }))
    replaceRecipe({ output: 'farmersdelight:canvas'},
        () => event.shaped(
            Item.of('farmersdelight:canvas')
            ,[
            'AA ',
            'AA ',
            '   '
        ], {
            A: ['farmersdelight:straw', 'supplementaries:flax', 'nirvana:hemp']
    }))
    replaceRecipe({ input: 'minecraft:pumpkin', output: 'farmersdelight:pumpkin_slice' },
    () => event.custom({
        type: 'farmersdelight:cutting',
        ingredients: [{ item: 'minecraft:pumpkin' }],
        tool: { type: 'farmersdelight:item_ability', action: 'axe_dig' },
        result: [{ item: { id: 'farmersdelight:pumpkin_slice', count: 9 } }]
    })
)

    // Create SU Sources
    replaceRecipe({ output: 'create:water_wheel' },
        () => event.shaped('create:water_wheel', [
            'ABA',
            'BCB',
            'ABA'
        ], {
            A: '#minecraft:planks',
            B: '#minecraft:logs',
            C: 'create:shaft'
    }))
    replaceRecipe({ output: 'create:large_water_wheel' },
        () => event.recipes.create.mechanical_crafting('create:large_water_wheel', [
            ' AAA ',
            'ADBDA',
            'ABCBA',
            'ADBDA',
            ' AAA '
        ], {
            A: '#minecraft:planks',
            B: '#minecraft:logs',
            C: 'create:water_wheel',
            D: 'unusual_furniture:screw'
    }))
    replaceRecipe({ output: 'create:white_sail' },
        () => event.shaped('4x create:white_sail', [
            'AB ',
            'BC ',
            '   '
        ], {
            A: ['#minecraft:wool', 'farmersdelight:canvas', 'minecraft:leather'],
            B: 'minecraft:stick',
            C: 'create:andesite_alloy'
    }))
    
    // Create Components
    replaceRecipe({ output: 'create_connected:sequenced_pulse_generator' },
        () => event.shaped(
            Item.of(
                'create_connected:sequenced_pulse_generator'), [
            'AB ',
            'ACE',
            'DDD'
        ], {
            A: 'create:electron_tube',
            B: 'utopia:advanced_circuit',
            C: 'create:brass_sheet',
            D: '#c:stones',
            E: 'minecraft:redstone_torch'
    }))
    replaceRecipe({ output: 'create:sequenced_gearshift' },
        () => event.shaped(
            Item.of(
                'create:sequenced_gearshift'), [
            'CBC',
            'DAD',
            'CDC'
        ], {
            A: 'create:brass_casing',
            B: 'utopia:advanced_circuit',
            C: 'create:brass_sheet',
            D: 'create:cogwheel'
    }))
    replaceRecipe({ output: 'create:elevator_pulley' },
        () => event.shaped(
            Item.of(
                'create:elevator_pulley'), [
            '  C',
            ' AB',
            ' DD'
        ], {
            A: 'minecraft:dried_kelp_block',
            B: 'create:brass_casing',
            C: 'utopia:basic_circuit',
            D: 'create:iron_sheet',
    }))
    replaceRecipe({ output: 'create:mechanical_drill' },
        () => event.shaped(
            Item.of('create:mechanical_drill'), [
            ' B ',
            'BAB',
            ' C '
        ], {
            A: 'utopia:moissanite',
            B: 'create:andesite_alloy',
            C: 'create:andesite_casing'
    }))
    replaceRecipe({ output: 'create:rotation_speed_controller' },
        () => event.recipes.create.mechanical_crafting('create:rotation_speed_controller', [
            ' A ',
            ' B ',
            ' C '
        ], {
            A: 'create:precision_mechanism',
            B: 'utopia:basic_circuit',
            C: 'create:brass_casing'
    }))
    replaceRecipe({ output: 'create_connected:inventory_access_port' },
        () => event.recipes.create.mechanical_crafting('create_connected:inventory_access_port', [
            ' A ',
            ' B ',
            ' C '
        ], {
            A: 'create:brass_casing',
            B: 'create:smart_chute',
            C: 'utopia:basic_circuit'
    }))
    replaceRecipe({ output: 'create:display_board' },
    () => event.shaped('4x create:display_board', [
        ' B ',
        'ACA',
        '   '
    ],{
        A: 'create:andesite_alloy',
        B: 'utopia:basic_circuit',
        C: 'create_connected:encased_chain_cogwheel'
    }))
    replaceRecipe({ output: 'create:content_observer' },
    () => event.shaped('create:content_observer', [
        ' A ',
        ' B ',
        ' C '
    ],{
        A: 'utopia:basic_circuit',
        B: 'create:brass_casing',
        C: 'minecraft:observer'
    }))
    replaceRecipe({ output: 'create:smart_chute' },
    () => event.shaped('2x create:smart_chute', [
        ' A ',
        ' B ',
        ' C '
    ],{
        A: 'create:brass_sheet',
        B: 'create_connected:brass_chute',
        C: 'create:content_observer'
    }))
    replaceRecipe({ output: 'create:schematicannon' },
    () => event.shaped('create:schematicannon', [
        'EAE',
        'BDB',
        'CCC'
    ],{
        A: 'supplementaries:cannon',
        B: '#minecraft:logs',
        C: 'minecraft:smooth_stone',
        D: 'utopia:advanced_circuit',
        E: 'create:cogwheel'
    }))

    // Survival
    replaceRecipe({ output: 'minecraft:campfire' },
        () => {
            event.shaped('minecraft:campfire', [
                'BA ',
                'ABA',
                'CCC'
            ], {
                A: 'minecraft:stick',
                B: 'minecraft:flint',
                C: Ingredient.of("#minecraft:logs")
            });
            event.shaped('minecraft:campfire', [
                ' AB',
                'ABA',
                'CCC'
            ], {
                A: 'minecraft:stick',
                B: 'minecraft:flint',
                C: Ingredient.of("#minecraft:logs")
            });
        }
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

    event.smithing(
        'utopia:platinum_sword',                     // arg 1: output
        'utopia:neon_block', // arg 2: the smithing template
        'minecraft:golden_sword',                          // arg 3: the item to be upgraded
        'utopia:platinum_ingot'                            // arg 4: the upgrade item
    )
    event.smithing(
        'utopia:platinum_axe',                     // arg 1: output
        'utopia:neon_block', // arg 2: the smithing template
        'minecraft:golden_axe',                          // arg 3: the item to be upgraded
        'utopia:platinum_ingot'                            // arg 4: the upgrade item
    )
    event.smithing(
        'utopia:platinum_pickaxe',                     // arg 1: output
        'utopia:neon_block', // arg 2: the smithing template
        'minecraft:golden_pickaxe',                          // arg 3: the item to be upgraded
        'utopia:platinum_ingot'                            // arg 4: the upgrade item
    )
    event.smithing(
        'utopia:platinum_shovel',                     // arg 1: output
        'utopia:neon_block', // arg 2: the smithing template
        'minecraft:golden_shovel',                          // arg 3: the item to be upgraded
        'utopia:platinum_ingot'                            // arg 4: the upgrade item
    )
    event.smithing(
        'utopia:platinum_hoe',                     // arg 1: output
        'utopia:neon_block', // arg 2: the smithing template
        'minecraft:golden_hoe',                          // arg 3: the item to be upgraded
        'utopia:platinum_ingot'                            // arg 4: the upgrade item
    )

    event.shaped(
        Item.of('supplementaries:jar'), [
        'A  ',
        'B  ',
        '   '
    ], {
        A: '#minecraft:wooden_slabs',
        B: 'utopia:beaker'
    })



    //////
    event.recipes.create.mixing('create:brass_ingot', [
        'utopia:uneven_raw_brass_precursor'
    ]).heated()
    event.recipes.create.splashing([CreateItem.of('create:crushed_raw_zinc'), CreateItem.of('create:crushed_raw_copper')], 'utopia:uneven_raw_brass_precursor')

    event.recipes.create.milling(CreateItem.of('create:crushed_raw_copper'), [
        'minecraft:raw_copper'], 200)
    event.recipes.create.milling(CreateItem.of('create:crushed_raw_zinc'), [
        'create:raw_zinc'], 200)
    event.recipes.create.milling(CreateItem.of('create:crushed_raw_iron'), [
        'minecraft:raw_iron'], 200)
    event.recipes.create.milling(CreateItem.of('create:crushed_raw_gold'), [
        'minecraft:raw_gold'], 200)
    event.recipes.create.milling(CreateItem.of('create:crushed_raw_silver'), [
        'oreganized:raw_silver'], 200)
    event.recipes.create.milling(CreateItem.of('create:crushed_raw_lead'), [
        'oreganized:raw_lead'], 200)
    event.recipes.create.milling(CreateItem.of('3x oreganized:refined_asbestos'), [
        'oreganized:raw_asbestos'], 100)
    event.recipes.create.crushing(CreateItem.of('3x oreganized:refined_asbestos'), [
        'oreganized:raw_asbestos'], 100)

    // Tumbling
    event.recipes.create.mixing([
        CreateItem.of('create:crushed_raw_iron', 0.50)
    ], [
        Fluid.of('minecraft:water', 100), 'minecraft:amethyst_shard', '10x minecraft:gravel'
    ]).processingTime(1000)

    event.recipes.create.mixing([
        CreateItem.of('create:crushed_raw_gold', 0.375)
    ], [
        Fluid.of('minecraft:water', 50), 'minecraft:amethyst_shard', '5x minecraft:red_sand'
    ]).processingTime(750)

    event.recipes.create.mixing([
        CreateItem.of('minecraft:bone', 0.75)
    ], [
        Fluid.of('minecraft:water', 100), 'minecraft:amethyst_shard', Ingredient.of('#minecraft:soul_fire_base_blocks', 10)
    ]).processingTime(2000)

    event.recipes.create.mixing([
        CreateItem.of('minecraft:gold_nugget', 0.2),
        CreateItem.of('utopia:platinum_nugget', 0.01)
    ], [
        Fluid.of('minecraft:water', 100), '2x minecraft:amethyst_shard', '16x minecraft:netherrack'
    ]).processingTime(800)

    // Gunpowder
    event.recipes.create.crushing([
        CreateItem.of('6x utopia:sulfur_dust', 0.25),
        CreateItem.of('3x utopia:sulfur_dust', 0.5),
        'utopia:sulfur_dust'
    ], [
        'minecraft:potent_sulfur'
    ])
    event.recipes.create.mixing([
        CreateItem.of('minecraft:gunpowder')
    ], [
        '4x minecraft:sugar',
        'minecraft:coal'
    ]).heated()
    event.recipes.create.mixing([
        CreateItem.of('2x minecraft:gunpowder')
    ], [
        '4x minecraft:sugar',
        'minecraft:coal',
        'minecraft:blaze_powder'
    ]).heated()
    event.recipes.create.mixing(
        CreateItem.of('3x minecraft:gunpowder'),
        [
        'utopia:sulfur_dust',
        'minecraft:coal',
        'utopia:ammonium_nitrate'
    ]).heated()

    // Mill efficiently!
    event.recipes.create.milling([
        CreateItem.of('7x utopia:pepper'),
        CreateItem.of('2x utopia:pepper', 0.35)
        ], [
        'minecraft:blackstone'
    ])
    event.recipes.create.crushing([
        CreateItem.of('utopia:pepper', 0.75),
        ], [
        'minecraft:blackstone'
    ])

    // Calcite / Aka Calcium-basically-carbonate
    event.recipes.create.mixing(['minecraft:calcite'], ['3x supplementaries:ash','3x minecraft:bone_meal', Fluid.of('minecraft:water', 300)])

    // Gravel
    event.recipes.create.crushing([
        CreateItem.of('3x minecraft:gravel')], [
        'minecraft:cobbled_deepslate'
    ])

    // Clothes Washing
    Ingredient.of('#utopia:washable').stacks.forEach(item => {
        event.recipes.create.mixing(item, [item, Fluid.of('minecraft:water', 250)]).processingTime(3000)
    })

    // Moissanite & Graphite
    event.recipes.create.compacting('utopia:pencil', ['minecraft:wooden_sword', 'utopia:graphite_ingot'])
    event.recipes.create.compacting([
        CreateItem.of('utopia:graphite_ingot'),
    ], [
        'minecraft:coal_block'
    ]).heated()
    event.recipes.create.compacting([
        CreateItem.of('utopia:moissanite', 0.55),
    ], [
        '5x utopia:silica_dust',
        '5x utopia:graphite_ingot',
        '5x minecraft:emerald'
    ]).superheated()

    event.recipes.create.mixing([
        CreateItem.of('create:rose_quartz', 0.83)
    ], [
        'minecraft:quartz',
        '8x minecraft:glowstone_dust',
        Fluid.of('utopia:nitric_acid', 200),
        'create:experience_nugget'
    ]).processingTime(200)

    // Silica
    event.recipes.create.mixing([
        CreateItem.of('7x utopia:silica_dust'),
        CreateItem.of('6x utopia:silica_dust', 0.9),
        CreateItem.of('2x minecraft:quartz', 0.4)
    ], [
        'minecraft:quartz_block',
        Fluid.of('utopia:nitric_acid', 100)
    ]).processingTime(160)
    event.recipes.create.milling([
        '3x utopia:silica_dust'
    ], [
        'minecraft:quartz'
    ])
    event.recipes.create.crushing([
        CreateItem.of('utopia:silica_dust', 0.55),
    ], [
        'minecraft:sand'
    ])
    event.recipes.create.compacting([
        CreateItem.of('minecraft:glass_bottle'),
    ], [
        'utopia:silica_dust'
    ]).heated()
    event.recipes.create.compacting([
        CreateItem.of('utopia:beaker'),
    ], [
        '1x minecraft:black_dye',
        '2x minecraft:glass_bottle'
    ]).heated()

    // Chemistry!!!
    const beakers = [
        { full: 'utopia:beaker_nitrogen', empty: 'utopia:beaker', fluid: 'utopia:nitrogen', amount: 200 },
        { full: 'utopia:beaker_oxygen', empty: 'utopia:beaker', fluid: 'utopia:oxygen', amount: 200 },
        { full: 'utopia:beaker_hydrogen', empty: 'utopia:beaker', fluid: 'utopia:hydrogen', amount: 200 },
        { full: 'utopia:beaker_ammonia', empty: 'utopia:beaker', fluid: 'utopia:ammonia', amount: 200 },
        { full: 'utopia:beaker_nitric_acid', empty: 'utopia:beaker', fluid: 'utopia:nitric_acid', amount: 200 },
        { full: 'utopia:beaker_bleach', empty: 'utopia:beaker', fluid: 'utopia:bleach', amount: 200 },
        { full: 'utopia:beaker_propylene_glycol', empty: 'utopia:beaker', fluid: 'utopia:propylene_glycol', amount: 200 }
    ];

    for (let item of beakers) {
        event.recipes.create.emptying([Fluid.of(item.fluid, item.amount), item.empty], item.full);
        event.recipes.create.filling(item.full, [Fluid.of(item.fluid, item.amount), item.empty]);
    }

    event.recipes.create.filling('supplementaries:lumisene_bottle', [Fluid.of('supplementaries:lumisene', 250), 'minecraft:glass_bottle'])

    event.recipes.create.compacting([
        'minecraft:glass_bottle',
        Fluid.of('utopia:nitrogen', 50),
    ], [
        'quark:bottled_cloud',
    ])
    event.recipes.create.mixing([
        Fluid.of('utopia:propylene_glycol', 1000)
    ], [
        Ingredient.of('#c:coal'),
        Fluid.of('utopia:hydrogen', 600),
        Fluid.of('utopia:oxygen', 400)
    ]).heated()
    event.recipes.create.mixing([
        CreateItem.of('utopia:sea_salt', .5),
        Fluid.of('utopia:oxygen', 200),
        Fluid.of('utopia:hydrogen', 400)
    ], [
        Fluid.of('minecraft:water', 600),
        '3x create:experience_nugget'
    ]).heated()
    event.recipes.create.mixing([
        'utopia:ammonium_nitrate'
    ], [
        Fluid.of('utopia:ammonia', 600),
        Fluid.of('utopia:nitric_acid', 600)
    ]).heated()

    event.recipes.create.mixing([
        Fluid.of('utopia:nitric_acid', 200)
    ], [
        Fluid.of('utopia:nitrogen', 200),
        Fluid.of('minecraft:water', 500)
    ])
    event.recipes.create.compacting([
        CreateItem.of('utopia:neon_block', 0.1),
        '16x minecraft:glass_bottle'
    ], [
        'create_enchantment_industry:super_experience_nugget',
        '16x quark:bottled_cloud',
        Fluid.of('utopia:propylene_glycol', 600)
    ])
    event.recipes.create.mixing([
        Fluid.of('utopia:bleach', 200)
    ], [
        '2x utopia:sea_salt',
        'supplementaries:ash',
        Fluid.of('minecraft:water', 200),
        Fluid.of('utopia:nitric_acid', 200)
    ]).heated().processingTime(300)

    // Ammonia
    // Haber Process
    event.recipes.create.compacting([
        Fluid.of('utopia:ammonia', 400)
    ], [
        Fluid.of('utopia:nitrogen', 200),
        Fluid.of('utopia:hydrogen', 600)
    ]).heated()
    // Ostwald Process
    event.recipes.create.mixing([
        Fluid.of('utopia:ammonia', 400),
        '9x utopia:platinum_nugget'
    ], [
        Fluid.of('utopia:nitric_acid', 200),
        Fluid.of('utopia:oxygen', 200),
        'utopia:platinum_ingot'
    ]).processingTime(100)


    event.recipes.create.compacting([
        '1x quark:bottled_cloud',
        'minecraft:heart_of_the_sea'
    ], [
        'minecraft:glass_bottle',
        'minecraft:heart_of_the_sea'
    ]).heated()
    event.recipes.create.compacting([
        Fluid.of('minecraft:water', 200),
        'minecraft:blue_ice',
        'minecraft:heart_of_the_sea'
    ], [
        'minecraft:blue_ice',
        'minecraft:heart_of_the_sea'
    ]).heated()
    event.recipes.create.mixing([
        CreateItem.of('2x utopia:plastic_ingot'),
        CreateItem.of('utopia:plastic_ingot', 0.10)
    ], [
        'oreganized:refined_asbestos',
        Fluid.of('utopia:propylene_glycol', 400),
        Fluid.of('utopia:nitric_acid', 400)
    ]).heated().processingTime(600)
    event.recipes.create.mixing([
        CreateItem.of('utopia:garbage')
    ], [
        Fluid.of('utopia:propylene_glycol', 1000),
        Fluid.of('utopia:nitric_acid', 1000)
    ]).processingTime(200)

    // Lava
    event.recipes.create.mixing([
        'minecraft:magma_block',
    ], [
       Ingredient.of('#c:cobblestones')
    ]).superheated().processingTime(30)

    event.recipes.create.compacting([
        Fluid.of('minecraft:lava', 50),
    ], [
        'minecraft:magma_block',
    ])

    //Garbage
    event.recipes.create.mixing([
        CreateItem.of('3x supplementaries:ash', 0.5),
        CreateItem.of('2x supplementaries:ash', 0.25),
        CreateItem.of('supplementaries:ash', 0.25),
    ], [
        'utopia:garbage',
        Fluid.of('utopia:nitric_acid', 200)
    ]).heated().processingTime(200)
    event.recipes.create.mixing([
        'utopia:garbage',
    ], [
        Fluid.of('utopia:ammonia', 200),
        Fluid.of('utopia:bleach', 200)
    ]).heated().processingTime(1000)

    // Exp Farm - ONLY IF NOT RUNNING CREATE ENCHANTING IND!!
    // event.recipes.create.compacting([
    //     CreateItem.of('2x create:experience_nugget', 0.35),
    //     CreateItem.of('create:experience_nugget', 0.25),
    //     '4x minecraft:stone_bricks'
    // ], [
    //     '4x minecraft:infested_stone'
    // ])

    // Gold + Platinum
    event.recipes.create.splashing([
        '9x minecraft:gold_nugget',
        CreateItem.of('minecraft:quartz', 0.5),
        CreateItem.of('utopia:platinum_nugget', 0.02)
    ], [
        'create:crushed_raw_gold'
    ])
    event.recipes.create.splashing([
        CreateItem.of('9x oreganized:silver_nugget'),
        CreateItem.of('utopia:platinum_nugget', 0.05)
    ], [
        'create:crushed_raw_silver'
    ])

    event.recipes.create.mechanical_crafting('minecraft:warden_spawn_egg', [
        'IEJEI',
        'EEXEE',
        'JXSXJ',
        'EEXEE',
        'IEJEI'
    ], {
        E: 'minecraft:echo_shard',
        J: 'quark:diamond_heart',
        I: 'utopia:neon_block',
        X: 'minecraft:sculk_catalyst',
        S: 'minecraft:sculk_shrieker'
    })
    // Mimic
    event.shaped(
        Item.of('artifacts:mimic_spawn_egg', 1), [
        'BCB',
        'BAB',
        'BBB'
    ], {
        A: '#artifacts:artifacts',
        B: 'minecraft:rotten_flesh',
        C: 'utopia:shadow_key'
    })
    event.recipes.create.haunting(
        'utopia:shadow_key',
        'supplementaries:key'
    )
    event.recipes.create.pressing('supplementaries:key','utopia:shadow_key')
    replaceRecipe({ output: 'storagedrawers:drawer_key' },
        () => event.shapeless(
            'storagedrawers:drawer_key', 
            ['supplementaries:key', 'storagedrawers:upgrade_template']
    ))

    // Musket''
    replaceRecipe({ output: 'musketmod:musket_upgrade_smithing_template' },
        () => event.shaped(
                Item.of('musketmod:musket_upgrade_smithing_template', 1), [
                'BAB',
                'BCB',
                'BBB'
            ], {
                A: 'musketmod:musket_upgrade_smithing_template',
                B: 'minecraft:emerald',
                C: 'minecraft:iron_block'
    }))

    // Science Future.
    event.shaped('utopia:circuit_upgrade_template', [
            'ACA',
            'ABA',
            'AAA'
        ], {
            A: 'utopia:plastic_ingot',
            B: 'minecraft:gold_block',
            C: 'utopia:circuit_upgrade_template'
    })
    event.recipes.create.pressing('utopia:block_of_plastic','utopia:plastic_ingot')
    event.shaped('utopia:computer_block', [
            'AAA',
            'DBC',
            'DED'
        ], {
            A: '#c:ingots/iron',
            B: 'quark:abacus',
            C: '#c:glass_blocks',
            D: 'utopia:block_of_plastic',
            E: 'utopia:advanced_circuit',
    })
    event.shapeless('4x utopia:computanian', [['utopia:computer_block_coding', 'utopia:computer_block','utopia:computer_block_terminal', 'utopia:computer_block_data', 'utopia:computer_block_space']])
    event.shaped('utopia:computer_block', [
            'AA ',
            'AA ',
            '   '
        ], {
            A: 'utopia:computanian',
    })
    event.shapeless('utopia:computer_block', '#utopia:computer/blue/working')
    event.shapeless('utopia:computer_block_terminal', '#utopia:computer/blue/working')
    event.shapeless('utopia:computer_block_data', '#utopia:computer/blue/working')
    event.shapeless('utopia:computer_block_space', '#utopia:computer/blue/working')
    event.shapeless('utopia:computer_block_coding', '#utopia:computer/blue/working')

    event.shapeless('utopia:tan_computer_block', '#utopia:computer/tan/working')
    event.shapeless('utopia:tan_computer_block_terminal', '#utopia:computer/tan/working')
    event.shapeless('utopia:tan_computer_block_data', '#utopia:computer/tan/working')
    event.shapeless('utopia:tan_computer_block_space', '#utopia:computer/tan/working')
    event.shapeless('utopia:tan_computer_block_coding', '#utopia:computer/tan/working')

   
    event.recipes.create.pressing('utopia:broken_computer',[['utopia:computer_block_coding', 'utopia:computer_block','utopia:computer_block_terminal', 'utopia:computer_block_data', 'utopia:computer_block_space', 'utopia:computer_block_badsignal']])

    
    event.shaped(
        Item.of('utopia:wire', 32), [
        'BBB',
        'AAA',
        'BBB'
    ], {
        A: '#utopia:conductive_material',
        B: 'utopia:plastic_ingot'
    })

    event.recipes.create.mixing([
        'utopia:wire_spool',
    ], [
        Ingredient.of('#minecraft:wooden_slabs', 2),
        'create:shaft',
        '50x utopia:wire'
    ]).processingTime(2000)

    event.recipes.create.sequenced_assembly(
      [
        // Outputs:
        CreateItem.of('utopia:basic_circuit', 0.93),
        CreateItem.of('4x supplementaries:ash', 0.02),
        CreateItem.of('4x utopia:garbage', 0.01),
        CreateItem.of('utopia:silica_dust', 0.02),
        CreateItem.of('utopia:plastic_ingot', 0.01),
        CreateItem.of(`minecraft:egg[custom_name='{"bold":false,"color":"white","italic":false,"obfuscated":false,"strikethrough":false,"text":"Device","underlined":false}']`, 0.01)
        
      ],
      // Input:
      'create:cardboard',
      // Sequence:
      [
        event.recipes.create.deploying('utopia:incomplete_basic_circuit', ['utopia:incomplete_basic_circuit', 'create:copper_sheet']),
        event.recipes.create.filling('utopia:incomplete_basic_circuit', ['utopia:incomplete_basic_circuit', Fluid.of('utopia:nitric_acid', 50)]),
        event.recipes.create.deploying('utopia:incomplete_basic_circuit', ['utopia:incomplete_basic_circuit', 'utopia:wire_spool']),
        event.recipes.create.deploying('utopia:incomplete_basic_circuit', ['utopia:incomplete_basic_circuit', 'utopia:wire_spool']),
        event.recipes.create.deploying('utopia:incomplete_basic_circuit', ['utopia:incomplete_basic_circuit', 'create:electron_tube']),
        event.recipes.create.pressing('utopia:incomplete_basic_circuit', 'utopia:incomplete_basic_circuit'),
      ]
    )
    .transitionalItem('utopia:incomplete_basic_circuit')
    .loops(1)
    
event.recipes.create.sequenced_assembly(
  [
    // Outputs:
    CreateItem.of('utopia:advanced_circuit', 0.97),
    CreateItem.of('2x utopia:garbage', 0.01),
    CreateItem.of('utopia:plastic_ingot', 0.01),
    CreateItem.of(`minecraft:egg[custom_name='{"bold":false,"color":"white","italic":false,"obfuscated":false,"strikethrough":false,"text":"Device","underlined":false}']`, 0.01)
  ],
  // Input:
  'utopia:circuit_upgrade_template',
  // Sequence:
  [
    // Stage 1: substrate prep (6)
    event.recipes.create.deploying('utopia:incomplete_advanced_circuit', ['utopia:incomplete_advanced_circuit', 'utopia:silica_dust']),
    event.recipes.create.filling('utopia:incomplete_advanced_circuit', ['utopia:incomplete_advanced_circuit', Fluid.of('utopia:nitric_acid', 50)]),
    event.recipes.create.cutting('utopia:incomplete_advanced_circuit', 'utopia:incomplete_advanced_circuit'),
    event.recipes.create.filling('utopia:incomplete_advanced_circuit', ['utopia:incomplete_advanced_circuit', Fluid.of('utopia:bleach', 25)]),
    event.recipes.create.deploying('utopia:incomplete_advanced_circuit', ['utopia:incomplete_advanced_circuit', 'utopia:silica_dust']),
    event.recipes.create.pressing('utopia:incomplete_advanced_circuit', 'utopia:incomplete_advanced_circuit'),

    // Stage 2: wiring (6)
    event.recipes.create.deploying('utopia:incomplete_advanced_circuit', ['utopia:incomplete_advanced_circuit', 'utopia:wire_spool']),
    event.recipes.create.deploying('utopia:incomplete_advanced_circuit', ['utopia:incomplete_advanced_circuit', 'utopia:wire_spool']),
    event.recipes.create.deploying('utopia:incomplete_advanced_circuit', ['utopia:incomplete_advanced_circuit', 'utopia:wire_spool']),
    event.recipes.create.pressing('utopia:incomplete_advanced_circuit', 'utopia:incomplete_advanced_circuit'),
    event.recipes.create.filling('utopia:incomplete_advanced_circuit', ['utopia:incomplete_advanced_circuit', Fluid.of('utopia:nitric_acid', 25)]),
    event.recipes.create.cutting('utopia:incomplete_advanced_circuit', 'utopia:incomplete_advanced_circuit'),

    // Stage 3: conductive layers (6)
    event.recipes.create.filling('utopia:incomplete_advanced_circuit', ['utopia:incomplete_advanced_circuit', Fluid.of('utopia:nitric_acid', 25)]),
    event.recipes.create.deploying('utopia:incomplete_advanced_circuit', ['utopia:incomplete_advanced_circuit', 'create:golden_sheet']),
    event.recipes.create.filling('utopia:incomplete_advanced_circuit', ['utopia:incomplete_advanced_circuit', Fluid.of('utopia:nitric_acid', 50)]),
    event.recipes.create.deploying('utopia:incomplete_advanced_circuit', ['utopia:incomplete_advanced_circuit', 'create:brass_sheet']),
    event.recipes.create.filling('utopia:incomplete_advanced_circuit', ['utopia:incomplete_advanced_circuit', Fluid.of('utopia:bleach', 25)]),
    event.recipes.create.pressing('utopia:incomplete_advanced_circuit', 'utopia:incomplete_advanced_circuit'),

    // Stage 4: logic core (6)
    event.recipes.create.deploying('utopia:incomplete_advanced_circuit', ['utopia:incomplete_advanced_circuit', 'utopia:basic_circuit']),
    event.recipes.create.deploying('utopia:incomplete_advanced_circuit', ['utopia:incomplete_advanced_circuit', 'create:precision_mechanism']),
    event.recipes.create.deploying('utopia:incomplete_advanced_circuit', ['utopia:incomplete_advanced_circuit', 'utopia:wire_spool']),
    event.recipes.create.deploying('utopia:incomplete_advanced_circuit', ['utopia:incomplete_advanced_circuit', 'create:transmitter']),
    event.recipes.create.cutting('utopia:incomplete_advanced_circuit', 'utopia:incomplete_advanced_circuit'),
    event.recipes.create.pressing('utopia:incomplete_advanced_circuit', 'utopia:incomplete_advanced_circuit'),

    // Stage 5: platinum contacts + coolant coat (6)
    event.recipes.create.deploying('utopia:incomplete_advanced_circuit', ['utopia:incomplete_advanced_circuit', 'utopia:platinum_nugget']),
    event.recipes.create.filling('utopia:incomplete_advanced_circuit', ['utopia:incomplete_advanced_circuit', Fluid.of('utopia:nitric_acid', 25)]),
    event.recipes.create.deploying('utopia:incomplete_advanced_circuit', ['utopia:incomplete_advanced_circuit', 'utopia:wire_spool']),
    event.recipes.create.filling('utopia:incomplete_advanced_circuit', ['utopia:incomplete_advanced_circuit', Fluid.of('utopia:propylene_glycol', 50)]),
    event.recipes.create.deploying('utopia:incomplete_advanced_circuit', ['utopia:incomplete_advanced_circuit', 'utopia:platinum_nugget']),
    event.recipes.create.pressing('utopia:incomplete_advanced_circuit', 'utopia:incomplete_advanced_circuit'),
  ]
)
.transitionalItem('utopia:incomplete_advanced_circuit')
.loops(3)
})
