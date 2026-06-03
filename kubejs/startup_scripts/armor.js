ItemEvents.modification(event => {

    const LEATHER_HELMET_ARMOR = 1;
    const LEATHER_CHESTPLATE_ARMOR = 3;
    const LEATHER_LEGGINGS_ARMOR = 2;
    const LEATHER_BOOTS_ARMOR = 1;
    const LEATHER_TOUGHNESS = 0;

    const IRON_HELMET_ARMOR = 2;
    const IRON_CHESTPLATE_ARMOR = 6;
    const IRON_LEGGINGS_ARMOR = 5;
    const IRON_BOOTS_ARMOR = 2;
    const IRON_TOUGHNESS = 1; // 0

    const TURTLE_HELMET_ARMOR = 4; // 2
    const TURTLE_TOUGHNESS = 1; // 0

    const DIAMOND_HELMET_ARMOR = 3;
    const DIAMOND_CHESTPLATE_ARMOR = 8;
    const DIAMOND_LEGGINGS_ARMOR = 6;
    const DIAMOND_BOOTS_ARMOR = 3;
    const DIAMOND_TOUGHNESS = 2;

    const NETHERITE_HELMET_ARMOR = 4; //3
    const NETHERITE_CHESTPLATE_ARMOR = 9.5; //8
    const NETHERITE_LEGGINGS_ARMOR = 7; // 6
    const NETHERITE_BOOTS_ARMOR = 4; //3
    const NETHERITE_TOUGHNESS = 3;

    const CHAINMAIL_HELMET_ARMOR = 2; //2;
    const CHAINMAIL_CHESTPLATE_ARMOR = 5; //5;
    const CHAINMAIL_LEGGINGS_ARMOR = 4; //4;
    const CHAINMAIL_BOOTS_ARMOR = 1; //1;
    const CHAINMAIL_TOUGHNESS = IRON_TOUGHNESS; //0

    const GOLDEN_HELMET_ARMOR = DIAMOND_HELMET_ARMOR; // 2;
    const GOLDEN_CHESTPLATE_ARMOR = DIAMOND_CHESTPLATE_ARMOR;// 5;
    const GOLDEN_LEGGINGS_ARMOR = DIAMOND_LEGGINGS_ARMOR; // 3;
    const GOLDEN_BOOTS_ARMOR = DIAMOND_BOOTS_ARMOR; // 1;
    const GOLDEN_TOUGHNESS = 1; //0;
















    // Durability Values
    const LEATHER_HELMET_DURABILITY = 363; // 55
    const LEATHER_CHESTPLATE_DURABILITY = 528; //80
    const LEATHER_LEGGINGS_DURABILITY = 495;// 75
    const LEATHER_BOOTS_DURABILITY = 429; //65

    const IRON_HELMET_DURABILITY = 165;
    const IRON_CHESTPLATE_DURABILITY = 240;
    const IRON_LEGGINGS_DURABILITY = 225;
    const IRON_BOOTS_DURABILITY = 195;

    const TURTLE_HELMET_DURABILITY = 275;

    const DIAMOND_HELMET_DURABILITY = 363;
    const DIAMOND_CHESTPLATE_DURABILITY = 528;
    const DIAMOND_LEGGINGS_DURABILITY = 495;
    const DIAMOND_BOOTS_DURABILITY = 429;

    const NETHERITE_HELMET_DURABILITY = 407;
    const NETHERITE_CHESTPLATE_DURABILITY = 592;
    const NETHERITE_LEGGINGS_DURABILITY = 555;
    const NETHERITE_BOOTS_DURABILITY = 481;

    const CHAINMAIL_HELMET_DURABILITY = 165;
    const CHAINMAIL_CHESTPLATE_DURABILITY = 240;
    const CHAINMAIL_LEGGINGS_DURABILITY = 225;
    const CHAINMAIL_BOOTS_DURABILITY = 195;

    const GOLDEN_HELMET_DURABILITY = 155; //77
    const GOLDEN_CHESTPLATE_DURABILITY = 220; // 112
    const GOLDEN_LEGGINGS_DURABILITY = 205;// 105
    const GOLDEN_BOOTS_DURABILITY = 185; //91


    // --- Leather armor: Buffed durability a lot ---
    event.modify('minecraft:leather_helmet', item => {
        item.addAttributeModifier('minecraft:generic.armor', { amount: LEATHER_HELMET_ARMOR, id: 'kubejs:utop_leather_head', operation: 'add_value' }, 'head')
        item.addAttributeModifier('minecraft:generic.armor_toughness', { amount: LEATHER_TOUGHNESS, id: 'kubejs:utop_leather_head_t', operation: 'add_value' }, 'head')
        item.maxDamage = LEATHER_HELMET_DURABILITY
    })
    event.modify('minecraft:leather_chestplate', item => {
        item.addAttributeModifier('minecraft:generic.armor', { amount: LEATHER_CHESTPLATE_ARMOR, id: 'kubejs:utop_leather_chest', operation: 'add_value' }, 'chest')
        item.addAttributeModifier('minecraft:generic.armor_toughness', { amount: LEATHER_TOUGHNESS, id: 'kubejs:utop_leather_chest_t', operation: 'add_value' }, 'chest')
        item.maxDamage = LEATHER_CHESTPLATE_DURABILITY
    })
    event.modify('minecraft:leather_leggings', item => {
        item.addAttributeModifier('minecraft:generic.armor', { amount: LEATHER_LEGGINGS_ARMOR, id: 'kubejs:utop_leather_legs', operation: 'add_value' }, 'legs')
        item.addAttributeModifier('minecraft:generic.armor_toughness', { amount: LEATHER_TOUGHNESS, id: 'kubejs:utop_leather_legs_t', operation: 'add_value' }, 'legs')
        item.maxDamage = LEATHER_LEGGINGS_DURABILITY
    })
    event.modify('minecraft:leather_boots', item => {
        item.addAttributeModifier('minecraft:generic.armor', { amount: LEATHER_BOOTS_ARMOR, id: 'kubejs:utop_leather_boots', operation: 'add_value' }, 'feet')
        item.addAttributeModifier('minecraft:generic.armor_toughness', { amount: LEATHER_TOUGHNESS, id: 'kubejs:utop_leather_boots_t', operation: 'add_value' }, 'feet')
        item.maxDamage = LEATHER_BOOTS_DURABILITY
    })

    // --- Chainmail armor: Buffed to match Iron values ---
    event.modify('minecraft:chainmail_helmet', item => {
        item.addAttributeModifier('minecraft:generic.armor', { amount: CHAINMAIL_HELMET_ARMOR, id: 'kubejs:utop_chainmail_head', operation: 'add_value' }, 'head')
        item.addAttributeModifier('minecraft:generic.armor_toughness', { amount: CHAINMAIL_TOUGHNESS, id: 'kubejs:utop_chainmail_head_t', operation: 'add_value' }, 'head')
        item.maxDamage = CHAINMAIL_HELMET_DURABILITY
    })
    event.modify('minecraft:chainmail_chestplate', item => {
        item.addAttributeModifier('minecraft:generic.armor', { amount: CHAINMAIL_CHESTPLATE_ARMOR, id: 'kubejs:utop_chainmail_chest', operation: 'add_value' }, 'chest')
        item.addAttributeModifier('minecraft:generic.armor_toughness', { amount: CHAINMAIL_TOUGHNESS, id: 'kubejs:utop_chainmail_chest_t', operation: 'add_value' }, 'chest')
        item.maxDamage = CHAINMAIL_CHESTPLATE_DURABILITY
    })
    event.modify('minecraft:chainmail_leggings', item => {
        item.addAttributeModifier('minecraft:generic.armor', { amount: CHAINMAIL_LEGGINGS_ARMOR, id: 'kubejs:utop_chainmail_legs', operation: 'add_value' }, 'legs')
        item.addAttributeModifier('minecraft:generic.armor_toughness', { amount: CHAINMAIL_TOUGHNESS, id: 'kubejs:utop_chainmail_legs_t', operation: 'add_value' }, 'legs')
        item.maxDamage = CHAINMAIL_LEGGINGS_DURABILITY
    })
    event.modify('minecraft:chainmail_boots', item => {
        item.addAttributeModifier('minecraft:generic.armor', { amount: CHAINMAIL_BOOTS_ARMOR, id: 'kubejs:utop_chainmail_boots', operation: 'add_value' }, 'feet')
        item.addAttributeModifier('minecraft:generic.armor_toughness', { amount: CHAINMAIL_TOUGHNESS, id: 'kubejs:utop_chainmail_boots_t', operation: 'add_value' }, 'feet')
        item.maxDamage = CHAINMAIL_BOOTS_DURABILITY
    })

    // --- Iron armor: Added +1 Armor Toughness while keeping base armor values ---
    event.modify('minecraft:iron_helmet', item => {
        item.addAttributeModifier('minecraft:generic.armor', { amount: IRON_HELMET_ARMOR, id: 'kubejs:utop_iron_head', operation: 'add_value' }, 'head')
        item.addAttributeModifier('minecraft:generic.armor_toughness', { amount: IRON_TOUGHNESS, id: 'kubejs:utop_iron_head_t', operation: 'add_value' }, 'head')
        item.maxDamage = IRON_HELMET_DURABILITY
    })
    event.modify('minecraft:iron_chestplate', item => {
        item.addAttributeModifier('minecraft:generic.armor', { amount: IRON_CHESTPLATE_ARMOR, id: 'kubejs:utop_iron_chest', operation: 'add_value' }, 'chest')
        item.addAttributeModifier('minecraft:generic.armor_toughness', { amount: IRON_TOUGHNESS, id: 'kubejs:utop_iron_chest_t', operation: 'add_value' }, 'chest')
        item.maxDamage = IRON_CHESTPLATE_DURABILITY
    })
    event.modify('minecraft:iron_leggings', item => {
        item.addAttributeModifier('minecraft:generic.armor', { amount: IRON_LEGGINGS_ARMOR, id: 'kubejs:utop_iron_legs', operation: 'add_value' }, 'legs')
        item.addAttributeModifier('minecraft:generic.armor_toughness', { amount: IRON_TOUGHNESS, id: 'kubejs:utop_iron_legs_t', operation: 'add_value' }, 'legs')
        item.maxDamage = IRON_LEGGINGS_DURABILITY
    })
    event.modify('minecraft:iron_boots', item => {
        item.addAttributeModifier('minecraft:generic.armor', { amount: IRON_BOOTS_ARMOR, id: 'kubejs:utop_iron_boots', operation: 'add_value' }, 'feet')
        item.addAttributeModifier('minecraft:generic.armor_toughness', { amount: IRON_TOUGHNESS, id: 'kubejs:utop_iron_boots_t', operation: 'add_value' }, 'feet')
        item.maxDamage = IRON_BOOTS_DURABILITY
    })


    // --- Royal Armor  ---
    event.modify('royalvariations:royal_knight_helmet', item => {
        item.addAttributeModifier('minecraft:generic.armor', { amount: IRON_HELMET_ARMOR, id: 'kubejs:utop_knight_head', operation: 'add_value' }, 'head')
        item.addAttributeModifier('minecraft:generic.armor_toughness', { amount: IRON_TOUGHNESS, id: 'kubejs:utop_knight_head_t', operation: 'add_value' }, 'head')
        item.maxDamage = NETHERITE_HELMET_DURABILITY
        item.modifyTier(tier => {
            tier.repairIngredient = 'oreganized:silver_ingot';
        });
    })

    event.modify('royalvariations:royal_knight_cuirass', item => {
        item.addAttributeModifier('minecraft:generic.armor', { amount: IRON_CHESTPLATE_ARMOR, id: 'kubejs:utop_knight_chest', operation: 'add_value' }, 'chest')
        item.addAttributeModifier('minecraft:generic.armor_toughness', { amount: IRON_TOUGHNESS, id: 'kubejs:utop_knight_chest_t', operation: 'add_value' }, 'chest')
        item.maxDamage = NETHERITE_CHESTPLATE_DURABILITY
        item.modifyTier(tier => {
            tier.repairIngredient = 'oreganized:silver_ingot';
        });
    })

    event.modify('royalvariations:royal_knight_leggings', item => {
        item.addAttributeModifier('minecraft:generic.armor', { amount: IRON_LEGGINGS_ARMOR, id: 'kubejs:utop_knight_legs', operation: 'add_value' }, 'legs')
        item.addAttributeModifier('minecraft:generic.armor_toughness', { amount: IRON_TOUGHNESS, id: 'kubejs:utop_knight_legs_t', operation: 'add_value' }, 'legs')
        item.maxDamage = NETHERITE_LEGGINGS_DURABILITY
        item.modifyTier(tier => {
            tier.repairIngredient = 'oreganized:silver_ingot';
        });
    })

    event.modify('royalvariations:royal_knight_boots', item => {
        item.addAttributeModifier('minecraft:generic.armor', { amount: IRON_BOOTS_ARMOR, id: 'kubejs:utop_knight_boots', operation: 'add_value' }, 'feet')
        item.addAttributeModifier('minecraft:generic.armor_toughness', { amount: IRON_TOUGHNESS, id: 'kubejs:utop_knight_boots_t', operation: 'add_value' }, 'feet')
        item.maxDamage = NETHERITE_BOOTS_DURABILITY
        item.modifyTier(tier => {
            tier.repairIngredient = 'oreganized:silver_ingot';
        });
    })

    // --- Golden armor: Defense mostly matches diamond, but it's toughness isn't quite the same ---
    event.modify('minecraft:golden_helmet', item => {
        item.addAttributeModifier('minecraft:generic.armor', { amount: GOLDEN_HELMET_ARMOR, id: 'kubejs:utop_golden_head', operation: 'add_value' }, 'head')
        item.addAttributeModifier('minecraft:generic.armor_toughness', { amount: GOLDEN_TOUGHNESS, id: 'kubejs:utop_golden_head_t', operation: 'add_value' }, 'head')
        item.maxDamage = GOLDEN_HELMET_DURABILITY
    })
    event.modify('minecraft:golden_chestplate', item => {
        item.addAttributeModifier('minecraft:generic.armor', { amount: GOLDEN_CHESTPLATE_ARMOR, id: 'kubejs:utop_golden_chest', operation: 'add_value' }, 'chest')
        item.addAttributeModifier('minecraft:generic.armor_toughness', { amount: GOLDEN_TOUGHNESS, id: 'kubejs:utop_golden_chest_t', operation: 'add_value' }, 'chest')
        item.maxDamage = GOLDEN_CHESTPLATE_DURABILITY
    })
    event.modify('minecraft:golden_leggings', item => {
        item.addAttributeModifier('minecraft:generic.armor', { amount: GOLDEN_LEGGINGS_ARMOR, id: 'kubejs:utop_golden_legs', operation: 'add_value' }, 'legs')
        item.addAttributeModifier('minecraft:generic.armor_toughness', { amount: GOLDEN_TOUGHNESS, id: 'kubejs:utop_golden_legs_t', operation: 'add_value' }, 'legs')
        item.maxDamage = GOLDEN_LEGGINGS_DURABILITY
    })
    event.modify('minecraft:golden_boots', item => {
        item.addAttributeModifier('minecraft:generic.armor', { amount: GOLDEN_BOOTS_ARMOR, id: 'kubejs:utop_golden_boots', operation: 'add_value' }, 'feet')
        item.addAttributeModifier('minecraft:generic.armor_toughness', { amount: GOLDEN_TOUGHNESS, id: 'kubejs:utop_golden_boots_t', operation: 'add_value' }, 'feet')
        item.maxDamage = GOLDEN_BOOTS_DURABILITY
    })

    // --- Netherite armor: Updated to be just a lil stronger to comp for the speed loss  ---
    event.modify('minecraft:netherite_helmet', item => {
        item.addAttributeModifier('minecraft:generic.armor', { amount: NETHERITE_HELMET_ARMOR, id: 'kubejs:utop_netherite_head', operation: 'add_value' }, 'head')
        item.addAttributeModifier('minecraft:generic.armor_toughness', { amount: NETHERITE_TOUGHNESS, id: 'kubejs:utop_netherite_head_t', operation: 'add_value' }, 'head')
        item.maxDamage = NETHERITE_HELMET_DURABILITY
    })
    event.modify('minecraft:netherite_chestplate', item => {
        item.addAttributeModifier('minecraft:generic.armor', { amount: NETHERITE_CHESTPLATE_ARMOR, id: 'kubejs:utop_netherite_chest', operation: 'add_value' }, 'chest')
        item.addAttributeModifier('minecraft:generic.armor_toughness', { amount: NETHERITE_TOUGHNESS, id: 'kubejs:utop_netherite_chest_t', operation: 'add_value' }, 'chest')
        item.maxDamage = NETHERITE_CHESTPLATE_DURABILITY
    })
    event.modify('minecraft:netherite_leggings', item => {
        item.addAttributeModifier('minecraft:generic.armor', { amount: NETHERITE_LEGGINGS_ARMOR, id: 'kubejs:utop_netherite_legs', operation: 'add_value' }, 'legs')
        item.addAttributeModifier('minecraft:generic.armor_toughness', { amount: NETHERITE_TOUGHNESS, id: 'kubejs:utop_netherite_legs_t', operation: 'add_value' }, 'legs')
        item.maxDamage = NETHERITE_LEGGINGS_DURABILITY
    })
    event.modify('minecraft:netherite_boots', item => {
        item.addAttributeModifier('minecraft:generic.armor', { amount: NETHERITE_BOOTS_ARMOR, id: 'kubejs:utop_netherite_boots', operation: 'add_value' }, 'feet')
        item.addAttributeModifier('minecraft:generic.armor_toughness', { amount: NETHERITE_TOUGHNESS, id: 'kubejs:utop_netherite_boots_t', operation: 'add_value' }, 'feet')
        item.maxDamage = NETHERITE_BOOTS_DURABILITY
    })
})

