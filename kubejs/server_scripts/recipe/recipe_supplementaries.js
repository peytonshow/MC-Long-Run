function replaceRecipe(event, filter, ...adders) {
    [].concat(filter).forEach(f => event.remove(f))
    adders.forEach(add => add())
}


ServerEvents.recipes(event => {
    event.campfireCooking('supplementaries:ash', '#minecraft:planks').cookingTime(30)
    event.smelting('supplementaries:ash', '#minecraft:planks').cookingTime(20)


    event.shaped('supplementaries:bomb', [
        ' AB',
        'ACA',
        ' A '
    ], {
        A: ['#c:glass_blocks', '#c:bricks'],
        B: '#c:strings',
        C: 'minecraft:tnt'
    }).group('bomb')

    replaceRecipe(event, { output: 'supplementaries:jar' },
        () => event.shaped(Item.of('supplementaries:jar'), [
            'A  ',
            'B  ',
            '   '
        ], {
            A: '#minecraft:wooden_slabs',
            B: 'utopia:beaker'
    }))
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


    event.shaped('supplementaries:quiver', [
        ' AB',
        'A B',
        ' AC'
    ], {
        A: '#utopia:twine',
        B: '#utopia:leathers',
        C: 'minecraft:bundle'
    })


    event.shapeless(Item.of('supplementaries:soap', 4), [
        'supplementaries:lumisene_bottle',
        'minecraft:seagrass',
        'minecraft:seagrass',
        'minecraft:seagrass',
        'minecraft:seagrass',
    ]).id('utopia:soapmaking_manual_only')
})
