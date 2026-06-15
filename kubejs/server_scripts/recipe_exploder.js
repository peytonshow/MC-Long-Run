ServerEvents.recipes(event => {
    // Removes EVERY recipe that uses this specific type
    event.remove({ type: 'refurbished_furniture:cutting_board_slicing' })
    event.remove({ type: 'refurbished_furniture:cutting_board_combining' })


    event.remove({ input: 'minecraft:gravel', type: 'create:splashing' })
    event.remove({ output: 'oreganized:glance'})

})
