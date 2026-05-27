StartupEvents.registry("armor_material", (event) => {
    event
    .create('crown')
    .defense({
        helmet: 2
    })
    .enchantmentValue(0)
    .equipSound('minecraft:item.armor.equip_iron')
    .toughness(2)
    .knockbackResistance(0.0);
});


StartupEvents.registry('item', event => {
    event.create('incomplete_netherite_helmet', 'create:sequenced_assembly').displayName('Incomplete Netherite Helmet').texture('utopia:item/incomplete_netherite_helmet')
    event.create('incomplete_netherite_chestplate', 'create:sequenced_assembly').displayName('Incomplete Netherite Cuirass').texture('utopia:item/incomplete_netherite_chestplate')
    event.create('incomplete_netherite_leggings', 'create:sequenced_assembly').displayName('Incomplete Netherite Leggings').texture('utopia:item/incomplete_netherite_leggings')
    event.create('incomplete_netherite_boots', 'create:sequenced_assembly').displayName('Incomplete Netherite Boots').texture('utopia:item/incomplete_netherite_boots')
    event.create('overworld_upgrade_template').displayName('Manufactured Template').texture('utopia:item/incomplete_netherite_upgrade_template')

    // Royalty
    //
    event.create('utopia:crown', 'helmet').displayName('Royal Crown').texture('utopia:item/crown').tooltip("§7Whoever owns this Crown rules the Realm").rarity('epic').material('kubejs:crown')

    event.create('red_rubber_stamp').displayName('Rubber Stamp').texture('utopia:item/royal_rubber_stamp').tooltip("§7Used to mint official RSD Currency").rarity('rare')
    event.create('currency_red_bills').displayName('Royal Bills').texture('utopia:item/royal_bills').tooltip("Official RSD - $20.0").rarity('uncommon')
    // Fake Currency
    event.create('currency_red_blills').displayName('Royal Bills').texture('utopia:item/royal_bills').tooltip("Offiscal RSD - S20.0")
})


