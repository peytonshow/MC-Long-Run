ServerEvents.recipes(event => {
    event.replaceInput(
        {
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
});