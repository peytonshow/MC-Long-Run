// ---- globals ----

const armorParts = ['helmet', 'chestplate', 'leggings', 'boots']

const beakers = ['nitrogen', 'oxygen', 'hydrogen', 'ammonia', 'nitric_acid', 'bleach', 'propylene_glycol']
    .map(name => ({ full: `utopia:beaker_${name}`, empty: 'utopia:beaker', fluid: `utopia:${name}`, amount: 200 }))

const bulkDye = (event, color, input, output) =>
    event.custom({
        type: 'create_dragons_plus:coloring',
        color: `minecraft:${color}`,
        ingredients: [{ item: input }],
        results: [{ id: output }]
    }).id(`kubejs:bulk_coloring/${input.split(':')[1]}_to_${color}`)

function fermenting(event, o) {
    const toIngredient = s => (s.startsWith('#') ? { tag: s.substring(1) } : { item: s })

    const ingredients = o.ingredients.map(toIngredient)
    while (ingredients.length < 4) ingredients.push([])

    const isFluidResult = o.count === undefined

    const json = {
        type: 'brewinandchewin:fermenting',
        experience: o.experience === undefined ? 1.0 : o.experience,
        ingredients: ingredients,
        result: isFluidResult
            ? { amount: o.amount || 1000, id: o.result }
            : { count: o.count, id: o.result }
    }

    if (o.base) {
        // brewin's own files keep the leading '#' on fluid tags, so it is passed through as is
        json.base_fluid = {
            amount: o.baseAmount || 1000,
            ingredient: o.base.startsWith('#') ? { tag: o.base } : { id: o.base },
            unit: 'millibuckets'
        }
    }
    if (o.base || isFluidResult) json.unit = 'millibuckets'
    if (o.category) json.category = o.category
    if (o.time !== undefined) json.fermenting_time = o.time
    if (o.temperature !== undefined) json.temperature = o.temperature

    const recipe = event.custom(json)
    if (o.id) recipe.id(o.id)
}

function cutting(event, input, output, count, tool) {
    // tool: a tag string ('c:tools/knife', the default) or a full tool object
    event.custom({
        type: 'farmersdelight:cutting',
        ingredients: [input.startsWith('#') ? { tag: input.substring(1) } : { item: input }],
        result: [{ item: { count: count || 1, id: output } }],
        tool: (tool && typeof tool === 'object') ? tool : { tag: tool || 'c:tools/knife' }
    })
}

// results: array of 'id', 'Nx id', or { item: 'Nx id', chance: 0.1 }; tool: '#tag', 'item:id' or a full ingredient object
function cuttingMulti(event, input, tool, results) {
    const parseStack = str => {
        const m = /^(\d+)x\s+(.+)$/.exec(str)
        return m ? { count: parseInt(m[1]), id: m[2] } : { count: 1, id: str }
    }
    const toTool = t => (typeof t === 'object') ? t : (t.startsWith('#') ? { tag: t.substring(1) } : { item: t })

    event.custom({
        type: 'farmersdelight:cutting',
        ingredients: [input.startsWith('#') ? { tag: input.substring(1) } : { item: input }],
        result: results.map(r => {
            const o = (typeof r === 'string') ? { item: r } : r
            const out = { item: parseStack(o.item) }
            if (o.chance !== undefined) out.chance = o.chance
            return out
        }),
        tool: toTool(tool)
    })
}

// Farmer's Delight cooking pot; tab: 'meals' | 'drinks' | 'misc'; container is the item needed in the pot's container slot
function cooking(event, o) {
    const toIngredient = s => (s.startsWith('#') ? { tag: s.substring(1) } : { item: s })
    const json = {
        type: 'farmersdelight:cooking',
        recipe_book_tab: o.tab || 'meals',
        ingredients: o.ingredients.map(toIngredient),
        result: { count: o.count || 1, id: o.result },
        experience: o.experience === undefined ? 1.0 : o.experience,
        cookingtime: o.time || 200
    }
    if (o.container) json.container = { count: 1, id: o.container }
    const recipe = event.custom(json)
    if (o.id) recipe.id(o.id)
}

// filter can be a single filter object or an array of them
function replaceRecipe(event, filter, ...adders) {
    [].concat(filter).forEach(f => event.remove(f))
    adders.forEach(add => add())
}


ServerEvents.recipes(event => {

    // Removal. For replacements use the function above, nerd

    event.remove({ input: 'minecraft:wheat', output: 'minecraft:bread' })
    event.remove({ input: 'minecraft:soul_campfire', type: 'minecraft:crafting_shaped' })
    event.remove({ input: 'minecraft:gravel', type: 'create:splashing' })
    event.remove({ output: 'oreganized:glance' })
    event.remove({ output: 'minecraft:mushroom_stew', type: 'minecraft:crafting_shapeless' })
    event.remove({ output: 'minecraft:beetroot_soup', type: 'minecraft:crafting_shapeless' })

    replaceRecipe(event, { input: 'create:shaft',output: 'createadditionallogistics:lazy_shaft' },
        () => event.shapeless(Item.of('createadditionallogistics:lazy_shaft'), Item.of('create:shaft'))
    )
    replaceRecipe(event, { input: 'createadditionallogistics:lazy_shaft',output: 'create:shaft' },
        () => event.shapeless(Item.of('create:shaft'), Item.of('createadditionallogistics:lazy_shaft'))
    )

  event.blasting('minecraft:glass', '#minecraft:smelts_to_glass').xp(0.1).cookingTime(100)
  event.blasting('quark:sturdy_stone', 'minecraft:cobblestone').xp(0.1).cookingTime(500)
  event.blasting('minecraft:terracotta', 'minecraft:clay').xp(0.35).cookingTime(100)
    cutting(event, 'minecraft:terracotta', 'minecraft:brick', 4,
            { type: 'farmersdelight:item_ability', action: 'pickaxe_dig' })
  event.campfireCooking('minecraft:cookie', 'utopia:cookie_dough').xp(0.05).cookingTime(200).id('utopia:campfire/cookie_dough_camping')
  event.campfireCooking('supplementaries:ash', '#minecraft:planks').xp(0.02).cookingTime(200).id('utopia:campfire/utop_ash_camping')
  event.campfireCooking('minecraft:brick', 'minecraft:clay_ball').xp(0.02).cookingTime(800).id('utopia:campfire/utop_brick')
  event.campfireCooking('minecraft:charcoal', '#minecraft:logs_that_burn').xp(0.05).cookingTime(400).id('utopia:campfire/utop_charcoal_camping')
  event.campfireCooking('minecraft:fire_charge', '#minecraft:coals').cookingTime(400).id('utopia:campfire/utop_firecharge_camping')
  event.campfireCooking('minecraft:leather', 'minecraft:rotten_flesh').xp(0.15).cookingTime(1200).id('utopia:campfire/utop_leather_tanning')
  event.campfireCooking('minecraft:terracotta', 'minecraft:clay').xp(0.1).cookingTime(1300).id('utopia:campfire/utop_terracotta')
  event.campfireCooking('minecraft:cobblestone', 'minecraft:mossy_cobblestone').xp(0.1).cookingTime(250).id('utopia:campfire/utop_unmossy_cobblestone')

    replaceRecipe(event, { output: 'minecraft:shears' },
        () => event.shaped(
            Item.of('minecraft:shears')
            , [
            ' A ',
            'A  ',
            '   '
        ], {
            A: ['create:zinc_ingot', 'minecraft:iron_ingot']
    }))

    event.recipes.create.mixing([
        CreateItem.of('minecraft:kelp', 0.25)
    ], [
        '4x minecraft:seagrass',
        'minecraft:bone_meal'
    ])

    replaceRecipe(event, [{ input: 'farmersdelight:straw',output: 'minecraft:packed_mud' }, { input: 'minecraft:wheat'}],
        () => event.shapeless(Item.of('2x minecraft:packed_mud'), [Ingredient.of('#supplementaries:straw'),'minecraft:mud','minecraft:mud'])
    )
    event.blasting('minecraft:charcoal', '#minecraft:logs_that_burn').cookingTime(100)

    replaceRecipe(event, { input: 'minecraft:sugar_cane', output: 'minecraft:sugar' },
        () => event.recipes.create.crushing([
            CreateItem.of('minecraft:sugar'),
            CreateItem.of('minecraft:sugar', 0.25),
            CreateItem.of('create:pulp', 0.25),
        ], 'minecraft:sugar_cane')
    )

    event.shapeless(Item.of('utopia:letter_of_invitation'), ['minecraft:writable_book','minecraft:diamond'])

    // Replace minecraft:copper_nugget with create:copper_nugget in all recipe inputs
    // SUPER IMPORTANT i think. actually i have no idea
    event.replaceInput({}, 'minecraft:copper_nugget', 'create:copper_nugget')

    event.recipes.create.compacting([
            'minecraft:tuff'
        ], [
            'minecraft:sand',
            '2x minecraft:quartz',
            '5x minecraft:deepslate'
    ]).superheated()

    //  Fermenting
    replaceRecipe(event, [
        { output: 'minecraft:paper', type: 'minecraft:crafting_shaped' },
        { output: 'minecraft:paper', type: 'minecraft:crafting_shapeless' }
    ], () => fermenting(event, {
        ingredients: ['create:pulp', 'create:pulp'],
        result: 'minecraft:paper', count: 8,
        category: 'meals', temperature: 4
    }))

    // Device
    replaceRecipe(event, { output: 'oreganized:unknown_device' },
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

    // Gliders
    replaceRecipe(event, { output: 'vc_gliders:paraglider_wood' },
        () => event.shaped(Item.of('vc_gliders:paraglider_wood'), [
            'AAA',
            'BDB',
            'CBC'
        ], {
            A: 'farmersdelight:canvas',
            B: 'minecraft:stick',
            C: '#utopia:twine',
            D: 'minecraft:feather'
    }))
    replaceRecipe(event, { output: 'vc_gliders:paraglider_iron' },
        () => event.shaped(Item.of('vc_gliders:paraglider_iron'), [
            'AAA',
            'BDB',
            'CBC'
        ], {
            A: 'farmersdelight:canvas',
            B: 'minecraft:iron_ingot',
            C: '#c:chains',
            D: 'minecraft:feather'
    }))
    replaceRecipe(event, { output: 'vc_gliders:paraglider_gold' },
        () => event.shaped(Item.of('vc_gliders:paraglider_gold'), [
            'AAA',
            'BDB',
            'CBC'
        ], {
            A: 'farmersdelight:canvas',
            B: 'minecraft:gold_ingot',
            C: '#c:chains',
            D: 'minecraft:blaze_powder'
    }))
    replaceRecipe(event, { output: 'vc_gliders:paraglider_diamond' },
        () => event.shaped(Item.of('vc_gliders:paraglider_diamond'), [
            'AAA',
            'CDC',
            'BCB'
        ], {
            A: 'farmersdelight:canvas',
            B: 'minecraft:feather',
            C: 'minecraft:breeze_rod',
            D: 'minecraft:diamond'
    }))
    replaceRecipe(event, { output: 'vc_gliders:paraglider_netherite' },
        () => event.shaped(Item.of('vc_gliders:paraglider_netherite'), [
            'AAA',
            'CDC',
            'BCB'
        ], {
            A: 'farmersdelight:canvas',
            B: 'minecraft:blaze_powder',
            C: 'minecraft:blaze_rod',
            D: 'minecraft:netherite_scrap'
    }))

    // Furnaces
    replaceRecipe(event, { output: 'minecraft:blast_furnace' },
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
          '#c:chains'
      )
    });

    // Fiber unification
    replaceRecipe(event, { output: 'nirvana:deerstalker' },
        () => event.shaped(Item.of('nirvana:deerstalker'), [
            '   ',
            'AAA',
            'A A'
        ], {
            A: '#utopia:burlap'
    }))

    event.shapeless('4x nirvana:hemp', '#utopia:burlap')
    replaceRecipe(event, { output: 'nirvana:woven_burlap' },
        () => event.shaped(Item.of('nirvana:woven_burlap'), [
            'AA ',
            'AA ',
            '   '
        ], {
            A: 'nirvana:hemp'
    }))

    // Bones
    replaceRecipe(event, { input: 'minecraft:bone_block', output: 'minecraft:bone_meal'},
        () => event.shapeless(
            Item.of('9x minecraft:bone'),
            ['minecraft:bone_block']
    ))
    replaceRecipe(event, { output: 'minecraft:bone_block' },
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
    replaceRecipe(event, { input: 'farmersdelight:pumpkin_slice', output: 'minecraft:pumpkin_pie'},
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
    replaceRecipe(event, { input: 'farmersdelight:pumpkin_slice', output: 'minecraft:pumpkin'},
        () => event.shaped(
            Item.of('minecraft:pumpkin')
            ,[
            'AAA',
            'AAA',
            'AAA'
        ], {
            A: 'farmersdelight:pumpkin_slice'
    }))
    replaceRecipe(event, { output: 'farmersdelight:canvas'},
        () => event.shaped(
            Item.of('farmersdelight:canvas')
            ,[
            'AA ',
            'AA ',
            '   '
        ], {
            A: ['farmersdelight:straw', 'supplementaries:flax', 'nirvana:hemp']
    }))
    replaceRecipe(event, { input: 'minecraft:pumpkin', output: 'farmersdelight:pumpkin_slice' },
        () => cutting(event, 'minecraft:pumpkin', 'farmersdelight:pumpkin_slice', 9,
            { type: 'farmersdelight:item_ability', action: 'axe_dig' })
    )
    replaceRecipe(event, { output: 'brewinandchewin:heating_cask' },
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
    replaceRecipe(event, { output: 'brewinandchewin:ice_crate' },
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
    replaceRecipe(event, { output: 'create:dough', type: 'minecraft:crafting_shapeless'},
        () => event.shapeless(Item.of('create:dough'), ['minecraft:water_bucket', 'create:wheat_flour']).keepIngredient('minecraft:water_bucket')
    )

    // Create SU Sources
    replaceRecipe(event, { output: 'create:water_wheel' },
        () => event.shaped('create:water_wheel', [
            'ABA',
            'BCB',
            'ABA'
        ], {
            A: '#minecraft:planks',
            B: '#minecraft:logs',
            C: 'create:shaft'
    }))
    replaceRecipe(event, { output: 'create:large_water_wheel' },
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
    replaceRecipe(event, { output: 'create:white_sail' },
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
    replaceRecipe(event, { output: 'create_connected:sequenced_pulse_generator' },
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
    replaceRecipe(event, { output: 'create:sequenced_gearshift' },
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
    replaceRecipe(event, { output: 'create:elevator_pulley' },
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
    replaceRecipe(event, { output: 'create:mechanical_drill' },
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
    replaceRecipe(event, { output: 'create:rotation_speed_controller' },
        () => event.recipes.create.mechanical_crafting('create:rotation_speed_controller', [
            ' A ',
            ' B ',
            ' C '
        ], {
            A: 'create:precision_mechanism',
            B: 'utopia:basic_circuit',
            C: 'create:brass_casing'
    }))
    replaceRecipe(event, { output: 'create_connected:inventory_access_port' },
        () => event.recipes.create.mechanical_crafting('create_connected:inventory_access_port', [
            ' A ',
            ' B ',
            ' C '
        ], {
            A: 'create:brass_casing',
            B: 'create:smart_chute',
            C: 'utopia:basic_circuit'
    }))
    replaceRecipe(event, { output: 'create:display_board' },
    () => event.shaped('4x create:display_board', [
        ' B ',
        'ACA',
        '   '
    ],{
        A: 'create:andesite_alloy',
        B: 'utopia:basic_circuit',
        C: 'create_connected:encased_chain_cogwheel'
    }))
    replaceRecipe(event, { output: 'create:content_observer' },
    () => event.shaped('create:content_observer', [
        ' A ',
        ' B ',
        ' C '
    ],{
        A: 'utopia:basic_circuit',
        B: 'create:brass_casing',
        C: 'minecraft:observer'
    }))
    replaceRecipe(event, { output: 'create:smart_chute' },
    () => event.shaped('2x create:smart_chute', [
        ' A ',
        ' B ',
        ' C '
    ],{
        A: 'create:brass_sheet',
        B: 'create_connected:brass_chute',
        C: 'create:content_observer'
    }))
    replaceRecipe(event, { output: 'create:schematicannon' },
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
    replaceRecipe(event, { output: 'minecraft:campfire' },
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
    event.shaped(
        Item.of('artifacts:mimic_spawn_egg', 3), [
        'BCB',
        'BAB',
        'BBB'
    ], {
        A: '#artifacts:artifacts',
        B: 'minecraft:rotten_flesh',
        C: 'utopia:chroma_key'
    })
    event.recipes.create.haunting(
        'utopia:shadow_key',
        'supplementaries:key'
    )
    event.recipes.create.pressing('supplementaries:key','utopia:shadow_key')
    replaceRecipe(event, { output: 'storagedrawers:drawer_key' },
        () => event.shapeless(
            'storagedrawers:drawer_key', 
            ['supplementaries:key', 'storagedrawers:upgrade_template']
    ))
    event.smithing(
        'utopia:chroma_key',
        'utopia:neon_block',
        'utopia:shadow_key',
        'utopia:platinum_ingot'
    )

    replaceRecipe(event, { output: 'supplementaries:jar' },
        () => event.shaped(Item.of('supplementaries:jar'), [
            'A  ',
            'B  ',
            '   '
        ], {
            A: '#minecraft:wooden_slabs',
            B: 'utopia:beaker'
    }))

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
    event.recipes.create.mixing(['minecraft:calcite'], ['3x supplementaries:ash','3x minecraft:bone', Fluid.of('minecraft:water', 300)])

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
    event.recipes.create.compacting([
        CreateItem.of('utopia:moissanite', 0.75),
    ], [
        '5x utopia:silica_dust',
        '5x utopia:graphite_ingot',
        '5x minecraft:emerald'
    ]).superheated()

    // Lava
    replaceRecipe(event, { input: Ingredient.of('#c:cobblestones'), type: 'create:mixing', output: Fluid.of('minecraft:lava') },
        () => event.recipes.create.mixing([
            'minecraft:magma_block',
        ], [
            Ingredient.of('#c:cobblestones')
        ]).superheated().processingTime(50),
        () => event.recipes.create.compacting([
            Fluid.of('minecraft:lava', 100),
        ], [
            'minecraft:magma_block',
        ])
    )

    // Clay
    event.recipes.create.crushing([
        CreateItem.of('minecraft:clay_ball', 0.75),
        CreateItem.of('minecraft:clay_ball', 0.5),
        CreateItem.of('minecraft:clay_ball', 0.25),
    ], 
        Ingredient.of('#minecraft:dirt')
    ).processingTime(100)

    // Exp Farm - ONLY IF NOT RUNNING CREATE ENCHANTING IND!!
    // event.recipes.create.compacting([
    //     CreateItem.of('2x create:experience_nugget', 0.35),
    //     CreateItem.of('create:experience_nugget', 0.25),
    //     '4x minecraft:stone_bricks'
    // ], [
    //     '4x minecraft:infested_stone'
    // ])

    // Gold + Platinum
    replaceRecipe(event, { output: 'minecraft:gold_nugget', type: 'create:splashing' },
        () => event.recipes.create.splashing([
            '9x minecraft:gold_nugget',
            CreateItem.of('minecraft:quartz', 0.5),
            CreateItem.of('utopia:platinum_nugget', 0.02)
        ], [
            'create:crushed_raw_gold'
        ])
    )
    replaceRecipe(event, { output: 'oreganized:silver_nugget', type: 'create:splashing' },
        () => event.recipes.create.splashing([
            CreateItem.of('9x oreganized:silver_nugget'),
            CreateItem.of('utopia:platinum_nugget', 0.05)
        ], [
            'create:crushed_raw_silver'
        ])
    )

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

    // Musket''
    replaceRecipe(event, { output: 'musketmod:musket_upgrade_smithing_template' },
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
        Item.of('utopia:wire', 25), [
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
    ]).processingTime(1000)

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


    event.remove({ output: 'create:crafting/appliances/slime_ball' })
    event.remove({ output: 'minecraft:cookie' })
    event.remove({ output: 'quark:building/crafting/furnaces/mixed_furnace' })
    event.remove({ output: 'quark:building/crafting/sturdy_stone' })
    event.remove({ output: 'quark:building/crafting/sturdy_stone_cyclic' })
    event.remove({ output: 'quark:building/crafting/sturdy_stone_uncompress' })
    event.remove({ output: 'royalvariations:royal_bow' })
    event.remove({ output: 'royalvariations:royal_upgrade_duplicate' })

    cuttingMulti(event, 'minecraft:red_sand', 'minecraft:brush', [
        { item: 'create:crushed_raw_gold', chance: 0.1 },
        { item: '3x minecraft:gold_nugget', chance: 0.1 }
    ])
    cuttingMulti(event, 'minecraft:blackstone', '#c:tools/knife', [
        { item: 'utopia:pepper', chance: 0.05 }
    ])
    cuttingMulti(event, 'minecraft:leather', 'minecraft:shears', [
        '4x minecraft:rabbit_hide'
    ])
    cuttingMulti(event, 'minecraft:sand', '#minecraft:shovels', [
        { item: '2x minecraft:clay_ball', chance: 0.3 },
        { item: 'minecraft:clay_ball', chance: 0.6 }
    ])
    cuttingMulti(event, 'minecraft:sand', 'minecraft:brush', [
        { item: 'utopia:silica_dust', chance: 0.7 }
    ])
    cutting(event, 'minecraft:wheat', 'create:wheat_flour')
    event.recipes.create.sequenced_assembly(
        // Outputs:
        [
            'minecraft:netherite_chestplate'
        ],
        // Input:
        'minecraft:diamond_chestplate',
        // Sequence:
        [
            event.recipes.create.deploying('utopia:incomplete_netherite_chestplate', ['utopia:incomplete_netherite_chestplate', 'minecraft:golden_chestplate']),
            event.recipes.create.filling('utopia:incomplete_netherite_chestplate', ['utopia:incomplete_netherite_chestplate', Fluid.of('minecraft:lava', 750)]),
            event.recipes.create.deploying('utopia:incomplete_netherite_chestplate', ['utopia:incomplete_netherite_chestplate', 'minecraft:netherite_scrap']),
            event.recipes.create.pressing('utopia:incomplete_netherite_chestplate', 'utopia:incomplete_netherite_chestplate'),
            event.recipes.create.deploying('utopia:incomplete_netherite_chestplate', ['utopia:incomplete_netherite_chestplate', 'oreganized:netherite_nugget'])
        ]
    ).transitionalItem('utopia:incomplete_netherite_chestplate').loops(9)
    event.recipes.create.sequenced_assembly(
        // Outputs:
        [
            'minecraft:netherite_helmet'
        ],
        // Input:
        'minecraft:diamond_helmet',
        // Sequence:
        [
            event.recipes.create.deploying('utopia:incomplete_netherite_helmet', ['utopia:incomplete_netherite_helmet', 'oreganized:netherite_nugget']),
            event.recipes.create.deploying('utopia:incomplete_netherite_helmet', ['utopia:incomplete_netherite_helmet', 'minecraft:netherite_scrap']),
            event.recipes.create.filling('utopia:incomplete_netherite_helmet', ['utopia:incomplete_netherite_helmet', Fluid.of('minecraft:lava', 500)]),
            event.recipes.create.deploying('utopia:incomplete_netherite_helmet', ['utopia:incomplete_netherite_helmet', 'minecraft:golden_helmet']),
            event.recipes.create.pressing('utopia:incomplete_netherite_helmet', 'utopia:incomplete_netherite_helmet'),
            event.recipes.create.pressing('utopia:incomplete_netherite_helmet', 'utopia:incomplete_netherite_helmet')
        ]
    ).transitionalItem('utopia:incomplete_netherite_helmet').loops(6)
    event.recipes.create.sequenced_assembly(
        // Outputs:
        [
            CreateItem.of('minecraft:netherite_leggings', 0.95),
            CreateItem.of('minecraft:netherite_ingot', 0.05)
        ],
        // Input:
        'minecraft:diamond_leggings',
        // Sequence:
        [
            event.recipes.create.deploying('utopia:incomplete_netherite_leggings', ['utopia:incomplete_netherite_leggings', 'minecraft:golden_leggings']),
            event.recipes.create.filling('utopia:incomplete_netherite_leggings', ['utopia:incomplete_netherite_leggings', Fluid.of('minecraft:lava', 500)]),
            event.recipes.create.cutting('utopia:incomplete_netherite_leggings', 'utopia:incomplete_netherite_leggings').processingTime(5000),
            event.recipes.create.deploying('utopia:incomplete_netherite_leggings', ['utopia:incomplete_netherite_leggings', 'minecraft:netherite_scrap']),
            event.recipes.create.cutting('utopia:incomplete_netherite_leggings', 'create:andesite_alloy').processingTime(5000),
            event.recipes.create.deploying('utopia:incomplete_netherite_leggings', ['utopia:incomplete_netherite_leggings', 'oreganized:netherite_nugget'])
        ]
    ).transitionalItem('utopia:incomplete_netherite_leggings').loops(9)

    event.shaped('minecraft:arrow', [
        'A',
        'A',
        'A'
    ], {
        A: 'minecraft:bamboo'
    })
    event.shaped(Item.of('minecraft:arrow', 2), [
        'A',
        'B',
        'C'
    ], {
        A: ['minecraft:flint', '#utopia:bolts'],
        B: 'minecraft:stick',
        C: '#utopia:leathers'
    })
    event.shaped('supplementaries:bomb', [
        ' AB',
        'ACA',
        ' A '
    ], {
        A: ['#c:glass_blocks', '#c:bricks'],
        B: '#c:strings',
        C: 'minecraft:tnt'
    }).group('bomb')

    event.shaped(Item.of('minecraft:mud', 8), [
        'AAA',
        'ABA',
        'AAA'
    ], {
        A: ['minecraft:coarse_dirt', 'minecraft:dirt'],
        B: ['minecraft:sugar_cane', 'minecraft:water_bucket']
    })
    event.shaped('supplementaries:quiver', [
        ' AB',
        'A B',
        ' AC'
    ], {
        A: '#utopia:twine',
        B: '#utopia:leathers',
        C: 'minecraft:bundle'
    })
    event.shaped('minecraft:red_bed', [
        'AAA',
        'BBB'
    ], {
        A: '#minecraft:wool',
        B: '#minecraft:planks'
    }).group('bed')
    event.shaped('royalvariations:royal_bow', [
        ' AB',
        'A C',
        'BC '
    ], {
        A: 'royalvariations:royal_bone',
        B: 'minecraft:stick',
        C: 'minecraft:string'
    })
    event.shaped('utopia:sea_salt_block', [
        'AAA',
        'AAA',
        'AAA'
    ], {
        A: 'utopia:sea_salt'
    })
    event.shaped(Item.of('minecraft:tnt', 2), [
        'AAA',
        'ABA',
        'AAA'
    ], {
        A: 'minecraft:sand',
        B: 'quark:gunpowder_sack'
    })
 
    event.shapeless(Item.of('minecraft:brown_dye', 2), ['minecraft:black_dye', 'minecraft:orange_dye'])
    event.smelting('minecraft:cookie', 'utopia:cookie_dough').xp(0.05).cookingTime(20)
    event.shapeless(Item.of('minecraft:green_dye', 2), ['minecraft:blue_dye', 'minecraft:yellow_dye'])
    event.shapeless('utopia:seasoned_cooked_beef', ['minecraft:cooked_beef', '#utopia:spices'])
    event.shapeless('utopia:seasoned_cooked_chicken', ['minecraft:cooked_chicken', '#utopia:spices'])
    event.shapeless('utopia:seasoned_cooked_mutton', ['minecraft:cooked_mutton', '#utopia:spices'])
    event.shapeless('utopia:seasoned_cooked_porkchop', ['minecraft:cooked_porkchop', '#utopia:spices'])
    event.shapeless('utopia:seasoned_cooked_rabbit', ['minecraft:cooked_rabbit', '#utopia:spices'])
    event.shapeless(Item.of('supplementaries:soap', 4), [
        'minecraft:seagrass',
        'minecraft:seagrass',
        'minecraft:seagrass',
        'minecraft:seagrass',
        'supplementaries:lumisene_bottle',
        'minecraft:seagrass',
        'minecraft:seagrass',
        'minecraft:seagrass',
        'minecraft:seagrass'
    ])
    event.shapeless(Item.of('minecraft:wind_charge', 6), [
        'minecraft:gunpowder',
        'minecraft:blaze_powder',
        'minecraft:snowball'
    ])
 
    event.shapeless(Item.of('utopia:cookie_dough', 6), ['create:dough', 'minecraft:cocoa_beans', 'create:dough'])
    event.smelting('minecraft:gunpowder', 'minecraft:potent_sulfur').xp(0.05).cookingTime(1400)
 
    replaceRecipe(event, { output: 'brewinandchewin:fiery_fondue_pot' },
        () => cooking(event, {
            tab: 'meals',
            ingredients: [
                'farmersdelight:tomato_sauce',
                '#c:crops/potato',
                '#c:drinks/milk',
                'brewinandchewin:scarlet_cheese_wheel',
                'farmersdelight:ham',
                '#c:foods/bread'
            ],
            result: 'brewinandchewin:fiery_fondue_pot',
            experience: 2.0,
            time: 400,
            container: 'minecraft:cauldron'
        })
    )
 
    replaceRecipe(event, { output: 'brewinandchewin:jerky' },
        () => fermenting(event, {
            ingredients: [
                '#brewinandchewin:foods/jerky_meat',
                '#brewinandchewin:foods/jerky_meat',
                '#brewinandchewin:foods/jerky_meat',
                'utopia:sea_salt'
            ],
            result: 'brewinandchewin:jerky',
            count: 4,
            category: 'meals',
            temperature: 4
        })
    )
 
    replaceRecipe(event, { output: 'brewinandchewin:keg' },
        () => event.shaped('brewinandchewin:keg', [
            'ABA',
            'ACA',
            'BBB'
        ], {
            A: 'minecraft:iron_ingot',
            B: '#minecraft:planks',
            C: 'minecraft:honeycomb'
        })
    )
    replaceRecipe(event, { input: 'farmersdelight:cooked_bacon', output: 'brewinandchewin:quiche' },
        () => event.shaped('brewinandchewin:quiche', [
            'ABA',
            'CDC',
            'EFE'
        ], {
            A: 'farmersdelight:cooked_bacon',
            B: '#c:crops/cabbage',
            C: '#c:drinks/milk',
            D: '#brewinandchewin:foods/cheese_wedge',
            E: '#c:eggs',
            F: 'farmersdelight:pie_crust'
        })
    )
    replaceRecipe(event, { type: 'minecraft:crafting_shaped', output: 'brewinandchewin:quiche' },
        () => event.shaped('brewinandchewin:quiche', [
            'ABA',
            'CDC',
            'EFE'
        ], {
            A: 'minecraft:brown_mushroom',
            B: 'farmersdelight:cabbage_leaf',
            C: '#c:drinks/milk',
            D: '#brewinandchewin:foods/cheese_wedge',
            E: '#c:eggs',
            F: 'farmersdelight:pie_crust'
        })
    )
 
    replaceRecipe(event, { output: 'create:fluid_pipe' },
        () => event.shaped(Item.of('create:fluid_pipe', 4), [
            'ABA'
        ], {
            A: '#c:plates/copper',
            B: ['#c:ingots/copper', 'oreganized:lead_ingot']
        })
    )
    event.shaped(Item.of('create:fluid_pipe', 4), [
            'A',
            'B',
            'A'
        ], {
            A: '#c:plates/copper',
            B: ['#c:ingots/copper', 'oreganized:lead_ingot']
    })
 
    replaceRecipe(event, { output: 'farmersdelight:stove' },
        () => event.shaped('farmersdelight:stove', [
            'AAA',
            'B B',
            'BCB'
        ], {
            A: ['#c:ingots/iron', 'minecraft:copper_block'],
            B: 'minecraft:bricks',
            C: 'minecraft:campfire'
        })
    )
 
    // minecraft: misc
    replaceRecipe(event, { output: 'minecraft:arrow' },
        () => event.shaped(Item.of('minecraft:arrow', 4), [
            'A',
            'B',
            'C'
        ], {
            A: ['minecraft:flint', '#utopia:bolts'],
            B: 'minecraft:stick',
            C: 'minecraft:feather'
        })
    )
    replaceRecipe(event, { output: 'minecraft:bow' },
        () => event.shaped('minecraft:bow', [
            ' AA',
            'A B',
            'AB '
        ], {
            A: 'minecraft:stick',
            B: 'minecraft:string'
        })
    )
    replaceRecipe(event, { output: 'minecraft:furnace' },
        () => event.shaped('minecraft:furnace', [
            'ABA',
            'BCB',
            'ABA'
        ], {
            A: 'minecraft:copper_block',
            B: 'quark:sturdy_stone',
            C: 'minecraft:blast_furnace'
        })
    )
    replaceRecipe(event, { output: 'minecraft:leather_boots' },
        () => event.shaped('minecraft:leather_boots', [
            'A A',
            'A A'
        ], {
            A: '#utopia:leathers'
        })
    )
    replaceRecipe(event, { output: 'minecraft:leather_chestplate' },
        () => event.shaped('minecraft:leather_chestplate', [
            'A A',
            'AAA',
            'AAA'
        ], {
            A: '#utopia:leathers'
        })
    )
    replaceRecipe(event, { output: 'minecraft:leather_helmet' },
        () => event.shaped('minecraft:leather_helmet', [
            'AAA',
            'A A'
        ], {
            A: '#utopia:leathers'
        })
    )
    replaceRecipe(event, { output: 'minecraft:leather_leggings' },
        () => event.shaped('minecraft:leather_leggings', [
            'AAA',
            'A A',
            'A A'
        ], {
            A: '#utopia:leathers'
        })
    )
    replaceRecipe(event, { input: 'minecraft:blue_orchid', type: 'minecraft:crafting_shapeless'},
        () => event.shapeless('minecraft:blue_dye', ['minecraft:blue_orchid']).group('light_blue_dye')
    )
    replaceRecipe(event, { output: 'minecraft:smoker' },
        () => event.shaped('minecraft:smoker', [
            'ABA',
            'B B',
            'ABA'
        ], {
            A: '#minecraft:logs',
            B: ['#minecraft:stone_tool_materials', 'minecraft:packed_mud', 'minecraft:bricks']
        })
    )
 
    // musketmod: misc
    replaceRecipe(event, { output: 'musketmod:blunderbuss' },
        () => event.shaped('musketmod:blunderbuss', [
            'ABC',
            'DBC'
        ], {
            A: 'minecraft:gold_ingot',
            B: 'musketmod:musket',
            C: '#utopia:twine',
            D: 'minecraft:gold_nugget'
        })
    )
    replaceRecipe(event, { output: 'musketmod:cartridge' },
        () => event.shapeless('musketmod:cartridge', [
            '#utopia:metal_beads',
            '#utopia:metal_beads',
            'minecraft:gunpowder',
            'minecraft:paper'
        ])
    )
    replaceRecipe(event, { output: 'musketmod:musket' },
        () => event.shaped('musketmod:musket', [
            'AA ',
            'BCD'
        ], {
            A: '#utopia:bolts',
            B: 'minecraft:iron_ingot',
            C: 'musketmod:pistol',
            D: '#minecraft:planks'
        })
    )
    replaceRecipe(event, { output: 'musketmod:pistol' },
        () => event.shaped('musketmod:pistol', [
            'ABC',
            'DE '
        ], {
            A: 'minecraft:flint_and_steel',
            B: 'minecraft:iron_ingot',
            C: 'minecraft:iron_nugget',
            D: 'minecraft:stick',
            E: 'minecraft:lever'
        })
    )
 
    replaceRecipe(event, { type: 'create:crushing' },
        () => event.recipes.create.crushing([
            'oreganized:raw_asbestos',
            CreateItem.of('oreganized:raw_asbestos', 0.75),
            CreateItem.of('create:experience_nugget', 0.75),
            CreateItem.of('minecraft:cobblestone', 0.125)
        ], 'oreganized:asbestos_ore').processingTime(350)
    )
    replaceRecipe(event, { type: 'create:crushing' },
        () => event.recipes.create.crushing([
            'oreganized:raw_asbestos',
            CreateItem.of('oreganized:raw_asbestos', 0.75),
            CreateItem.of('create:experience_nugget', 0.75),
            CreateItem.of('minecraft:cobbled_deepslate', 0.125)
        ], 'oreganized:deepslate_asbestos_ore').processingTime(350)
    )
 
    // royalvariations: misc
    replaceRecipe(event, { output: 'royalvariations:royal_knight_boots' },
        () => event.smithing(
            'royalvariations:royal_knight_boots',               // output
            'royalvariations:royal_upgrade_smithing_template',  // template
            'minecraft:chainmail_boots',                        // base
            'royalvariations:royal_armor_fragments'             // addition
        )
    )
    replaceRecipe(event, { output: 'royalvariations:royal_knight_cuirass' },
        () => event.smithing(
            'royalvariations:royal_knight_cuirass',             // output
            'royalvariations:royal_upgrade_smithing_template',  // template
            'minecraft:chainmail_chestplate',                   // base
            'royalvariations:royal_armor_fragments'             // addition
        )
    )
    replaceRecipe(event, { output: 'royalvariations:royal_knight_helmet' },
        () => event.smithing(
            'royalvariations:royal_knight_helmet',              // output
            'royalvariations:royal_upgrade_smithing_template',  // template
            'minecraft:chainmail_helmet',                       // base
            'royalvariations:royal_armor_fragments'             // addition
        )
    )
    replaceRecipe(event, { output: 'royalvariations:royal_knight_leggings' },
        () => event.smithing(
            'royalvariations:royal_knight_leggings',            // output
            'royalvariations:royal_upgrade_smithing_template',  // template
            'minecraft:chainmail_leggings',                     // base
            'royalvariations:royal_armor_fragments'             // addition
        )
    )
    replaceRecipe(event, { output: 'royalvariations:royal_telelocator' },
        () => event.shaped('royalvariations:royal_telelocator', [
            'ABA',
            'ACA',
            'DED'
        ], {
            A: '#c:ingots/gold',
            B: 'royalvariations:royal_ender_pearl',
            C: 'minecraft:compass',
            D: '#c:nuggets/gold',
            E: 'royalvariations:royal_bone'
        })
    )
    replaceRecipe(event, { output: 'royalvariations:royal_upgrade_smithing_template' },
        () => event.shaped('royalvariations:royal_upgrade_smithing_template', [
            'ABA',
            'ACA',
            'ABA'
        ], {
            A: '#c:ingots/iron',
            B: 'minecraft:red_wool',
            C: ['royalvariations:spiritual_crown', 'minecraft:enchanted_golden_apple']
        })
    )
 
    replaceRecipe(event, { id: 'supplementaries:bellows' },
        () => event.shaped('supplementaries:bellows', [
            'AAA',
            'B B',
            'AAA'
        ], {
            A: '#minecraft:wooden_slabs',
            B: 'minecraft:leather'
        })
    )
    replaceRecipe(event, { id: 'supplementaries:fire_pit' },
        () => event.shaped('supplementaries:fire_pit', [
            'ABA',
            'AAA'
        ], {
            A: '#c:ingots/copper',
            B: 'supplementaries:lumisene_bottle'
        })
    )
    replaceRecipe(event, { id: 'supplementaries:flute' },
        () => event.shaped('supplementaries:flute', [
            ' A ',
            ' A ',
            ' A '
        ], {
            A: 'minecraft:bamboo'
        })
    )
})