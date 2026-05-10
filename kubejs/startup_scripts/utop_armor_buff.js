ItemEvents.modification(event => {

    // Gold Durability Buffs
    event.modify('minecraft:trident', item => {
        item.maxDamage = 325
    })
    event.modify('minecraft:golden_sword', item => {
        item.maxDamage = 225
    })
    event.modify('minecraft:golden_axe', item => {
        item.maxDamage = 225
    })
    event.modify('minecraft:golden_pickaxe', item => {
        item.maxDamage = 225
    })
    event.modify('minecraft:golden_shovel', item => {
        item.maxDamage = 225
    })
    event.modify('minecraft:golden_hoe', item => {
        item.maxDamage = 225
    })
    event.modify('minecraft:golden_helmet', item => {
        item.maxDamage = 152
    })
    event.modify('minecraft:golden_chestplate', item => {
        item.maxDamage = 220
    })
    event.modify('minecraft:golden_leggings', item => {
        item.maxDamage = 206
    })
    event.modify('minecraft:golden_boots', item => {
        item.maxDamage = 179
    })


    // head | chest | legs | feet
    //
    //.withModifierAdded("generic.armor",{
    //        amount: 6,
    //        id: "minecraft:armor.chestplate",
    //        operation: "add_value"},
    //    "head")

    // .withModifierAdded("generic.armor_toughness",{
    //        amount: 1,
    //        id: "minecraft:armor.chestplate",
    //        operation: "add_value"},
    //    "head")

    //.withModifierAdded( "generic.knockback_resistance",{
    //        amount: 0,
    //        id: "minecraft:armor.chestplate",
    //        operation: "add_value"},
    //    "head")


    // Make Chainmail defend like Iron
    // (Yes, this a stupid workaround. No, I don't know why the removed the intented way to literally just this) -PBK
    event.modify('minecraft:chainmail_chestplate', item => {

        let modifiedAttributeModifier = Item.of(item.item().id).attributeModifiers .withModifierAdded("generic.armor",{
            amount: 6,id: "minecraft:armor.chestplate",operation: "add_value"},
            "chest"
        )
        item.setAttributeModifiersWithTooltip(modifiedAttributeModifier.modifiers())
    })
    event.modify('minecraft:chainmail_leggings', item => {

        let modifiedAttributeModifier = Item.of(item.item().id).attributeModifiers .withModifierAdded("generic.armor",{
            amount: 5,id: "minecraft:armor.leggings",operation: "add_value"},
            "legs"
        )
        item.setAttributeModifiersWithTooltip(modifiedAttributeModifier.modifiers())
    })
    event.modify('minecraft:chainmail_boots', item => {

        let modifiedAttributeModifier = Item.of(item.item().id).attributeModifiers .withModifierAdded("generic.armor",{
            amount: 2,id: "minecraft:armor.boots",operation: "add_value"},
            "feet"
        )
        item.setAttributeModifiersWithTooltip(modifiedAttributeModifier.modifiers())
    })

    // Give iron a little tiny bit of toughness.
    // ‘any’, 'mainhand', ‘offhand’, ‘hand’, feet', ‘legs’, ‘chest’, ‘head', ‘armor’, ‘body'
    event.modify('minecraft:iron_helmet', item => {

        let modifiedAttributeModifier = Item.of(item.item().id).attributeModifiers
        .withModifierAdded("generic.armor_toughness",{
            amount: 1,
            id: "minecraft:armor.head",
            operation: "add_value"},
            "head")
        item.setAttributeModifiersWithTooltip(modifiedAttributeModifier.modifiers())
    })
    event.modify('minecraft:iron_chestplate', item => {

        let modifiedAttributeModifier = Item.of(item.item().id).attributeModifiers
         .withModifierAdded("generic.armor_toughness",{
                amount: 1,
                id: "minecraft:armor.chestplate",
                operation: "add_value"},
            "chest")
        item.setAttributeModifiersWithTooltip(modifiedAttributeModifier.modifiers())
    })
    event.modify('minecraft:iron_leggings', item => {

        let modifiedAttributeModifier = Item.of(item.item().id).attributeModifiers
        .withModifierAdded("generic.armor_toughness",{
            amount: 1,
            id: "minecraft:armor.leggings",
            operation: "add_value"},
            "legs")
        item.setAttributeModifiersWithTooltip(modifiedAttributeModifier.modifiers())
    })
    event.modify('minecraft:iron_boots', item => {

        let modifiedAttributeModifier = Item.of(item.item().id).attributeModifiers
        .withModifierAdded("generic.armor_toughness",{
            amount: 1,
            id: "minecraft:armor.boots",
            operation: "add_value"},
            "feet")
        item.setAttributeModifiersWithTooltip(modifiedAttributeModifier.modifiers())
    })

    // Netherite armor defense bumped up.
    // ‘any’, 'mainhand', ‘offhand’, ‘hand’, feet', ‘legs’, ‘chest’, ‘head', ‘armor’, ‘body'
    event.modify('minecraft:netherite_helmet', item => {

        let modifiedAttributeModifier = Item.of(item.item().id).attributeModifiers
        .withModifierAdded("generic.armor",{
            amount: 4,
            id: "minecraft:armor.head",
            operation: "add_value"},
            "head")
        item.setAttributeModifiersWithTooltip(modifiedAttributeModifier.modifiers())
    })
    event.modify('minecraft:netherite_chestplate', item => {
        let modifiedAttributeModifier = Item.of(item.item().id).attributeModifiers
        .withModifierAdded("generic.armor",{
            amount: 9.5,
            id: "minecraft:armor.chestplate",
            operation: "add_value"},
            "chest")
        item.setAttributeModifiersWithTooltip(modifiedAttributeModifier.modifiers())
    })
    event.modify('minecraft:netherite_leggings', item => {
        let modifiedAttributeModifier = Item.of(item.item().id).attributeModifiers
        .withModifierAdded("generic.armor",{
            amount: 7,
            id: "minecraft:armor.leggings",
            operation: "add_value"},
            "legs")
        item.setAttributeModifiersWithTooltip(modifiedAttributeModifier.modifiers())
    })
    event.modify('minecraft:netherite_boots', item => {
        let modifiedAttributeModifier = Item.of(item.item().id).attributeModifiers
        .withModifierAdded("generic.armor",{
                amount: 4,
                id: "minecraft:armor.boots",
                operation: "add_value"},
            "feet")
        item.setAttributeModifiersWithTooltip(modifiedAttributeModifier.modifiers())
    })

})



