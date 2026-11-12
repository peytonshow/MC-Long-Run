var SoapBleach = (function () {
    var COLORS = ['white','orange','magenta','light_blue','yellow','lime','pink','gray','light_gray','cyan','purple','blue','brown','green','red','black']

    var UNDYED = {
        shulker_box: 'minecraft:shulker_box',
        candle: 'minecraft:candle',
        terracotta: 'minecraft:terracotta',
        stained_glass: 'minecraft:glass',
        stained_glass_pane: 'minecraft:glass_pane',
        glazed_terracotta: 'minecraft:white_glazed_terracotta',
        wool: 'minecraft:white_wool',
        carpet: 'minecraft:white_carpet',
        bed: 'minecraft:white_bed',
        banner: 'minecraft:white_banner',
        concrete: 'minecraft:white_concrete',
        concrete_powder: 'minecraft:white_concrete_powder'
    }

    // extra items that share an existing category's recipe (same output)
    var EXTRA = {
        stained_glass: ['quark:dirty_glass'],
        stained_glass_pane: ['quark:dirty_glass_pane']
    }

    // input -> bleached output (one recipe each, outputs differ)
    var MISC = {
        'minecraft:leather_helmet': 'minecraft:leather_helmet',
        'minecraft:leather_chestplate': 'minecraft:leather_chestplate',
        'minecraft:leather_leggings': 'minecraft:leather_leggings',
        'minecraft:leather_boots': 'minecraft:leather_boots',
        'minecraft:filled_map': 'minecraft:map',
        'minecraft:sticky_piston': 'minecraft:piston',
        'minecraft:tipped_arrow': 'minecraft:arrow',
        'minecraft:written_book': 'minecraft:writable_book',
        'quark:dirty_shard': 'quark:clear_shard',
        'supplementaries:blackboard': 'supplementaries:blackboard',
        'supplementaries:globe_sepia': 'supplementaries:globe',
        'supplementaries:bamboo_spikes_tipped': 'supplementaries:bamboo_spikes',
    }

    function coloursFor(suffix) {
        return COLORS.filter(function (c) {
            return !(c === 'white' && UNDYED[suffix] === 'minecraft:white_' + suffix)
        })
    }

    function itemsFor(suffix) {
        var items = coloursFor(suffix).map(function (c) { return 'minecraft:' + c + '_' + suffix })
        return items.concat(EXTRA[suffix] || [])
    }

    return { UNDYED: UNDYED, MISC: MISC, itemsFor: itemsFor }
})()


ServerEvents.tags('item', event => {
    Object.keys(SoapBleach.UNDYED).forEach(function (suffix) {
        let items = SoapBleach.itemsFor(suffix)
        event.add('utopia:bleachable/' + suffix, items)
        event.add('utopia:bleachable', items)
    })
    event.add('utopia:bleachable', Object.keys(SoapBleach.MISC))
})


ServerEvents.recipes(event => {
    let made = 0
    let covered = {}

    Object.keys(SoapBleach.UNDYED).forEach(function (suffix) {
        try {
            let tagInput = '#utopia:bleachable/' + suffix
            let outItem = SoapBleach.UNDYED[suffix]

            event.shapeless(outItem, [tagInput, 'utopia:beaker_bleach'])
                .id('utopia:bleaching_' + suffix + '_manual_only')
            event.recipes.create.mixing([Item.of(outItem)], [Ingredient.of(tagInput), Fluid.of('utopia:bleach', 200)])

            SoapBleach.itemsFor(suffix).forEach(function (i) { covered[i] = true })
            made++
        } catch (e) {
            console.error('[ruled-bleach.js] ' + suffix + ': ' + e)
        }
    })

    Object.keys(SoapBleach.MISC).forEach(function (inId) {
        try {
            let outId = SoapBleach.MISC[inId]
            let name = inId.split(':')[1]

            event.shapeless(outId, [inId, 'utopia:beaker_bleach'])
                .id('utopia:bleaching_' + name + '_manual_only')
            event.recipes.create.mixing([Item.of(outId)], [Ingredient.of(inId), Fluid.of('utopia:bleach', 200)])

            covered[inId] = true
            made++
        } catch (e) {
            console.error('[ruled-bleach.js] ' + inId + ': ' + e)
        }
    })

    // report anything tagged bleachable that still has no recipe
    let missing = []
    Ingredient.of('#utopia:bleachable').itemIds.forEach(function (id) {
        if (!covered[String(id)]) missing.push(String(id))
    })
    if (missing.length) console.warn('[ruled-bleach.js] tagged but no recipe: ' + missing.join(', '))

    console.info('[ruled-bleach.js] ' + made + ' bleach recipe groups (item + mixing)')
})