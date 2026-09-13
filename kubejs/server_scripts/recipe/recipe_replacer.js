ServerEvents.recipes(event => {
    event.replaceInput( {
            input: 'minecraft:diamond',
            not: [
                { output: 'starcatcher:shiny_hook' },
                { output: 'minecraft:enchanting_table' },
                { output: 'minecraft:diamond_block' },
                { input: '#utopia:rare_templates' },
                { input: '#minecraft:trim_templates' },
                { input: '#c:tools' }
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
});