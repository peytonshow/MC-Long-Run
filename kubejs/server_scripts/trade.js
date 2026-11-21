// ===================== TRADES =====================

const COLORS = ["white", "orange", "magenta", "light_blue", "yellow", "lime", "pink", "gray", "light_gray", "cyan", "purple", "blue", "brown", "green", "red", "black"];

// Enchant lists come straight from the registry, split by the TREASURE_TAG enchantment tag (modded enchants
// that tag themselves as treasure are respected). Registry-backed, so they are functions that only work at
// runtime (inside the trade callback), never while TRADES is being built.
const TREASURE_TAG = "minecraft:treasure";
const TREASURE_ENCHANTS = () => enchantsWhere(true);  // ids of every treasure enchant
const BOOKS = () => enchantsWhere(false);             // ids of every NON-treasure enchant

// Fraction of an enchant's max level used when a trade doesn't specify a strength.
const DEFAULT_STRENGTH = 0.5;

// book("minecraft:mending", 0.8) -> book of exactly that enchant at 80% of max level, rounded up (treasure allowed when named)
// book()                         -> random from BOOKS(), never treasure, rerolled per trade, strength 0.5
// treasureBook()                 -> random from TREASURE_ENCHANTS(), rerolled per trade
// NOTE: do not pass book straight to .map(); the array index would be read as strength. Use .map(id => book(id)).
function book(id, strength) {
    return { item: "minecraft:enchanted_book", book: id || "random", strength: strength };
}
function treasureBook(strength) {
    return book("random_treasure", strength);
}
// Tomes are ALWAYS max level; strength does not apply to them.
// tome("minecraft:fortune") -> max-level fortune tome
// tome()                    -> random from Quark's own Valid Enchantments list, rerolled per trade
function tome(id) {
    return { item: "quark:ancient_tome", tome: id || "random" };
}

// data
const DYE_RGB = [0xF9FFFE, 0xF9801D, 0xC74EBD, 0x3AB3DA, 0xFED83D, 0x80C71F, 0xF38BAA, 0x474F52, 0x9D9D97, 0x169C9C, 0x8932B8, 0x3C44AA, 0x835432, 0x5E7C16, 0xB02E26, 0x1D1D21];

const STEW_EFFECTS = [["night_vision", 100], ["jump_boost", 160], ["weakness", 140], ["blindness", 120], ["poison", 280], ["saturation", 7]];

const ARROW_POTIONS = [
    "night_vision", "invisibility", "leaping", "fire_resistance", "swiftness", "slowness", "water_breathing",
    "healing", "harming", "poison", "regeneration", "strength", "weakness", "slow_falling", "turtle_master",
];

// ===================== ENCHANT CATEGORIES =====================

// book("minecraft:mending", 0.8) -> exactly that enchant at 80% of max level, rounded up (treasure allowed when named)
// book("sword", 0.75)            -> random enchant from the "sword" category (any ENCHANT_CATEGORIES key, or "all")
// book()                         -> random non-treasure enchant, rerolled per trade
// treasureBook()                 -> random treasure enchant, rerolled per trade
// Default strength is 0.5. Don't pass book straight to .map(); use .map(id => book(id)).

const ENCHANT_CATEGORIES = {
    // if categories that are commented out have no valid unique enchants
    helmet:     ["minecraft:iron_helmet", "minecraft:turtle_helmet"],
     chestplate: ["minecraft:iron_chestplate", "minecraft:elytra"],
    // leggings:   ["minecraft:iron_leggings"],
    boots:      ["minecraft:iron_boots"],
    sword:      ["minecraft:iron_sword"],
    spear:        ["minecraft:iron_spear"],
    tool:       ["minecraft:iron_pickaxe", "minecraft:iron_shovel", "minecraft:iron_hoe", "minecraft:iron_axe"],
    bow:        ["minecraft:bow"],
    crossbow:   ["minecraft:crossbow"],
    trident:    ["minecraft:trident"],
    mace:       ["minecraft:mace"],
    rod:        ["minecraft:fishing_rod"],
    // shears:     ["minecraft:shears"],
    // shield:     ["minecraft:shield"],
    backtank:     ["create:copper_backtank"],
    potato_cannon:     ["create:potato_cannon"],
    knife:      ["farmersdelight:iron_knife"],
};

// Exclusive ownership: each enchant belongs to ONLY the first category in this list that it fits.
// So an enchant like unbreaking shows up in "tool" and nowhere else, sharpness in "sword" only,
// and the mace is left with its own (density, breach, wind burst).
// Order matters: put the category that should win shared enchants first.
// Categories not listed here are checked afterwards, in the order they appear in ENCHANT_CATEGORIES.
// "all" ignores this and still means every non-treasure enchant.
const ENCHANT_PRIORITY = [
    "tool", "sword", "mace", "spear", "trident", "crossbow", "bow", "rod",
    "chestplate", "helmet", "boots", "leggings", "axe", "pickaxe", "shovel", "hoe",
];

// For these categories an enchant must fit EVERY sample item (not just any), so "tool" only owns
// enchants that work on pickaxe, shovel, hoe and axe alike (unbreaking, efficiency, fortune, silk touch).
const ENCHANT_MATCH_ALL = ["tool"];

const XP_BY_GROUP = { mass: 1, shipment: 4, singleton: 6, legendary: 50 };
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
            level: 5, group: "legendary", in1: "minecraft:diamond_hoe", in2: "x7 utopia:ruby",
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
        { level: 1, group: "shipment", in1: "x12 minecraft:emerald", in2: "x6 minecraft:book", trade: book("potato_cannon") },

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
        { level: 2, group: "mass", in1: "x3 minecraft:emerald", trade: "3x oreganized:lead_bolt" },
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
            level: 5, group: "legendary", in1: "minecraft:crossbow", in2: "x5 utopia:ruby",
            trade: { item: "minecraft:crossbow", name: "§fRocket Launcher", enchants: { "nova_structures:ghasted": 2 } },
        },
    ],

    cleric: [
        // {
        //     level: 1, group: "singleton", in1: "x16 minecraft:emerald", in2: "x1 minecraft:ender_pearl",
        //     trade: {
        //         item: "utopia:recall_potion",
        //         components: 'custom_data={name:"Capital: ???",dim:"utopia:capital",x:-76.5d,y:36.0d,z:-68.5d}',
        //     },
        // },
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

    librarian: [
        {   level: 1, group: "shipment", in1: "x6 minecraft:emerald", in2: "x4 minecraft:book", trade: book("boots", 0.35)},
        {   level: 1, group: "singleton", in1: "x12 minecraft:emerald", in2: "x8 minecraft:book", trade: book("minecraft:feather_falling") },
        {   level: 1, group: "mass", in1: "x6 create:experience_block", trade: "x1 minecraft:emerald" },

        {   level: 1, group: "shipment", in1: "x12 minecraft:emerald", in2: "x4 minecraft:book",
            trade: { random: [ "minecraft:fire_aspect", "freezing_enchantment:freezing" ].map(id => book(id)), },
        },

        {   level: 2, group: "shipment", in1: "x12 minecraft:emerald", in2: "x4 minecraft:book", trade: book("chestplate", 0.35)},
        {   level: 2, group: "mass", in1: "x8 minecraft:bookshelf", trade: "x3 minecraft:emerald" },
        {   level: 2, group: "singleton", in1: "x5 minecraft:emerald", in2: "x7 minecraft:book", trade: book("nova_structures:outreach", .25) },

        {   level: 3, group: "shipment", in1: "x6 minecraft:emerald", in2: "x5 minecraft:book", trade: book("helmet", 0.35)},
        {   level: 3, group: "shipment", in1: "x6 minecraft:emerald", in2: "x20 minecraft:book", trade: book("minecraft:mending") },
        {   level: 3, group: "shipment", in1: "x14 minecraft:emerald", in2: "x10 minecraft:book", trade: book("tool")},
        {   level: 3, group: "shipment", in1: "x22 minecraft:emerald", in2: "x12 minecraft:book", trade: book("mace") },

        {   level: 4, group: "shipment", in1: "x22 minecraft:emerald", in2: "x14 minecraft:book", trade: book() },
        {   level: 4, group: "shipment", in1: "x17 minecraft:emerald", in2: "x20 minecraft:book", trade: book("sword") },
        {   level: 4, group: "shipment", in1: "x12 minecraft:emerald", in2: "x32 minecraft:book", trade: book("crossbow") },
        {   level: 4, group: "shipment", in1: "x24 minecraft:emerald", in2: "x10 minecraft:book", trade: book("tool", 1.0) },

        {   level: 5, group: "legendary", in1: "x5 utopia:ruby", in2: "x36 minecraft:book", trade: book("minecraft:mending") },
        {   level: 5, group: "legendary", in1: "x7 utopia:ruby", in2: "x36 minecraft:book", trade: book("nova_structures:photosynthesis") },
        {   level: 5, group: "legendary", in1: "x1 utopia:ruby", in2: "x20 minecraft:book", trade: book("nova_structures:antidote") },
        {   level: 5, group: "legendary", in1: "x8 utopia:ruby", in2: "x36 minecraft:book", trade: treasureBook(0.75) },
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
    "minecraft:cartographer": TRADES.cartographer,
    "minecraft:cleric": TRADES.cleric,
    "minecraft:farmer": TRADES.farmer,
    "minecraft:fisherman": TRADES.fisherman,
    "minecraft:fletcher": TRADES.fletcher,
    // "minecraft:leatherworker": TRADES.leatherworker,
    "minecraft:librarian": TRADES.librarian,
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

// ceil(max * strength), clamped to 1..max. Strength defaults to DEFAULT_STRENGTH (0.5).
// The 1e-9 stops float error (0.6 * 5 = 3.0000000000000004) from rounding up an extra level.
function scaledLevel(maxLevel, strength) {
    const s = Math.min(1, Math.max(0, strength == null ? DEFAULT_STRENGTH : strength));
    return Math.min(maxLevel, Math.max(1, Math.ceil(maxLevel * s - 1e-9)));
}

// "#minecraft:logs" -> a random item id from that tag. Plain item ids pass through.
function resolveTag(id, random) {
    if (!id.startsWith("#")) return id;
    const ids = Array.from(Ingredient.of(id).itemIds);
    if (!ids.length) throw new Error(`[trades.js] Tag ${id} is empty or doesn't exist`);
    return String(pick(ids, random));
}

// Needs a running server. Only call from trade callbacks / server events, never at script load.
function enchantRegistry() {
    return ServerLifecycleHooks.getCurrentServer().registryAccess().registryOrThrow(Registries.ENCHANTMENT);
}

// Enchants listed here are excluded everywhere: from books, from every category, and from "all".
const ENCHANT_BLACKLIST = [
    "nova_structures:shulker_boss",
    "nova_structures:shulker_miniboss",
    "nova_structures:boss_behaviour",
    "supplementaries:stasis"
];

// Registry ids (vanilla and modded) that are, or are not, in the treasure tag.
// Blacklisted enchants are excluded from both sides.
function enchantsWhere(treasure) {
    const registry = enchantRegistry();
    const tag = TagKey.create(Registries.ENCHANTMENT, ResourceLocation.parse(TREASURE_TAG));
    const blacklisted = new Set(ENCHANT_BLACKLIST);

    const treasureIds = new Set();
    const named = registry.getTag(tag).orElse(null); // null if the tag doesn't exist
    if (named) {
        Array.from(named).forEach(holder => treasureIds.add(String(holder.unwrapKey().get().location())));
    }

    return Array.from(registry.keySet())
        .map(String)
        .filter(id => !blacklisted.has(id))
        .filter(id => treasureIds.has(id) === treasure);
}

// Which of `all` fit a single category's sample items (before exclusivity is applied).
// Most categories match if the enchant fits ANY sample item; ENCHANT_MATCH_ALL categories need EVERY sample.
function filterByCategory(all, category) {
    const samples = ENCHANT_CATEGORIES[category];
    if (!samples) throw new Error(`[trades.js] Unknown enchant category: ${category}`);
    const stacks = samples.map(s => Item.of(s));
    const needAll = ENCHANT_MATCH_ALL.includes(category);
    return all.filter(e => needAll
        ? stacks.every(st => e.enchant.canEnchant(st))
        : stacks.some(st => e.enchant.canEnchant(st)));
}

// Priority order first, then any unlisted categories in definition order.
function categoryOrder() {
    const listed = ENCHANT_PRIORITY.filter(c => c in ENCHANT_CATEGORIES);
    return listed.concat(Object.keys(ENCHANT_CATEGORIES).filter(c => !listed.includes(c)));
}

// [{ "<enchant id>": maxLevel }, ...] for a category (a key of ENCHANT_CATEGORIES, or "all").
// Read from the live registry on every call, so there is no cache to go stale.
function enchantsFor(category) {
    var registry = enchantRegistry();
    var all = BOOKS()
        .map(function (id) { return { id: id, enchant: registry.get(ResourceLocation.parse(id)) }; })
        .filter(function (x) { return x.enchant; });

    var matching;
    if (category === "all") {
        matching = all;
    } else {
        if (!ENCHANT_CATEGORIES[category]) throw new Error("[trades.js] Unknown enchant category: " + category);
        var remaining = all;
        var order = categoryOrder();
        for (var i = 0; i < order.length; i++) {
            var c = order[i];
            var claimed = filterByCategory(remaining, c);
            if (c === category) { matching = claimed; break; }
            var taken = new Set(claimed.map(function (e) { return e.id; }));
            remaining = remaining.filter(function (e) { return !taken.has(e.id); });
        }
    }
    return matching.map(function (x) {
        var o = {};
        o[x.id] = x.enchant.getMaxLevel();
        return o;
    });
}

// One random { "<enchant id>": level } from a category, with the level scaled by strength.
function randomEnchant(category, random, strength) {
    const list = enchantsFor(category);
    if (!list.length) throw new Error(`[trades.js] Empty enchant category: ${category}`);
    const entry = pick(list, random);
    const id = Object.keys(entry)[0];
    const o = {};
    o[id] = scaledLevel(entry[id], strength);
    return o;
}

// id: "random"           -> random non-treasure enchant
//     "random_treasure"  -> random treasure enchant
//     "ns:enchant"       -> exactly that enchant
//     "sword", "mace"... -> random enchant from that ENCHANT_CATEGORIES entry (or "all")
function bookStack(id, count, random, strength) {
    let key;
    if (id === "random") key = pick(BOOKS(), random);
    else if (id === "random_treasure") key = pick(TREASURE_ENCHANTS(), random);
    else if (id.includes(":")) key = id;
    else {
        const list = enchantsFor(id); // throws on an unknown category
        if (!list.length) throw new Error(`[trades.js] Empty enchant category: ${id}`);
        key = Object.keys(pick(list, random))[0];
    }
    const level = scaledLevel(enchantRegistry().get(ResourceLocation.parse(key)).getMaxLevel(), strength);
    return Item.of(`minecraft:enchanted_book[stored_enchantments={levels:{"${key}":${level}}}]`, count);
}

// Quark ancient tome, always max level (built by Quark itself). id "random" = pick from Quark's Valid Enchantments.
function tomeStack(id, count, random) {
    const holder = id === "random"
        ? AncientTomesModule.validEnchants.get(random.nextInt(AncientTomesModule.validEnchants.size()))
        : enchantRegistry().getHolder(ResourceLocation.parse(id)).orElseThrow();
    return AncientTomeItem.getEnchantedItemStack(holder).copyWithCount(count);
}

function buildItemStack(entry, random) {
    const { item: rawItem, count, potion, enchants, name, components, tome, book, enchantFrom, strength } = parseItem(entry);
    if (tome) return tomeStack(tome, count, random);
    if (book) return bookStack(book, count, random, strength);

    const item = resolveTag(rawItem, random);
    const comps = [potion && `potion_contents={potion:"${potion}"}`, components].filter(Boolean).join(",");

    // fixed enchants plus (optionally) one random enchant from a category
    const allEnchants = Object.assign({}, enchants || {}, enchantFrom ? randomEnchant(enchantFrom, random, strength) : {});

    const enchanted = Object.entries(allEnchants).reduce((s, [id, level]) => s.enchant(id, level), Item.of(comps ? `${item}[${comps}]` : item, count));
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
                        .filter(id => ![
                            "minecraft:emerald", "minecraft:emerald_block",
                            "utopia:ruby", "utopia:ruby_block",
                            "minecraft:enchanted_book", "quark:ancient_tome"
                        ].includes(id))
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

// ===================== DEBUG =====================
//
// Prints every category's enchants once the world has loaded (a server exists by then) and warns about
// non-treasure enchants that fit no category. Safe to delete.
// Lists max levels; strength scaling is applied only when a trade is built.

ServerEvents.loaded(event => {
    console.info("[trades.js] debug handler fired");

    var categorized = new Set();
    var names = Object.keys(ENCHANT_CATEGORIES);
    var list, ids, allList, missing, id, i, j;

    for (i = 0; i < names.length; i++) {
        try {
            list = enchantsFor(names[i]);
            ids = [];
            for (j = 0; j < list.length; j++) {
                id = Object.keys(list[j])[0];
                ids.push(id);
                categorized.add(id);
            }
            console.info("[trades.js] " + names[i] + ": " + (ids.length ? ids.join(", ") : "(none)"));
        } catch (err1) {
            console.info("[trades.js] ERROR in category " + names[i] + ": " + err1);
        }
    }

    try {
        allList = enchantsFor("all");
        missing = [];
        for (j = 0; j < allList.length; j++) {
            id = Object.keys(allList[j])[0];
            if (!categorized.has(id)) missing.push(id);
        }
        if (missing.length) console.info("[trades.js] WARNING: enchants matching no category: " + missing.join(", "));
    } catch (err2) {
        console.info('[trades.js] ERROR building "all": ' + err2);
    }
});











// Disables villager discounts.

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