// Generates Create Spouting (filling) recipes that convert base copper
// blocks straight to their fully oxidized variant using utopia:nitric_acid.
// No intermediate exposed/weathered recipes are made.

const FLUID_ID = "utopia:nitric_acid";
const FLUID_AMOUNT_MB = 1000; // mB consumed per recipe - adjust to taste

ServerEvents.recipes(event => {
    let allItems = Ingredient.all.itemIds;

    // Build a plain JS lookup set, since allItems is a Java array (no .indexOf)
    let itemSet = {};
    for (let i = 0; i < allItems.length; i++) {
        itemSet[allItems[i].toString()] = true;
    }

    let created = 0;
    let skipped = [];

    for (let i = 0; i < allItems.length; i++) {
        let id = allItems[i].toString();

        if (id.indexOf("copper") === -1) continue;
        if (id.indexOf("exposed") !== -1 || id.indexOf("weathered") !== -1 || id.indexOf("oxidized") !== -1) continue;

        // Guess the fully oxidized item's id. The "oxidized_" prefix goes on
        // the front of the whole name (e.g. cut_copper -> oxidized_cut_copper,
        // copper_grate -> oxidized_copper_grate) - NOT squeezed in right before
        // the literal word "copper", which breaks on names like cut_copper.
        // Waxed items keep "waxed_" first, then "oxidized_" after it. Vanilla
        // also drops a trailing "_block" on the oxidized form.
        let colonIdx = id.indexOf(":");
        let namespace = colonIdx === -1 ? "minecraft" : id.substring(0, colonIdx);
        let localPath = colonIdx === -1 ? id : id.substring(colonIdx + 1);

        let hasWaxed = localPath.indexOf("waxed_") === 0;
        let core = hasWaxed ? localPath.substring(6) : localPath;
        let prefix = hasWaxed ? "waxed_" : "";

        let candidates = [namespace + ":" + prefix + "oxidized_" + core];
        if (core.indexOf("_block") === core.length - 6) {
            candidates.push(namespace + ":" + prefix + "oxidized_" + core.slice(0, -6));
        }
        candidates.push(id.replace("copper", "oxidized_copper")); // fallback for other mods

        let oxidizedId = null;
        for (let c = 0; c < candidates.length; c++) {
            if (itemSet[candidates[c]]) {
                oxidizedId = candidates[c];
                break;
            }
        }

        if (!oxidizedId) {
            skipped.push(id + " (no oxidized variant found, tried: " + candidates.join(", ") + ")");
            continue;
        }

        // Must be a block item
        let itemObj = Item.of(id).item;
        if (typeof itemObj.getBlock !== "function") {
            skipped.push(id + " (not a block item)");
            continue;
        }

        // NOTE: not verifying the mineable/pickaxe tag here - repeated attempts
        // at this (Java.loadClass, bare "net.minecraft...", bare "BlockTags")
        // all failed against your KubeJS setup's available bindings. Copper
        // blocks are essentially always pickaxe-minable in practice, so this
        // is skipped for now. If you find the right way to check it in your
        // environment, add the check back in right here.

        try {
            event.recipes.createFilling(oxidizedId, [id, Fluid.of(FLUID_ID, FLUID_AMOUNT_MB)]);
            created++;
        } catch (err) {
            skipped.push(id + " (recipe creation failed: " + err + ")");
        }
    }

    console.log("Copper oxidation recipes created: " + created);
    if (skipped.length > 0) {
        console.log("Skipped " + skipped.length + " item(s):");
        console.log(skipped.join("\n"));
    }
});