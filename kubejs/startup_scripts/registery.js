StartupEvents.registry("armor_material", (event) => {
    event.create('crown')
    .defense({
        helmet: 4
    })
    .enchantmentValue(0)
    .equipSound('minecraft:item.armor.equip_netherite')
    .toughness(4)
    .knockbackResistance(0.3);

    event.create('shattered_crown')
    .defense({
        helmet: 1
    })
    .enchantmentValue(0)
    .equipSound('minecraft:item.armor.equip_iron')
    .toughness(1)
    .knockbackResistance(0.1);
});

StartupEvents.registry('item', event => {
    event.create('utopia:incomplete_netherite_helmet', 'create:sequenced_assembly').displayName('Incomplete Netherite Helmet').texture('utopia:item/incomplete_netherite_helmet')
    event.create('utopia:incomplete_netherite_chestplate', 'create:sequenced_assembly').displayName('Incomplete Netherite Cuirass').texture('utopia:item/incomplete_netherite_chestplate')
    event.create('utopia:incomplete_netherite_leggings', 'create:sequenced_assembly').displayName('Incomplete Netherite Leggings').texture('utopia:item/incomplete_netherite_leggings')
    event.create('utopia:incomplete_netherite_boots', 'create:sequenced_assembly').displayName('Incomplete Netherite Boots').texture('utopia:item/incomplete_netherite_boots')
    event.create('utopia:overworld_upgrade_template').displayName('Manufactured Template').texture('utopia:item/overworld_upgrade_template')

    // Society
    event.create('utopia:crown', 'helmet').displayName('Royal Crown').texture('utopia:item/crown').tooltip("§7Whoever owns this Crown rules the Realm").rarity('epic').material('kubejs:crown')
    event.create('utopia:shattering_crown', 'helmet').displayName('Shattered Crown').texture('utopia:item/shattering_crown').tooltip("§7From another time.").material('kubejs:shattered_crown').maxDamage(5000)

    event.create('utopia:encoder_stamp').displayName('Royal Encoder Stamp').texture('utopia:item/encoder_stamp').tooltip("§7Used to mint official RSD Currency").rarity('rare')
    event.create('utopia:decoder_stamp').displayName('Royal Decoder Stamp').texture('utopia:item/decoder_stamp').tooltip("§7Used to turn RSD Currency back into material").rarity('epic')



    event.create('utopia:bills_netherite').displayName('Netherite Bill').texture('utopia:item/bills_netherite').tooltip("§7R$D 100 - 1/8 Netherite").rarity('rare')
    event.create('utopia:bills_netherite_slip').displayName('Netherite Slip').texture('utopia:item/bills_netherite_fractional').tooltip("§7R$D 50 - 1/16 Netherite").rarity('rare')

    event.create('utopia:coin_diamond').displayName('Diamond Coin').texture('utopia:item/coin_diamond').tooltip("§7R$D 20 - 1/8 Diamond").rarity('uncommon')
    event.create('utopia:coin_diamond_fractional').displayName('Diamond Fractional').texture('utopia:item/coin_diamond_fractional').tooltip("§7R$D 10 - 1/16 Diamond").rarity('uncommon')

    event.create('utopia:coin_iron').displayName('Iron Coin').texture('utopia:item/coin_iron').tooltip("§7R$D 2 - 1/8 Iron")
    event.create('utopia:coin_iron_fractional').displayName('Iron Fractional').texture('utopia:item/coin_iron_fractional').tooltip("§7R$D 1 - 1/16 Iron")

})


