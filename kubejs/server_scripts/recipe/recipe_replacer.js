ServerEvents.recipes(event => {
    event.replaceInput( {
            input: 'minecraft:diamond',
            not: [
                { output: 'starcatcher:shiny_hook' },
                { output: 'minecraft:enchanting_table' },
                { output: 'minecraft:diamond_block' },
                { input: '#utopia:rare_templates' },
                { input: '#minecraft:trim_templates' },
                { input: '#c:tools' },
                { mod: 'storagedrawers'}
            ]
        },
        'minecraft:diamond',   // What to replace
        '#utopia:diamonds'     // What to replace it with
    );
    event.replaceInput({
            output: 'oreganized:scribe',
            type: 'minecraft:crafting_shaped'
        },
        'minecraft:amethyst_shard',
        'utopia:moissanite'
    );
    event.replaceInput({
            output: 'minecraft:glass',
            input: 'minecraft:sand'
        },
        'minecraft:sand',
        'utopia:silica_dust'
    );
    event.replaceInput({
            output: 'create:crushed_raw_gold',
            type: 'create:crushing'
        },
        'minecraft:sand',
        'utopia:silica_dust'
    );
    event.replaceInput({
            input: 'supplementaries:soap',
            not: [
                { output: 'supplementaries:soap_block' }
            ]
        },
        'supplementaries:soap',
        Ingredient.of(['supplementaries:soap', 'utopia:beaker_bleach'])
    );

    event.replaceInput(
        [
            {output: 'farmersdelight:wooden_basket'},
            {output: 'farmersdelight:bamboo_basket'}
        ], //filter
        'farmersdelight:canvas',
        Ingredient.of(['farmersdelight:canvas', 'create:cardboard'])
    )
    const doors = {
        'minecraft:oak_door': 'minecraft:oak_planks',
        'minecraft:spruce_door': 'minecraft:spruce_planks',
        'minecraft:birch_door': 'minecraft:birch_planks',
        'minecraft:jungle_door': 'minecraft:jungle_planks',
        'minecraft:acacia_door': 'minecraft:acacia_planks',
        'minecraft:dark_oak_door': 'minecraft:dark_oak_planks',
        'minecraft:mangrove_door': 'minecraft:mangrove_planks',
        'minecraft:cherry_door': 'minecraft:cherry_planks',
        'minecraft:bamboo_door': 'minecraft:bamboo_planks',
        'minecraft:crimson_door': 'minecraft:crimson_planks',
        'minecraft:warped_door': 'minecraft:warped_planks',
        'minecraft:pale_oak_door': 'minecraft:pale_oak_planks',
        'minecraft:iron_door': 'minecraft:iron_ingot',
        'minecraft:copper_door': 'minecraft:copper_ingot',
        'supplementaries:gold_door': 'minecraft:gold_ingot',
    }

    // Remove only shaped recipes for the doors listed in the 'doors' object
    event.remove({ output: Object.keys(doors), type: 'minecraft:crafting_shaped' })

    Object.keys(doors).forEach(door => {
        event.shaped(
            Item.of(door, 1),
            [
                'AA',
                'AA',
                'AA'
            ],
            { A: doors[door] }
        )
    })
})