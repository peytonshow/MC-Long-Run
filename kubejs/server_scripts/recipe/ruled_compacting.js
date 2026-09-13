
const ITEM_PAIRS = [
    { a: "farmersdelight:carrot_crate", b: "9x minecraft:carrot", packing: "create:cardboard" },
    { a: "farmersdelight:potato_crate", b: "9x minecraft:potato", packing: "create:cardboard" },
    { a: "farmersdelight:beetroot_crate", b: "9x minecraft:beetroot", packing: "create:cardboard" },
    { a: "farmersdelight:cabbage_crate", b: "9x farmersdelight:cabbage", packing: "create:cardboard" },
    { a: "farmersdelight:tomato_crate", b: "9x farmersdelight:tomato", packing: "create:cardboard" },
    { a: "farmersdelight:onion_crate", b: "9x farmersdelight:onion", packing: "create:cardboard" },

    { a: "quark:apple_crate", b: "9x minecraft:apple", packing: "create:cardboard" },
    { a: "quark:golden_apple_crate", b: "9x minecraft:golden_apple", packing: "create:cardboard" },
    { a: "quark:golden_carrot_crate", b: "9x minecraft:golden_carrot", packing: "create:cardboard" },
];

// ===================== ENGINE (shouldn't need edits) =====================

ServerEvents.recipes(event => {
    ITEM_PAIRS.forEach(({ a }) => {
        event.remove({ output: a, type: 'minecraft:crafting_shaped' });
        event.remove({ output: a, type: 'minecraft:crafting_shapeless' });
    });

    ITEM_PAIRS.forEach(({ a, b, packing }) => {
        event.recipes.create.compacting([a], [b, packing]);
    });

    console.log(`[compacting.js] Restricted ${ITEM_PAIRS.length} item(s) to Create compacting recipes.`);
});