// ===================== TRADES =====================
//
// One format for every trade:
//
//   { level, group, in1, in2?, trade, uses? }
//
//   level   - villager level 1-5
//   group   - "mass" | "shipment" | "singleton" | "legendary"  (sets villager XP, see XP_BY_GROUP)
//               mass - trades you can make many times
//               shipment  - larger trades,
//               singleton - bought only once, or rarely, 10 XP
//               legendary - the rarest trades, bought only once, or never, 50 XP
//   uses    - optional, overrides the group default (see USES_BY_GROUP)
//   in1     - what the player pays. A string like "x11 minecraft:gunpowder"
//             (no "x" count = 1). An ARRAY of strings = alternate payments for the
//             SAME trade (one is picked each time the villager rolls it).
//   in2     - optional second payment, same string format.
//   trade   - what the player receives. Same string format, or:
//               { random: [ ...one of the below... ] }  - picks one each roll
//             Anything extra (enchants, potion, name) uses an object:
//               { item: "x16 minecraft:tipped_arrow", potion: "minecraft:strong_healing" }
//               { item: "minecraft:bow", enchants: { "minecraft:power": 2 } }
//               { item: "minecraft:crossbow", name: "§fRocket Launcher", enchants: { "...": 1 } }
//               { item: "minecraft:fishing_rod", enchants: { "minecraft:luck_of_the_sea": 3, "minecraft:lure": 3 } }  - several at once
//             Enchanted books (always max level): book("minecraft:fortune"), or book() for a random non-treasure enchant, treasureBook() for a random treasure one
//             Quark ancient tomes (always max level for the enchant):
//               tome("minecraft:fortune")  - that enchant
//               tome()                     - random from Quark's Valid Enchantments, rerolled per roll
//               { ...tome("minecraft:mending"), item: "x2 quark:ancient_tome" }  - more than one

const COLORS = ["white", "orange", "magenta", "light_blue", "yellow", "lime", "pink", "gray", "light_gray", "cyan", "purple", "blue", "brown", "green", "red", "black"];

// Enchant lists come straight from the registry, split by the TREASURE_TAG enchantment tag (modded enchants
// that tag themselves as treasure are respected). Registry-backed, so they are functions that only work at
// runtime (inside the trade callback), never while TRADES is being built.
const TREASURE_TAG = "minecraft:treasure";
const TREASURE_ENCHANTS = () => enchantsWhere(true);  // ids of every treasure enchant
const BOOKS = () => enchantsWhere(false);             // ids of every NON-treasure enchant

// book("minecraft:mending") -> max-level book of exactly that enchant (treasure allowed when named)
// book()                    -> random from BOOKS(), never treasure, rerolled per trade
// treasureBook()            -> random from TREASURE_ENCHANTS(), rerolled per trade
function book(id) {
    return { item: "minecraft:enchanted_book", book: id || "random" };
}
function treasureBook() {
    return book("random_treasure");
}
// tome("minecraft:fortune") -> max-level fortune tome
// tome()                    -> random from Quark's own Valid Enchantments list, rerolled per trade
function tome(id) {
    return { item: "quark:ancient_tome", tome: id || "random" };
}

const XP_BY_GROUP = { mass: 1, shipment: 4, singleton: 7, legendary: 50 };
const USES_BY_GROUP = { mass: 18, shipment: 8, singleton: 3, legendary: 1 };

const TRADES = {
    farmer: [
        { level: 1, group: "mass", in1: ["x2 minecraft:hay_block", "x2 supplementaries:flax_block"], trade: "x2 minecraft:emerald" },
        { level: 1, group: "mass", in1: ["x2 farmersdelight:potato_crate", "x2 farmersdelight:straw_bale"], trade: "minecraft:emerald" },

        { level: 2, group: "mass", in1: ["x4 farmersdelight:carrot_crate", "x4 farmersdelight:tomato_crate"], trade: "x6 minecraft:emerald" },
        { level: 2, group: "mass", in1: ["x4 quark:berry_sack", "x4 quark:apple_crate"], trade: "x4 minecraft:emerald" },
        { level: 2, group: "mass", in1: "x3 quark:glowberry_sack", trade: "x4 minecraft:emerald" },
        { level: 2, group: "mass", in1: "x6 minecraft:cactus", trade: "x4 minecraft:emerald" },

        { level: 3, group: "mass", in1: ["x16 quark:sugar_cane_block", "x16 quark:cocoa_beans_sack"], trade: "x28 minecraft:emerald" },
        { level: 3, group: "mass", in1: ["x16 minecraft:melon", "x16 minecraft:pumpkin"], trade: "x8 minecraft:emerald" },

        { level: 4, group: "mass", in1: ["x22 farmersdelight:rice_bag", "x22 supplementaries:sugar_cube"], trade: "x42 minecraft:emerald" },
        { level: 4, group: "mass", in1: ["x20 farmersdelight:cabbage_crate", "x20 farmersdelight:onion_crate"], trade: "x30 minecraft:emerald" },

        // Golden crates contain gold (a metal), so these are only partly infinite
        { level: 5, group: "singleton", in1: "x1 quark:golden_apple_crate", trade: "x2 utopia:ruby" },
        { level: 5, group: "singleton", in1: "x4 quark:golden_carrot_crate", trade: "x12 minecraft:emerald_block" },
        { level: 5, group: "singleton", in1: "x20 quark:chorus_fruit_block", trade: "x32 minecraft:emerald" },
        {
            level: 5, group: "legendary", in1: "minecraft:diamond_hoe", in2: "x5 utopia:ruby",
            trade: {
                random: [
                    { item: "minecraft:diamond_hoe", enchants: { "nova_structures:photosynthesis": 1 } },
                    { item: "oreganized:electrum_hoe", enchants: { "nova_structures:photosynthesis": 1 } },
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
        { level: 2, group: "shipment", in1: "x8 minecraft:emerald", trade: "musketmod:cartridge" },
        { level: 2, group: "shipment", in1: "x13 minecraft:emerald", trade: "minecraft:crossbow" },

        { level: 3, group: "shipment", in1: "x21 minecraft:emerald", trade: "x3 musketmod:cartridge" }, // 58 -> 20 for weaponsmiths
        {
            level: 3, group: "shipment", in1: "x5 minecraft:emerald",
            trade: {
                random: [1, 2, 3, 4].map(level => ({ item: "minecraft:bow", enchants: { "minecraft:power": level } })),
            },
        },

        { level: 4, group: "singleton", in1: "x35 minecraft:emerald", trade: "supplementaries:cannon" },
        { level: 4, group: "shipment", in1: "x40 minecraft:emerald", trade: "x5 minecraft:potent_sulfur" },
        { level: 4, group: "shipment", in1: "x30 minecraft:emerald", trade: "x4 supplementaries:cannonball" },

        { level: 5, group: "shipment", in1: "x4 supplementaries:bomb", in2: "x10 minecraft:emerald", trade: "supplementaries:bomb_blue" },
        { level: 5, group: "shipment", in1: "x8 minecraft:emerald", in2: "x2 royalvariations:spiritual_crown_shard", trade: "royalvariations:royal_gunpowder" },
        {
            level: 5, group: "legendary", in1: "minecraft:crossbow", in2: "x4 utopia:ruby",
            trade: { item: "minecraft:crossbow", name: "§fRocket Launcher", enchants: { "nova_structures:ghasted": 1 } },
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
        { level: 1, group: "mass", in1: "x4 minecraft:rotten_flesh", trade: "minecraft:emerald" },
        { level: 1, group: "mass", in1: "x2 minecraft:leather", trade: "minecraft:emerald" },


        { level: 2, group: "singleton", in1: "x8 minecraft:gold_ingot", trade: "x28 minecraft:emerald" },
        { level: 2, group: "shipment", in1: "x4 minecraft:emerald", trade: "x16 minecraft:redstone" },
        { level: 2, group: "shipment", in1: "x3 minecraft:redstone_block", trade: "x4 minecraft:emerald" },
        { level: 2, group: "shipment", in1: "x2 minecraft:glistering_melon_slice", trade: "x5 minecraft:emerald"},

        { level: 3, group: "shipment", in1: "x8 minecraft:emerald", trade: "x8 minecraft:lapis_lazuli" },
        { level: 3, group: "shipment", in1: "x10 minecraft:emerald", trade: "minecraft:rabbit_foot" },
        { level: 3, group: "shipment", in1: "x6 minecraft:emerald", trade: "minecraft:glowstone" },
        { level: 3, group: "shipment", in1: "x30 minecraft:emerald", trade: "minecraft:turtle_scute" },
        {
            level: 3, group: "shipment", in1: "x15 minecraft:emerald",
            trade: {
                random: [
                    { item: "minecraft:potion",  potion: "minecraft:strong_harming" },
                    { item: "minecraft:potion",  potion: "minecraft:strong_healing" },
                ],
            },
        },

        { level: 4, group: "mass", in1: "x16 minecraft:glass_bottle", trade: "x3 minecraft:emerald" },
        { level: 4, group: "shipment", in1: "x32 utopia:beaker", trade: "x20 minecraft:emerald" },
        { level: 4, group: "shipment", in1: "x36 minecraft:emerald", trade: "x6 minecraft:ender_pearl" },

        { level: 5, group: "shipment", in1: "x8 quark:nether_wart_sack", trade: "x20 minecraft:emerald" },
        { level: 5, group: "singleton", in1: "x5 minecraft:diamond", trade: "utopia:ruby" },
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

    fisherman: [
        { level: 1, group: "shipment", in1: "minecraft:emerald", trade: "x5 minecraft:string" },
        { level: 1, group: "mass", in1: "x10 #minecraft:coals", trade: "minecraft:emerald" },
        { level: 1, group: "mass", in1: "minecraft:emerald", in2: "x6 minecraft:cod", trade: "x6 minecraft:cooked_cod" },
        { level: 1, group: "shipment", in1: "minecraft:emerald",
            trade: { random: ["oak", "spruce", "birch", "jungle", "acacia", "dark_oak", "mangrove", "cherry", "pale_oak", "poplar"].map(w => `minecraft:${w}_boat`) },
        },

        { level: 2, group: "mass", in1: "x5 minecraft:cod", trade: "minecraft:emerald" },
        { level: 2, group: "shipment", in1: "minecraft:emerald", in2: "x6 minecraft:salmon", trade: "x6 minecraft:cooked_salmon" },
        { level: 2, group: "singleton", in1: "x3 minecraft:emerald", trade: "minecraft:campfire" },


        { level: 3, group: "singleton", in1: "x35 minecraft:salmon", trade: "x12 minecraft:emerald" },
        { level: 3, group: "singleton", in1: "x3 minecraft:emerald", trade: { random: ["minecraft:cod_bucket", "minecraft:bucket"] } },

        { level: 4, group: "mass", in1: "x1 minecraft:tropical_fish", trade: "x3 minecraft:emerald" },

        { level: 5, group: "mass", in1: "x12 minecraft:pufferfish", trade: "x20 minecraft:emerald" },
        { level: 5, group: "legendary", in1: "x3 utopia:ruby",
            trade: { item: "minecraft:fishing_rod", name: "§fKingfisher", enchants: { "minecraft:luck_of_the_sea": 3, "minecraft:lure": 3 } },
        },
        { level: 5, group: "legendary", in1: "x3 utopia:ruby",  trade: tome("minecraft:luck_of_the_sea") },
    ],

    cartographer: [
        { level: 1, group: "mass", in1: "x12 minecraft:paper", trade: "minecraft:emerald" },
        { level: 1, group: "mass", in1: "x5 minecraft:emerald", trade: "minecraft:map" },

        { level: 2, group: "shipment", in1: "x5 #c:glass_blocks/cheap", trade: "minecraft:emerald" },
        { level: 2, group: "singleton", in1: "x12 minecraft:emerald",
            trade: {
                random: [
                    ["plains", 0x8DB360], ["sunflower_plains", 0xB5DB88], ["forest", 0x4F8F3A],
                    ["flower_forest", 0xD98BC4], ["birch_forest", 0x88BB67], ["dark_forest", 0x2F5E2A],
                    ["old_growth_birch_forest", 0x6FA85A], ["old_growth_pine_taiga", 0x4C7A5B],
                    ["old_growth_spruce_taiga", 0x3F6B4F], ["taiga", 0x5B8F6B], ["snowy_taiga", 0x9CC3B5],
                    ["savanna", 0xBDB25F], ["savanna_plateau", 0xA89F4F], ["windswept_savanna", 0xCFC477],
                    ["jungle", 0x2FB52F], ["sparse_jungle", 0x5FC85F], ["bamboo_jungle", 0x7FD05A],
                    ["desert", 0xE3C27A], ["badlands", 0xD94515], ["eroded_badlands", 0xE86A2E],
                    ["wooded_badlands", 0xB5562A], ["swamp", 0x4C6A4B], ["mangrove_swamp", 0x6B4F3A],
                    ["meadow", 0x7BD18A], ["cherry_grove", 0xFFB7C5], ["grove", 0xC9E4E0],
                    ["snowy_slopes", 0xE8F4F8], ["frozen_peaks", 0xBFE3F0], ["jagged_peaks", 0xD8E6EE],
                    ["stony_peaks", 0x9A9A9A], ["snowy_plains", 0xF2FAFF], ["ice_spikes", 0x9AD8F0],
                    ["windswept_hills", 0x8A9A8A], ["windswept_forest", 0x6F8F7A], ["windswept_gravelly_hills", 0xA0A0A0],
                    ["mushroom_fields", 0xB070B0], ["beach", 0xF0E4A8], ["snowy_beach", 0xE6EEF0],
                    ["stony_shore", 0x8F8F8F], ["river", 0x3F76E4], ["frozen_river", 0xA0C8F0],
                    ["warm_ocean", 0x43D5EE], ["lukewarm_ocean", 0x45ADF2], ["deep_lukewarm_ocean", 0x2F8AD0],
                    ["ocean", 0x2F5FD0], ["deep_ocean", 0x1F3F9F], ["cold_ocean", 0x3D57D6],
                    ["deep_cold_ocean", 0x2B3F9F], ["frozen_ocean", 0x7FA0E0], ["deep_frozen_ocean", 0x5F7FC0],
                    ["dripstone_caves", 0xA8794F], ["lush_caves", 0x8FD05F], ["deep_dark", 0x0F3F4F],
                ].map(([biome, rgb]) => ({
                    item: "quark:pathfinders_quill",
                    components: `quark:target_biome="minecraft:${biome}",quark:target_biome_color=${0xFF000000 | rgb}`,
                })),
            },
        },
    ],
};

// ===================== VILLAGER_TRADES (pure wiring) =====================

const VILLAGER_TRADES = {
    // "minecraft:armorer": TRADES.armorer,
    // "etched:bard": TRADES.bard,
    // "minecraft:butcher": TRADES.butcher,
    "minecraft:cartographer": TRADES.cartographer,
    "minecraft:cleric": TRADES.cleric,
    "minecraft:farmer": TRADES.farmer,
    "minecraft:fisherman": TRADES.fisherman,
    "minecraft:fletcher": TRADES.fletcher,
    // "minecraft:leatherworker": TRADES.leatherworker,
    // "minecraft:librarian": TRADES.librarian,
    // "minecraft:mason": TRADES.mason,
    // "minecraft:shepherd": TRADES.shepherd,
    // "minecraft:toolsmith": TRADES.toolsmith,
    //"minecraft:weaponsmith": TRADES.weaponsmith,
};

// ===================== ENGINE (shouldn't need edits) =====================

const Registries = Java.loadClass("net.minecraft.core.registries.Registries");
const TagKey = Java.loadClass("net.minecraft.tags.TagKey");
const ResourceLocation = Java.loadClass("net.minecraft.resources.ResourceLocation");
const AncientTomeItem = Java.loadClass("org.violetmoon.quark.content.tools.item.AncientTomeItem");
const AncientTomesModule = Java.loadClass("org.violetmoon.quark.content.tools.module.AncientTomesModule");
const ServerLifecycleHooks = Java.loadClass("net.neoforged.neoforge.server.ServerLifecycleHooks");

// "x11 minecraft:gunpowder" or { item: "x11 minecraft:gunpowder", enchants... }
// -> { item: "minecraft:gunpowder", count: 11, ...extras }
function parseItem(entry) {
    if (typeof entry !== "string" && (!entry || typeof entry.item !== "string")) {
        throw new Error(`[trades.js] Invalid trade entry (expected string, {item}, or {random}): ${JSON.stringify(entry)}`);
    }
    const extras = typeof entry === "string" ? { item: entry } : entry;
    const match = extras.item.match(/^(?:x(\d+) )?(.+)$/);
    return Object.assign({}, extras, { item: match[2], count: Number(match[1] || 1) });
}

function pick(list, random) {
    return list[random.nextInt(list.length)];
}

// "#minecraft:logs" -> a random item id from that tag. Plain item ids pass through.
function resolveTag(id, random) {
    if (!id.startsWith("#")) return id;
    const ids = Array.from(Ingredient.of(id).itemIds);
    if (!ids.length) throw new Error(`[trades.js] Tag ${id} is empty or doesn't exist`);
    return String(pick(ids, random));
}

function enchantRegistry() {
    return ServerLifecycleHooks.getCurrentServer().registryAccess().registryOrThrow(Registries.ENCHANTMENT);
}

// Registry ids (vanilla and modded) that are, or are not, in the treasure tag.
function enchantsWhere(treasure) {
    const tag = TagKey.create(Registries.ENCHANTMENT, ResourceLocation.parse(TREASURE_TAG));
    return Array.from(enchantRegistry().keySet()).filter(id => enchantRegistry().getHolder(id).orElseThrow().is(tag) === treasure).map(String);
}

function bookStack(id, count, random) {
    const key = id === "random" ? pick(BOOKS(), random) : id === "random_treasure" ? pick(TREASURE_ENCHANTS(), random) : id;
    return Item.of(`minecraft:enchanted_book[stored_enchantments={levels:{"${key}":${enchantRegistry().get(ResourceLocation.parse(key)).getMaxLevel()}}}]`, count);
}

// Quark ancient tome at the enchant's max level. id "random" = pick from Quark's Valid Enchantments.
function tomeStack(id, count, random) {
    const holder = id === "random"
        ? AncientTomesModule.validEnchants.get(random.nextInt(AncientTomesModule.validEnchants.size()))
        : enchantRegistry().getHolder(ResourceLocation.parse(id)).orElseThrow();
    return AncientTomeItem.getEnchantedItemStack(holder).copyWithCount(count);
}

function buildItemStack(entry, random) {
    const { item: rawItem, count, potion, enchants, name, components, tome, book } = parseItem(entry);
    if (tome) return tomeStack(tome, count, random);
    if (book) return bookStack(book, count, random);
    const item = resolveTag(rawItem, random);
    const comps = [potion && `potion_contents={potion:"${potion}"}`, components].filter(Boolean).join(",");
    const enchanted = Object.entries(enchants || {}).reduce((s, [id, level]) => s.enchant(id, level), Item.of(comps ? `${item}[${comps}]` : item, count));
    return name ? enchanted.withCustomName(name) : enchanted;
}

// Picks a random entry if the side has { random: [...] }, otherwise builds it directly.
function resolveSide(side, random) {
    return buildItemStack(side.random ? pick(side.random, random) : side, random);
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
                        .filter(id => !["minecraft:emerald", "minecraft:emerald_block", "utopia:ruby", "utopia:ruby_block"].includes(id))
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
        event.removeModdedTypedTrades(profession);
        registerProfession(event, profession, VILLAGER_TRADES[profession]);
    });

    const allProfessions = VillagerUtils.getProfessions().map(professionId);
    const unaffected = allProfessions.filter(id => !configuredProfessions.includes(id));

    console.log(`[trades.js] Custom trades registered for: ${configuredProfessions.join(", ")}`);
    console.log(`[trades.js] Still running vanilla trades (unaffected): ${unaffected.length ? unaffected.join(", ") : "none"}`);
});


// kubejs/server_scripts/no_villager_discounts.js
// Disables villager discounts. Event-driven only: no tick events, no loops.
//
// Discounts come from villager gossip (curing, trading, raid rewards).
// Vanilla applies them in updateSpecialPrices() when the trade screen opens,
// which runs after NeoForge's EntityInteract event. Clearing the positive
// gossip types at interaction time means that step finds nothing to apply.

const Villager = Java.loadClass('net.minecraft.world.entity.npc.Villager')

ItemEvents.entityInteracted(event => {
  const target = event.target
  if (!(target instanceof Villager)) return

  const gossips = target.getGossips()
  gossips.remove('major_positive') // cured zombie villager
  gossips.remove('minor_positive') // repeated trading / gossip spread
  gossips.remove('trading')        // per-trade reputation
  // Negative gossip is left alone, so hitting villagers still raises prices.
})