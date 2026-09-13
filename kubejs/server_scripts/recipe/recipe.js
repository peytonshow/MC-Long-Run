ServerEvents.recipes(event => {

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

    event.remove({ output: 'create:rotation_speed_controller' })
    event.remove({ output: 'create_connected:inventory_access_port' })
    event.remove({ output: 'create:smart_chute'})
    event.remove({ output: 'create:mechanical_drill' })
    event.remove({ output: 'create:elevator_pulley' })
    event.remove({ output: 'create_connected:control_chip' })

    // Create Components
    event.shaped(
        Item.of('create:elevator_pulley'), [
        '  C',
        ' AB',
        ' DD'
    ], {
        A: 'minecraft:dried_kelp_block',
        B: 'create:brass_casing',
        C: 'utopia:circuit',
        D: 'create:iron_sheet',
    })
    event.shaped(
        Item.of('create:mechanical_drill'), [
        ' B ',
        'BAB',
        ' C '
    ], {
        A: 'utopia:moissanite',
        B: 'create:andesite_alloy',
        C: 'create:andesite_casing'
    })
    event.recipes.create.mechanical_crafting('create:rotation_speed_controller', [
        ' A ',
        ' B ',
        ' C '
    ], {
        A: 'create:precision_mechanism',
        B: 'utopia:circuit',
        C: 'create:brass_casing'
    })
    event.recipes.create.mechanical_crafting('create_connected:inventory_access_port', [
        ' A ',
        ' B ',
        ' C '
    ], {
        A: 'create:brass_casing',
        B: 'create:smart_chute',
        C: 'utopia:circuit'
    })
    event.shaped('create:smart_chute', [
        ' A ',
        ' B ',
        ' C '
    ], {
        A: 'create:brass_sheet',
        B: 'create_connected:brass_chute',
        C: 'create:content_observer'
    })
    event.shaped('create:smart_chute', [
        ' A ',
        ' B ',
        ' C '
    ], {
        A: 'create:brass_sheet',
        B: 'create_connected:brass_chute',
        C: 'utopia:circuit'
    })

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
        CreateItem.of('minecraft:diamond', 0.02),
        CreateItem.of('utopia:platinum_nugget', 0.01)
    ], [
        Fluid.of('minecraft:water', 40), '5x minecraft:amethyst_shard', '16x minecraft:cobbled_deepslate'
    ]).processingTime(800)

    // Gunpowder
    event.recipes.create.crushing([
        '5x utopia:pure_sulfur',
        CreateItem.of('3x utopia:pure_sulfur', 0.5),
        CreateItem.of('utopia:pure_sulfur', 0.5),
    ], [
        'minecraft:potent_sulfur'
    ])
    event.recipes.create.mixing(
        CreateItem.of('3x minecraft:gunpowder'),
        [
        'utopia:pure_sulfur',
        'minecraft:coal',
        'utopia:ammonium_nitrate'
        ])
    event.recipes.create.mixing([
        CreateItem.of('3x minecraft:gunpowder')
    ], [
        '3x minecraft:sugar',
        '2x minecraft:coal'
    ]).heated()

    // Mill efficiently!
    event.recipes.create.milling([
        CreateItem.of('7x utopia:pepper'),
        CreateItem.of('2x utopia:pepper', 0.35)
        ], [
        'minecraft:blackstone'
    ])
    event.recipes.create.crushing([
        CreateItem.of('utopia:pepper, 0.75'),
        ], [
        'minecraft:blackstone'
    ])

    event.recipes.create.milling([
        CreateItem.of('6x utopia:sea_salt'),
        CreateItem.of('5x utopia:sea_salt', 0.75)], [
        'minecraft:calcite'
    ])
    event.recipes.create.crushing([
        CreateItem.of('utopia:sea_salt')
        ], [
        'minecraft:calcite'
    ])

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
        CreateItem.of('utopia:moissanite', 0.60),
    ], [
        '6x utopia:silica_dust',
        '3x utopia:graphite_ingot',
        '15x minecraft:emerald'
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
        CreateItem.of('utopia:neon_block', 0.25),
        '16x minecraft:glass_bottle'
    ], [
        'oreganized:electrum_nugget',
        '16x quark:bottled_cloud',
        Fluid.of('utopia:propylene_glycol', 600)
    ]).processingTime(6000)
    event.recipes.create.mixing([
        Fluid.of('utopia:bleach', 200)
    ], [
        'utopia:sea_salt',
        Fluid.of('minecraft:water', 200),
        'create:experience_nugget'
    ]).heated().processingTime(300)
    event.recipes.create.mixing([
        Fluid.of('utopia:ammonia', 400)
    ], [
        Fluid.of('utopia:nitrogen', 200),
        Fluid.of('utopia:hydrogen', 200)
    ]).heated()
    event.recipes.create.mixing([
        Fluid.of('utopia:ammonia', 400),
        '9x utopia:platinum_nugget'
    ], [
        Fluid.of('utopia:nitric_acid', 200),
        Fluid.of('utopia:oxygen', 200),
        'utopia:platinum_ingot'
    ]).heated().processingTime(600)
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

    // Exp Farm
    event.recipes.create.compacting([
        CreateItem.of('2x create:experience_nugget', 0.35),
        CreateItem.of('create:experience_nugget', 0.25),
        '4x minecraft:stone_bricks'
    ], [
        '4x minecraft:infested_stone'
    ])

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
        CreateItem.of('utopia:platinum_nugget', 0.1)
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

    // Science Future.
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
      // Outputs:
      [
        
        CreateItem.of('utopia:circuit', 0.92),
        CreateItem.of('3x utopia:garbage', 0.02),
        CreateItem.of('7x utopia:garbage', 0.01),
        CreateItem.of('utopia:silica_dust', 0.04),
        CreateItem.of(`minecraft:egg[custom_name='{"bold":false,"color":"white","italic":false,"obfuscated":false,"strikethrough":false,"text":"Device","underlined":false}']`, 0.001)
        
      ],
      // Input:
      'utopia:plastic_ingot', 
      // Sequence:
      [
        event.recipes.create.deploying('utopia:incomplete_circuit_board', ['utopia:incomplete_circuit_board', 'create:copper_sheet']),
        event.recipes.create.filling('utopia:incomplete_circuit_board', ['utopia:incomplete_circuit_board', Fluid.of('utopia:nitric_acid', 50)]),
        event.recipes.create.deploying('utopia:incomplete_circuit_board', ['utopia:incomplete_circuit_board', 'utopia:wire_spool']),
        event.recipes.create.deploying('utopia:incomplete_circuit_board', ['utopia:incomplete_circuit_board', 'create:electron_tube']),
        event.recipes.create.pressing('utopia:incomplete_circuit_board', 'utopia:incomplete_circuit_board'),
      ]
    )
    .transitionalItem('utopia:incomplete_circuit_board')
    .loops(2)
    
    event.recipes.create.sequenced_assembly(
      // Outputs:
      [
        
        CreateItem.of('create_connected:control_chip', 0.999),
        CreateItem.of(`minecraft:egg[custom_name='{"bold":false,"color":"white","italic":false,"obfuscated":false,"strikethrough":false,"text":"Device","underlined":false}']`, 0.001)
        
      ],
      // Input:
      'create:transmitter', 
      // Sequence:
      [
        event.recipes.create.filling('create_connected:incomplete_control_chip', ['create_connected:incomplete_control_chip', Fluid.of('utopia:nitric_acid', 25)]),
        event.recipes.create.deploying('create_connected:incomplete_control_chip', ['create_connected:incomplete_control_chip', 'create:copper_sheet']),
        event.recipes.create.filling('create_connected:incomplete_control_chip', ['create_connected:incomplete_control_chip', Fluid.of('utopia:nitric_acid', 50)]),
        event.recipes.create.deploying('create_connected:incomplete_control_chip', ['create_connected:incomplete_control_chip', 'create:golden_sheet']),
        event.recipes.create.filling('create_connected:incomplete_control_chip', ['create_connected:incomplete_control_chip', Fluid.of('utopia:nitric_acid', 25)]),
        event.recipes.create.deploying('create_connected:incomplete_control_chip', ['create_connected:incomplete_control_chip', 'create:copper_sheet']),
        event.recipes.create.deploying('create_connected:incomplete_control_chip', ['create_connected:incomplete_control_chip', 'utopia:circuit']),
        event.recipes.create.deploying('create_connected:incomplete_control_chip', ['create_connected:incomplete_control_chip', 'utopia:wire_spool']),
        event.recipes.create.deploying('create_connected:incomplete_control_chip', ['create_connected:incomplete_control_chip', 'utopia:circuit']),
        event.recipes.create.deploying('create_connected:incomplete_control_chip', ['create_connected:incomplete_control_chip', 'utopia:wire_spool']),
        event.recipes.create.pressing('create_connected:incomplete_control_chip', 'create_connected:incomplete_control_chip'),
        event.recipes.create.pressing('create_connected:incomplete_control_chip', 'create_connected:incomplete_control_chip'),
      ]
    )
    .transitionalItem('create_connected:incomplete_control_chip')
    .loops(5)
})
