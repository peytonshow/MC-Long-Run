ServerEvents.recipes(event => {
    event.replaceInput( {
            input: 'minecraft:diamond',
            not: [
                { output: 'minecraft:enchanting_table' },
                { output: 'minecraft:diamond_block' },
                { type: 'minecraft:smithing_trim' }
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
    event.replaceOutput
    event.replaceInput({
            output: 'create:crushed_raw_gold',
            type: 'create:crushing'
        },
        'minecraft:sand',
        'utopia:silica_dust'
    );
});