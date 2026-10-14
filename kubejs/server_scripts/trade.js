// ===================== TRADES =====================
//
// One format for every trade:
//
//   { level, group, in1, in2?, trade }
//
//   level   - villager level 1-5
//   group   - "strong" | "weak" | "legendary"  (sets villager XP, see XP_BY_GROUP)
//   in1     - what the player pays. A string like "x11 minecraft:gunpowder"
//             (no "x" count = 1). An ARRAY of strings makes one alternate
//             trade per entry, all with the same output.
//   in2     - optional second payment, same string format.
//   trade   - what the player receives. Same string format, or:
//               { random: [ ...one of the below... ] }  - picks one each roll
//             Anything extra (enchant, potion, name) uses an object:
//               { item: "x16 minecraft:tipped_arrow", potion: "minecraft:strong_healing" }
//               { item: "minecraft:bow", enchant: "minecraft:power", enchantLevel: 2 }
//               { item: "minecraft:crossbow", name: "§fRocket Launcher", enchant: "...", enchantLevel: 1 }
//   uses    - optional, max uses (default 12)

const XP_BY_GROUP = { weak: 5, strong: 10, legendary: 50 };

const TRADES = {
    farmer: [
        { level: 1, group: "strong", in1: ["x2 minecraft:hay_block", "x2 supplementaries:flax_block"], trade: "x2 minecraft:emerald" },
        { level: 1, group: "weak", in1: ["x2 farmersdelight:potato_crate", "x2 farmersdelight:straw_bale"], trade: "minecraft:emerald" },

        { level: 2, group: "strong", in1: ["x4 farmersdelight:carrot_crate", "x4 farmersdelight:tomato_crate"], trade: "x6 minecraft:emerald" },
        { level: 2, group: "weak", in1: ["x4 quark:berry_sack", "x4 quark:apple_crate"], trade: "x4 minecraft:emerald" },
        { level: 2, group: "weak", in1: "x3 quark:glowberry_sack", trade: "x4 minecraft:emerald" },
        { level: 2, group: "weak", in1: "x6 minecraft:cactus", trade: "x4 minecraft:emerald" },

        { level: 3, group: "strong", in1: ["x16 quark:sugar_cane_block", "x16 quark:cocoa_beans_sack"], trade: "x28 minecraft:emerald" },
        { level: 3, group: "weak", in1: ["x16 minecraft:melon", "x16 minecraft:pumpkin"], trade: "x8 minecraft:emerald" },

        { level: 4, group: "strong", in1: ["x22 farmersdelight:rice_bag", "x22 supplementaries:sugar_cube", "x22 quark:nether_wart_sack"], trade: "x42 minecraft:emerald" },
        { level: 4, group: "weak", in1: ["x20 farmersdelight:cabbage_crate", "x20 farmersdelight:onion_crate"], trade: "x30 minecraft:emerald" },

        { level: 5, group: "strong", in1: "x2 quark:golden_apple_crate", trade: "x3 utopia:ruby" },
        { level: 5, group: "weak", in1: ["x30 quark:chorus_fruit_block", "quark:golden_apple_crate", "x9 quark:golden_carrot_crate"], trade: "x32 minecraft:emerald" },
        {
            level: 5, group: "legendary", in1: "x40 minecraft:emerald", in2: "x1 utopia:ruby",
            trade: {
                random: [
                    { item: "minecraft:diamond_hoe", enchant: "nova_structures:photosynthesis" },
                    { item: "oreganized:electrum_hoe", enchant: "nova_structures:photosynthesis" },
                ],
            },
        },
    ],

    fletcher: [
        { level: 1, group: "weak", in1: "minecraft:emerald", trade: "x10 minecraft:arrow" },
        { level: 1, group: "strong", in1: "x16 minecraft:arrow", in2: "minecraft:emerald", trade: "x16 quark:torch_arrow" },

        { level: 2, group: "weak", in1: "x5 minecraft:emerald", trade: "minecraft:bow" },
        { level: 2, group: "strong", in1: "x32 quark:torch_arrow", trade: "x3 minecraft:emerald" },
        {
            level: 2, group: "strong", in1: "x32 minecraft:arrow", in2: "x6 minecraft:emerald",
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
        { level: 2, group: "weak", in1: "x5 minecraft:emerald", trade: "musketmod:cartridge" },
        { level: 2, group: "weak", in1: "x13 minecraft:emerald", trade: "minecraft:crossbow" },

        { level: 3, group: "strong", in1: "x58 minecraft:emerald", trade: "x20 musketmod:cartridge" },
        {
            level: 3, group: "weak", in1: "x5 minecraft:emerald",
            trade: {
                random: [
                    { item: "minecraft:bow", enchant: "minecraft:power", enchantLevel: 1 },
                    { item: "minecraft:bow", enchant: "minecraft:power", enchantLevel: 2 },
                    { item: "minecraft:bow", enchant: "minecraft:power", enchantLevel: 3 },
                    { item: "minecraft:bow", enchant: "minecraft:power", enchantLevel: 4 },
                ],
            },
        },

        { level: 4, group: "strong", in1: "x35 minecraft:emerald", trade: "supplementaries:cannon" },
        { level: 4, group: "strong", in1: "x40 minecraft:emerald", trade: "x5 minecraft:potent_sulfur" },
        { level: 4, group: "weak", in1: "x30 minecraft:emerald", trade: "x4 supplementaries:cannonball" },

        { level: 5, group: "strong", in1: "x4 supplementaries:bomb", in2: "x10 minecraft:emerald", trade: "supplementaries:bomb_blue" },
        { level: 5, group: "weak", in1: "x8 minecraft:emerald", in2: "x2 royalvariations:spiritual_crown_shard", trade: "royalvariations:royal_gunpowder" },
        {
            level: 5, group: "legendary", in1: "x30 minecraft:emerald",
            trade: { item: "minecraft:crossbow", name: "§fRocket Launcher", enchant: "nova_structures:ghasted", enchantLevel: 1 },
        },
    ],
};

// ===================== Build POOLS: profession -> level -> group -> rows =====================

function buildPools(trades) {
    const pools = {};

    Object.keys(trades).forEach(profession => {
        trades[profession].forEach(({ level, group, in1, in2, trade, uses }) => {
            [].concat(in1).forEach(alt => {
                pools[profession] ??= {};
                pools[profession][level] ??= {};
                pools[profession][level][group] ??= [];
                pools[profession][level][group].push({ in1: alt, in2, trade, uses, xp: XP_BY_GROUP[group] });
            });
        });
    });

    return pools;
}

const POOLS = buildPools(TRADES);

// ===================== VILLAGER_TRADES (pure wiring) =====================

const VILLAGER_TRADES = {
    "minecraft:farmer": POOLS.farmer,
    "minecraft:fletcher": POOLS.fletcher,
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
    const { item, count, potion, enchant, enchantLevel, name } = parseItem(entry);
    let stack = Item.of(potion ? `${item}[potion_contents={potion:"${potion}"}]` : item, count);
    if (enchant) stack = stack.enchant(enchant, enchantLevel || 1);
    if (name) stack = stack.withCustomName(name);
    return stack;
}

// Picks a random entry if the side has { random: [...] }, otherwise builds it directly.
function resolveSide(side, random) {
    return buildItemStack(side.random ? side.random[random.nextInt(side.random.length)] : side);
}

function registerProfession(event, profession, pools) {
    Object.keys(pools).forEach(level => {
        Object.keys(pools[level]).forEach(groupName => {
            pools[level][groupName].forEach(({ in1, in2, trade, uses, xp }) => {
                event.addCustomTrade(profession, Number(level), (offer, entity, random) => {
                    offer.firstCost = resolveSide(in1, random);
                    if (in2) offer.secondCost = resolveSide(in2, random);
                    offer.output = resolveSide(trade, random);
                    offer.maxUses = uses || 12;
                    offer.villagerExperience = xp;
                });
            });
        });
    });
}

// ===================== AUTOMATED ITEM TAGGING =====================

// Tags only cover what the player RECEIVES (trade). Payments (in1 / in2) stay untagged.
ServerEvents.tags("item", event => {
    Object.keys(POOLS).forEach(profession => {
        Object.keys(POOLS[profession]).forEach(level => {
            Object.keys(POOLS[profession][level]).forEach(groupName => {
                const tagName = `utopia:trade_${profession}_buy_${level}_${groupName}`;

                POOLS[profession][level][groupName].forEach(({ trade }) => {
                    (trade.random || [trade]).forEach(entry => event.add(tagName, parseItem(entry).item));
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