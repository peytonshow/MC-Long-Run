// ===================== POOLS (compact trade definitions) =====================
//
// Pools are keyed by villager LEVEL (1-5), then by group name:
//   strong    - the "main" trade(s) for that level
//   weak      - a cheaper/alternate trade for that level
//   legendary - a rare bonus trade (farmer level 5 only)
//
// Each level's groups are mutually exclusive picks: the engine chooses one
// entry from each group (see registerProfession/ENGINE below), so "strong"
// and "weak" never compete with each other for the same trade slot.
//
// ---- Compact format (covers ~90% of trades) ----
//
//   trade({ level, group, sell, count, buy, buyCount })
//
//   level     - villager level 1-5
//   group     - "strong" | "weak" | "legendary"
//   sell      - one item id, or an array of interchangeable item ids
//               (each becomes its own alternate trade within that group).
//   count     - how many of `sell` the player gives up
//   buy       - the item id the player receives
//   buyCount  - how many of `buy` the player receives
//
// Villager XP is not set per-trade - it's derived automatically from
// `group` (see XP_BY_GROUP below), so every trade in a group always
// awards the same XP.
//
// ---- Everything else (a second cost, a random-enchant/potion pool, etc.) ----
// goes in SPECIAL_TRADES further down as a full row object - those features
// don't compress well and trying to cram them into the tuple would just make
// it harder to read, not shorter.

// XP awarded per trade, purely by which group it's in.
const XP_BY_GROUP = { weak: 5, strong: 10, legendary: 50 };

// Named-field builder for the compact format - reads like "sell X for Y"
// instead of needing to remember which position in an array means what.
function trade({ level, group, sell, count, buy, buyCount }) {
    return [level, group, Array.isArray(sell) ? sell : [sell], count, buy, buyCount];
}

const TRADES = {
    farmer: [
        trade({ level: 1, group: "strong", sell: ["minecraft:hay_block", "supplementaries:flax_block"], count: 2, buy: "minecraft:emerald", buyCount: 2 }),
        trade({ level: 1, group: "weak", sell: ["farmersdelight:potato_crate", "farmersdelight:straw_bale"], count: 2, buy: "minecraft:emerald", buyCount: 1 }),

        trade({ level: 2, group: "strong", sell: ["farmersdelight:carrot_crate", "farmersdelight:tomato_crate"], count: 4, buy: "minecraft:emerald", buyCount: 6 }),
        trade({ level: 2, group: "weak", sell: ["quark:berry_sack", "quark:apple_crate"], count: 4, buy: "minecraft:emerald", buyCount: 4 }),
        trade({ level: 2, group: "weak", sell: "quark:glowberry_sack", count: 3, buy: "minecraft:emerald", buyCount: 4 }),
        trade({ level: 2, group: "weak", sell: "minecraft:cactus", count: 6, buy: "minecraft:emerald", buyCount: 4 }),

        trade({ level: 3, group: "strong", sell: ["quark:sugar_cane_block", "quark:cocoa_beans_sack"], count: 16, buy: "minecraft:emerald", buyCount: 28 }),
        trade({ level: 3, group: "weak", sell: ["minecraft:melon", "minecraft:pumpkin"], count: 16, buy: "minecraft:emerald", buyCount: 8 }),

        trade({ level: 4, group: "strong", sell: ["farmersdelight:rice_bag", "supplementaries:sugar_cube", "quark:nether_wart_sack"], count: 22, buy: "minecraft:emerald", buyCount: 42 }),
        trade({ level: 4, group: "weak", sell: ["farmersdelight:cabbage_crate", "farmersdelight:onion_crate"], count: 20, buy: "minecraft:emerald", buyCount: 30 }),

        trade({ level: 5, group: "strong", sell: "quark:golden_apple_crate", count: 2, buy: "minecraft:emerald", buyCount: 38 }),
        trade({ level: 5, group: "weak", sell: ["quark:chorus_fruit_block", "quark:golden_carrot_crate"], count: 10, buy: "minecraft:emerald", buyCount: 32 }),
    ],

    fletcher: [
        trade({ level: 1, group: "strong", sell: "quark:torch_arrow", count: 12, buy: "minecraft:emerald", buyCount: 3 }),
        trade({ level: 1, group: "weak", sell: "minecraft:emerald", count: 1, buy: "minecraft:arrow", buyCount: 12 }),
        trade({ level: 1, group: "weak", sell: "minecraft:emerald", count: 5, buy: "minecraft:bow", buyCount: 1 }),

        trade({ level: 2, group: "weak", sell: "minecraft:emerald", count: 5, buy: "musketmod:cartridge", buyCount: 1 }),
        trade({ level: 2, group: "weak", sell: "minecraft:emerald", count: 13, buy: "minecraft:crossbow", buyCount: 1 }),

        trade({ level: 3, group: "strong", sell: "minecraft:emerald", count: 58, buy: "musketmod:cartridge", buyCount: 20 }),

        trade({ level: 4, group: "strong", sell: "minecraft:emerald", count: 35, buy: "supplementaries:cannon", buyCount: 1 }),
        trade({ level: 4, group: "strong", sell: "minecraft:emerald", count: 40, buy: "minecraft:potent_sulfur", buyCount: 5 }),
        trade({ level: 4, group: "weak", sell: "minecraft:emerald", count: 30, buy: "supplementaries:cannonball", buyCount: 4 }),
    ],
};

// Trades that need something a tuple can't express: a second cost (sell2),
// or a randomized buy. Anything randomized - enchants, potions, weighted
// alternatives - is picked in plain JS at trade-resolution time via
// `buy: { random: [...] }`, where each entry is a plain item description
// (see ENGINE below for the exact shape).
const SPECIAL_TRADES = {
    farmer: [
        {
            level: 5, group: "legendary",
            row: {
                sell: { item: "minecraft:emerald", count: 40 },
                buy: {
                    random: [
                        { item: "minecraft:diamond_hoe", enchant: "nova_structures:photosynthesis" },
                        { item: "oreganized:electrum_hoe", enchant: "nova_structures:photosynthesis" },
                    ],
                },
            },
        },
    ],

    fletcher: [
        {
            level: 2, group: "strong",
            row: {
                sell: { item: "minecraft:arrow", count: 16 },
                sell2: { item: "minecraft:emerald", count: 1 },
                buy: { item: "quark:torch_arrow", count: 16 },
            },
        },
        {
            level: 2, group: "strong",
            row: {
                sell: { item: "minecraft:arrow", count: 16 },
                sell2: { item: "minecraft:emerald", count: 2 },
                buy: {
                    random: [
                        { item: "minecraft:tipped_arrow", count: 16, potion: "minecraft:strong_harming" },
                        { item: "minecraft:tipped_arrow", count: 16, potion: "minecraft:strong_poison" },
                        { item: "minecraft:tipped_arrow", count: 16, potion: "minecraft:long_weakness" },
                        { item: "minecraft:tipped_arrow", count: 16, potion: "minecraft:strong_slowness" },
                        { item: "minecraft:tipped_arrow", count: 16, potion: "minecraft:strong_healing" },
                        { item: "minecraft:tipped_arrow", count: 16, potion: "oreganized:long_stunning" },
                    ],
                },
            },
        },
        {
            level: 3, group: "weak",
            row: {
                sell: { item: "minecraft:emerald", count: 5 },
                buy: {
                    random: [
                        { item: "minecraft:bow", enchant: "minecraft:power", enchantLevel: 1 },
                        { item: "minecraft:bow", enchant: "minecraft:power", enchantLevel: 2 },
                        { item: "minecraft:bow", enchant: "minecraft:power", enchantLevel: 3 },
                        { item: "minecraft:bow", enchant: "minecraft:power", enchantLevel: 4 },
                    ],
                },
            },
        },
        {
            level: 5, group: "strong",
            row: {
                sell: { item: "supplementaries:bomb", count: 4 },
                sell2: { item: "minecraft:emerald", count: 10 },
                buy: { item: "supplementaries:bomb_blue", count: 1 },
            },
        },
        {
            level: 5, group: "weak",
            row: {
                sell: { item: "minecraft:emerald", count: 8 },
                sell2: { item: "royalvariations:spiritual_crown_shard", count: 2 },
                buy: { item: "royalvariations:royal_gunpowder", count: 1 },
            },
        },
        {
            level: 5, group: "legendary",
            row: {
                sell: { item: "minecraft:emerald", count: 30 },
                buy: {
                    random: [
                        { item: "minecraft:crossbow", name : "§fRocket Launcher", enchant: "nova_structures:ghasted", enchantLevel: 1 },
                    ],
                },
            },
        },
    ],
};

// ===================== Expand compact + special defs into POOLS =====================

function expandTuple([level, group, items, sellCount, buyItem, buyCount]) {
    return items.map(item => ({
        level, group,
        row: {
            sell: { item, count: sellCount },
            buy: { item: buyItem, count: buyCount },
        },
    }));
}

function buildPools(compact, special) {
    const pools = {};

    const addEntry = (profession, { level, group, row }) => {
        row.xp = XP_BY_GROUP[group];
        pools[profession] ??= {};
        pools[profession][level] ??= {};
        pools[profession][level][group] ??= [];
        pools[profession][level][group].push(row);
    };

    Object.keys(compact).forEach(profession => {
        compact[profession].forEach(tuple => {
            expandTuple(tuple).forEach(entry => addEntry(profession, entry));
        });
    });

    Object.keys(special).forEach(profession => {
        special[profession].forEach(entry => addEntry(profession, entry));
    });

    return pools;
}

const POOLS = buildPools(TRADES, SPECIAL_TRADES);

// ===================== VILLAGER_TRADES (pure wiring - no item data) =====================

const VILLAGER_TRADES = {
    "minecraft:farmer": POOLS.farmer,
    "minecraft:fletcher": POOLS.fletcher,
};

// ===================== AUTOMATED ITEM TAGGING =====================

// Tags only cover what the player RECEIVES from the villager (row.buy).
// What the player pays (sell / sell2) is intentionally left untagged.
ServerEvents.tags("item", event => {
    Object.keys(POOLS).forEach(profession => {
        Object.keys(POOLS[profession]).forEach(level => {
            const groups = POOLS[profession][level];

            Object.keys(groups).forEach(groupName => {
                const tagName = `utopia:trade_${profession}_buy_${level}_${groupName}`;

                groups[groupName].forEach(({ buy }) => {
                    const items = buy.random ? buy.random.map(entry => entry.item) : [buy.item];
                    items.forEach(item => event.add(tagName, item));
                });
            });
        });
    });
});

// ===================== ENGINE (shouldn't need edits) =====================

// A "row" is one trade: { sell, sell2?, buy, uses?, xp }.
// sell / sell2 / buy are each a "side" of the trade - either:
//   { item, count?, enchant?, enchantLevel?, potion? } - a plain item,
//                                      optionally enchanted or a potion arrow.
//   { random: [ ...one of the above... ] } - picks one entry at random each
//                                      time the trade is rolled.

// Builds a single ItemStack from a plain (non-random) side entry.
function buildItemStack(entry) {
    const id = entry.potion
        ? `${entry.item}[potion_contents={potion:"${entry.potion}"}]`
        : entry.item;
    let stack = Item.of(id, entry.count || 1);
    if (entry.enchant) stack = stack.enchant(entry.enchant, entry.enchantLevel || 1);
    if (entry.name) stack = stack.withCustomName(entry.name);
    return stack;
}

// Resolves a trade side to an ItemStack: picks a random entry if the side
// has one, otherwise just builds the plain item.
function resolveSide(side, random) {
    if (side.random) {
        const pick = side.random[random.nextInt(side.random.length)];
        return buildItemStack(pick);
    }
    return buildItemStack(side);
}

// Fills in a single MoreJS trade offer from one trade row.
function applyTrade(offer, row, entity, random) {
    offer.firstCost = resolveSide(row.sell, random);           // what the player pays
    if (row.sell2) offer.secondCost = resolveSide(row.sell2, random); // optional 2nd cost
    offer.output = resolveSide(row.buy, random);                // what the player gets
    offer.maxUses = row.uses || 12;
    offer.villagerExperience = row.xp;
}

function registerProfession(event, profession, pools) {
    Object.keys(pools).forEach(level => {
        Object.keys(pools[level]).forEach(groupName => {
            pools[level][groupName].forEach(row => {
                event.addCustomTrade(profession, Number(level), (offer, entity, random) => {
                    applyTrade(offer, row, entity, random);
                });
            });
        });
    });
}

// ===================== REGISTER =====================

MoreJS.villagerTrades(event => {
    const configuredProfessions = Object.keys(VILLAGER_TRADES);

    configuredProfessions.forEach(profession => {
        event.removeVanillaTypedTrades(profession);
        registerProfession(event, profession, VILLAGER_TRADES[profession]);
    });

    // Ask VillagerUtils for every registered villager type (vanilla AND modded)
    // instead of hand-maintaining a list, so newly added professions from other
    // mods are picked up automatically.
    const allProfessions = VillagerUtils.getProfessions().map(profession => profession.name);
    const unaffected = allProfessions.filter(profession => !configuredProfessions.includes(profession));

    console.log(`[trades.js] Custom trades registered for: ${configuredProfessions.join(", ")}`);
    console.log(`[trades.js] Still running vanilla trades (unaffected): ${unaffected.length ? unaffected.join(", ") : "none"}`);
});