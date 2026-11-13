// ===================== TRADES =====================
//
// One format for every trade:
//
//   { level, group, in1, in2?, trade, uses? }
//
//   level   - villager level 1-5
//   group   - "unlimited" | "shipment" | "singleton" | "legendary"  (sets villager XP, see XP_BY_GROUP)
//               unlimited - infinitely producible via farming or crops (no metals), 1 XP
//               shipment  - partly infinite, 5 XP
//               singleton - bought only once, or rarely, 10 XP
//               legendary - the rarest trades, bought only once, or never, 50 XP
//   uses    - optional, overrides the group default (see USES_BY_GROUP)
//   in1     - what the player pays. A string like "x11 minecraft:gunpowder"
//             (no "x" count = 1). An ARRAY of strings = alternate payments for the
//             SAME trade (one is picked each time the villager rolls it).
//   in2     - optional second payment, same string format.
//   trade   - what the player receives. Same string format, or:
//               { random: [ ...one of the below... ] }  - picks one each roll
//             Anything extra (enchant, potion, name) uses an object:
//               { item: "x16 minecraft:tipped_arrow", potion: "minecraft:strong_healing" }
//               { item: "minecraft:bow", enchant: "minecraft:power", enchantLevel: 2 }
//               { item: "minecraft:crossbow", name: "§fRocket Launcher", enchant: "...", enchantLevel: 1 }

const COLORS = ["white", "orange", "magenta", "light_blue", "yellow", "lime", "pink", "gray", "light_gray", "cyan", "purple", "blue", "brown", "green", "red", "black"];

const BOOKS = [
    "minecraft:protection", "minecraft:fire_protection", "minecraft:feather_falling", "minecraft:blast_protection",
    "minecraft:projectile_protection", "minecraft:respiration", "minecraft:aqua_affinity", "minecraft:thorns",
    "minecraft:depth_strider", "minecraft:frost_walker", "minecraft:sharpness", "minecraft:smite",
    "minecraft:bane_of_arthropods", "minecraft:knockback", "minecraft:fire_aspect", "minecraft:looting",
    "minecraft:sweeping_edge", "minecraft:efficiency", "minecraft:silk_touch", "minecraft:unbreaking",
    "minecraft:fortune", "minecraft:power", "minecraft:punch", "minecraft:flame", "minecraft:infinity",
    "minecraft:luck_of_the_sea", "minecraft:lure", "minecraft:loyalty", "minecraft:impaling", "minecraft:riptide",
    "minecraft:channeling", "minecraft:multishot", "minecraft:quick_charge", "minecraft:piercing", "minecraft:mending",
];

const XP_BY_GROUP = { unlimited: 1, shipment: 5, singleton: 10, legendary: 50 };
const USES_BY_GROUP = { unlimited: 20, shipment: 12, singleton: 3, legendary: 1 };

const TRADES = {
    farmer: [
        { level: 1, group: "unlimited", in1: ["x2 minecraft:hay_block", "x2 supplementaries:flax_block"], trade: "x2 minecraft:emerald" },
        { level: 1, group: "unlimited", in1: ["x2 farmersdelight:potato_crate", "x2 farmersdelight:straw_bale"], trade: "minecraft:emerald" },

        { level: 2, group: "unlimited", in1: ["x4 farmersdelight:carrot_crate", "x4 farmersdelight:tomato_crate"], trade: "x6 minecraft:emerald" },
        { level: 2, group: "unlimited", in1: ["x4 quark:berry_sack", "x4 quark:apple_crate"], trade: "x4 minecraft:emerald" },
        { level: 2, group: "unlimited", in1: "x3 quark:glowberry_sack", trade: "x4 minecraft:emerald" },
        { level: 2, group: "unlimited", in1: "x6 minecraft:cactus", trade: "x4 minecraft:emerald" },

        { level: 3, group: "unlimited", in1: ["x16 quark:sugar_cane_block", "x16 quark:cocoa_beans_sack"], trade: "x28 minecraft:emerald" },
        { level: 3, group: "unlimited", in1: ["x16 minecraft:melon", "x16 minecraft:pumpkin"], trade: "x8 minecraft:emerald" },

        { level: 4, group: "unlimited", in1: ["x22 farmersdelight:rice_bag", "x22 supplementaries:sugar_cube", "x22 quark:nether_wart_sack"], trade: "x42 minecraft:emerald" },
        { level: 4, group: "unlimited", in1: ["x20 farmersdelight:cabbage_crate", "x20 farmersdelight:onion_crate"], trade: "x30 minecraft:emerald" },

        // Golden crates contain gold (a metal), so these are only partly infinite
        { level: 5, group: "shipment", in1: "x1 quark:golden_apple_crate", trade: "x2 utopia:ruby" },
        { level: 5, group: "shipment", in1: ["x30 quark:chorus_fruit_block", "quark:golden_apple_crate", "x9 quark:golden_carrot_crate"], trade: "x32 minecraft:emerald" },
        {
            level: 5, group: "legendary", in1: "minecraft:diamond_hoe", in2: "x5 utopia:ruby",
            trade: {
                random: [
                    { item: "minecraft:diamond_hoe", enchant: "nova_structures:photosynthesis" },
                    { item: "oreganized:electrum_hoe", enchant: "nova_structures:photosynthesis" },
                ],
            },
        },
    ],

    fletcher: [
        { level: 1, group: "shipment", in1: "minecraft:emerald", trade: "x10 minecraft:arrow" },
        { level: 1, group: "shipment", in1: "x16 minecraft:arrow", in2: "minecraft:emerald", trade: "x16 quark:torch_arrow" },

        { level: 2, group: "shipment", in1: "x5 minecraft:emerald", trade: "minecraft:bow" },
        { level: 2, group: "shipment", in1: "x32 quark:torch_arrow", trade: "x3 minecraft:emerald" },
        {
            level: 2, group: "shipment", in1: "x32 minecraft:arrow", in2: "x6 minecraft:emerald",
            trade: {
                random: [
                    { item: "x32 minecraft:tipped_arrow", potion: "minecraft:strong_harming" },
                    { item: "x32 minecraft:tipped_arrow", potion: "minecraft:strong_poison" },
                    { item: "x32 minecraft:tipped_arrow", potion: "minecraft:long_weakness" },
                    { item: "x32 minecraft:tipped_arrow", potion: "minecraft:strong_slowness" },
                    { item: "x32 minecraft:tipped_arrow", potion: "minecraft:strong_healing" },
                    { item: "x32 minecraft:tipped_arrow", potion: "oreganized:long_stunning" },
                ],
            },
        },
        { level: 2, group: "shipment", in1: "x5 minecraft:emerald", trade: "musketmod:cartridge" },
        { level: 2, group: "shipment", in1: "x13 minecraft:emerald", trade: "minecraft:crossbow" },

        { level: 3, group: "shipment", in1: "x58 minecraft:emerald", trade: "x20 musketmod:cartridge" },
        {
            level: 3, group: "shipment", in1: "x5 minecraft:emerald",
            trade: {
                random: [
                    { item: "minecraft:bow", enchant: "minecraft:power", enchantLevel: 1 },
                    { item: "minecraft:bow", enchant: "minecraft:power", enchantLevel: 2 },
                    { item: "minecraft:bow", enchant: "minecraft:power", enchantLevel: 3 },
                    { item: "minecraft:bow", enchant: "minecraft:power", enchantLevel: 4 },
                ],
            },
        },

        { level: 4, group: "singleton", in1: "x35 minecraft:emerald", trade: "supplementaries:cannon" },
        { level: 4, group: "shipment", in1: "x40 minecraft:emerald", trade: "x5 minecraft:potent_sulfur" },
        { level: 4, group: "shipment", in1: "x30 minecraft:emerald", trade: "x4 supplementaries:cannonball" },

        { level: 5, group: "shipment", in1: "x4 supplementaries:bomb", in2: "x10 minecraft:emerald", trade: "supplementaries:bomb_blue" },
        { level: 5, group: "shipment", in1: "x8 minecraft:emerald", in2: "x2 royalvariations:spiritual_crown_shard", trade: "royalvariations:royal_gunpowder" },
        {
            level: 5, group: "legendary", in1: "minecraft:crossbow", in2: "x3 utopia:ruby",
            trade: { item: "minecraft:crossbow", name: "§fRocket Launcher", enchant: "nova_structures:ghasted", enchantLevel: 1 },
        },
    ],

    cleric: [
        {
            level: 1, group: "singleton", in1: "x16 minecraft:emerald", in2: "x1 minecraft:ender_pearl",
            trade: {
                item: "utopia:recall_potion",
                components: 'custom_data={name:"Capital: ???",dim:"utopia:capital",x:-76.5d,y:36.0d,z:-68.5d}',
            },
        },
        { level: 1, group: "unlimited", in1: "x4 minecraft:rotten_flesh", trade: "minecraft:emerald" },
        { level: 1, group: "unlimited", in1: "x2 minecraft:leather", trade: "minecraft:emerald" },
        { level: 1, group: "shipment", in1: "minecraft:gold_ingot", trade: "minecraft:emerald" },


        { level: 2, group: "shipment", in1: "minecraft:emerald", trade: "x4 minecraft:redstone" },
        { level: 2, group: "shipment", in1: "x3 minecraft:redstone_block", trade: "x4 minecraft:emerald" },
        { level: 2, group: "shipment", in1: "minecraft:emerald", trade: "minecraft:lapis_lazuli" },

        { level: 3, group: "shipment", in1: "x8 minecraft:emerald", trade: "minecraft:rabbit_foot" },
        { level: 3, group: "shipment", in1: "x4 minecraft:emerald", trade: "minecraft:glowstone" },

        { level: 4, group: "shipment", in1: "x30 minecraft:emerald", trade: "minecraft:turtle_scute" },
        { level: 4, group: "unlimited", in1: "x16 minecraft:glass_bottle", trade: "x3 minecraft:emerald" },
        { level: 4, group: "unlimited", in1: "x16 utopia:beaker", trade: "x10 minecraft:emerald" },
        { level: 4, group: "shipment", in1: "x6 minecraft:emerald", trade: "minecraft:ender_pearl" },

        { level: 5, group: "unlimited", in1: "x20 quark:nether_wart_sack", trade: "x38 minecraft:emerald" },
        { level: 5, group: "singleton", in1: "x2 minecraft:diamond", trade: "utopia:ruby" },
        { level: 5, group: "singleton", in1: "x1 create:experience_block", in2: "x32 minecraft:emerald", trade: "x1 create_enchantment_industry:super_experience_block" },
    ],
    weaponsmith: [
        {
            level: 1, group: "singleton", in1: "x16 minecraft:emerald", in2: "x1 minecraft:ender_pearl",
            trade: {
                item: "utopia:recall_potion",
                components: 'custom_data={name:"Capital: ???",dim:"utopia:capital",x:-76.5d,y:36.0d,z:-68.5d}',
            },
        },
    ],
};

// ===================== VILLAGER_TRADES (pure wiring) =====================

const VILLAGER_TRADES = {
    // "minecraft:armorer": TRADES.armorer,
    // "etched:bard": TRADES.bard,
    // "minecraft:butcher": TRADES.butcher,
    // "minecraft:cartographer": TRADES.cartographer,
    "minecraft:cleric": TRADES.cleric,
    "minecraft:farmer": TRADES.farmer,
    // "minecraft:fisherman": TRADES.fisherman,
    "minecraft:fletcher": TRADES.fletcher,
    // "minecraft:leatherworker": TRADES.leatherworker,
    // "minecraft:librarian": TRADES.librarian,
    // "minecraft:mason": TRADES.mason,
    // "minecraft:shepherd": TRADES.shepherd,
    // "minecraft:toolsmith": TRADES.toolsmith,
    "minecraft:weaponsmith": TRADES.weaponsmith,
};

// ===================== ENGINE (shouldn't need edits) =====================

// "x11 minecraft:gunpowder" or { item: "x11 minecraft:gunpowder", enchant... }
// -> { item: "minecraft:gunpowder", count: 11, ...extras }
function parseItem(entry) {
    const extras = typeof entry === "string" ? { item: entry } : entry;
    const match = extras.item.match(/^(?:x(\d+) )?(.+)$/);
    return Object.assign({}, extras, { item: match[2], count: Number(match[1] || 1) });
}

function buildItemStack(entry) {
    const { item, count, potion, enchant, enchantLevel, name, components } = parseItem(entry);
    const comps = [potion && `potion_contents={potion:"${potion}"}`, components].filter(Boolean).join(",");
    let stack = Item.of(comps ? `${item}[${comps}]` : item, count);
    if (enchant) stack = stack.enchant(enchant, enchantLevel || 1);
    if (name) stack = stack.withCustomName(name);
    return stack;
}

function pick(list, random) {
    return list[random.nextInt(list.length)];
}

// Picks a random entry if the side has { random: [...] }, otherwise builds it directly.
function resolveSide(side, random) {
    return buildItemStack(side.random ? pick(side.random, random) : side);
}

// ONE listing per row. in1 alternates are chosen inside the callback, so a villager's
// two trades are always two different rows, never two versions of the same trade.
function registerProfession(event, profession, rows) {
    rows.forEach(row => {
        event.addCustomTrade(profession, row.level, (offer, entity, random) => {
            const in1 = Array.isArray(row.in1) ? pick(row.in1, random) : row.in1;
            offer.firstCost = resolveSide(in1, random);
            if (row.in2) offer.secondCost = resolveSide(row.in2, random);
            offer.output = resolveSide(row.trade, random);
            offer.maxUses = row.uses || USES_BY_GROUP[row.group];
            offer.villagerExperience = XP_BY_GROUP[row.group];
        });
    });
}

// ===================== AUTOMATED ITEM TAGGING =====================

function entriesOf(side) {
    return [].concat(side.random || side);
}

// Every item that touches a trade gets tagged, from the player's perspective:
//   utopia:trade_<profession>_buy_<level>_<group>   - what the player RECEIVES (trade)
//   utopia:trade_<profession>_sell_<level>_<group>  - what the player PAYS (in1 incl. alternates, in2)
// Plus two catch-alls: utopia:trade_buy_all and utopia:trade_sell_all.
ServerEvents.tags("item", event => {
    Object.keys(TRADES).forEach(profession => {
        TRADES[profession].forEach(({ level, group, in1, in2, trade }) => {
            [["sell", [in1, in2]], ["buy", [trade]]].forEach(([side, parts]) => {
                parts.filter(Boolean).forEach(part => {
                    entriesOf(part)
                        .map(entry => parseItem(entry).item)
                        .filter(id => !["minecraft:emerald", "utopia:ruby"].includes(id))
                        .forEach(id => {
                            event.add(`utopia:trade_${profession}_${side}_${level}_${group}`, id);
                            event.add(`utopia:trade_${side}_all`, id);
                        });
                });
            });
        });
    });
});

// ===================== REGISTER =====================

function professionId(profession) {
    const raw = String(typeof profession.name === "function" ? profession.name() : profession.name);
    return raw.includes(":") ? raw : `minecraft:${raw}`;
}

MoreJS.villagerTrades(event => {
    const configuredProfessions = Object.keys(VILLAGER_TRADES);

    configuredProfessions.forEach(profession => {
        event.removeVanillaTypedTrades(profession);
        registerProfession(event, profession, VILLAGER_TRADES[profession]);
    });

    const allProfessions = VillagerUtils.getProfessions().map(professionId);
    const unaffected = allProfessions.filter(id => !configuredProfessions.includes(id));

    console.log(`[trades.js] Custom trades registered for: ${configuredProfessions.join(", ")}`);
    console.log(`[trades.js] Still running vanilla trades (unaffected): ${unaffected.length ? unaffected.join(", ") : "none"}`);
});