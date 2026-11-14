


ItemEvents.modification(event => {

    const dur = [
        // Scribe
        { item: 'oreganized:scribe', durability: 1250 },

        // Hoez
        { item: 'minecraft:wooden_hoe', durability: 14 },
        { item: 'minecraft:stone_hoe', durability: 38 },
        { item: 'minecraft:golden_hoe', durability: 168 },
        { item: 'minecraft:iron_hoe', durability: 200 },

        // Misc
        { item: 'minecraft:trident', durability: 325 },
        { item: 'minecraft:flint_and_steel', durability: 12 },

        // Gold durability buffs
        { item: 'minecraft:golden_spear', durability: 45 },
        { item: 'minecraft:golden_sword', durability: 150 },
        { item: 'minecraft:golden_axe', durability: 170 },
        { item: 'minecraft:golden_pickaxe', durability: 170 },
        { item: 'minecraft:golden_shovel', durability: 170 },
        { item: 'minecraft:golden_helmet', durability: 142 },
        { item: 'minecraft:golden_chestplate', durability: 200 },
        { item: 'minecraft:golden_leggings', durability: 196 },
        { item: 'minecraft:golden_boots', durability: 169 },

        // Early tools (wood)
        { item: 'minecraft:wooden_spear', durability: 85 },
        { item: 'minecraft:wooden_sword', durability: 86 },
        { item: 'minecraft:wooden_axe', durability: 92 },
        { item: 'minecraft:wooden_pickaxe', durability: 88 },
        { item: 'minecraft:wooden_shovel', durability: 90 },

        // Early tools (stone)
        { item: 'minecraft:stone_spear', durability: 85 },
        { item: 'minecraft:stone_sword', durability: 86 },
        { item: 'minecraft:stone_axe', durability: 92 },
        { item: 'minecraft:stone_pickaxe', durability: 88 },
        { item: 'minecraft:stone_shovel', durability: 90 },

        // Iron buff
        { item: 'minecraft:iron_spear', durability: 750 },
        { item: 'minecraft:iron_sword', durability: 750 },
        { item: 'minecraft:iron_axe', durability: 750 },
        { item: 'minecraft:iron_pickaxe', durability: 750 },
        { item: 'minecraft:iron_shovel', durability: 750 },

        // Netherite
        { item: 'minecraft:netherite_spear', durability: 3000 },
        { item: 'minecraft:netherite_sword', durability: 3000 },
        { item: 'minecraft:netherite_axe', durability: 3000 },
        { item: 'minecraft:netherite_pickaxe', durability: 3000 },
        { item: 'minecraft:netherite_shovel', durability: 3000 },
    ];

    for (let entry of dur) {
        event.modify(entry.item, item => {
            item.maxDamage = entry.durability
        })
    }

})
