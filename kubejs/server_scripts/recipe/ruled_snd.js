// =============================================================================
//  Search and Destroy
//
//  ONE handler, ONE pass over Ingredient.all.itemIds. Each item is checked
//  against every generator as it goes by:
//
//    Section 1: Copper oxidation   - Create Spouting (filling) with nitric acid
//    Section 2: Silver oxidation   - Same, for Oreganized silver (-> tarnished)
//    Section 3: Glass pane compact - Create Compacting, 16 panes -> 6 glass blocks
//
//  Existence checks use Item.exists(), so no second loop over the item list.
//  Log output is condensed: one summary line, then "modid:item?" lists of
//  anything that found no match (lines only appear when something failed).
// =============================================================================


// =============================================================================
//  CONFIG
// =============================================================================

// ---- Copper ----------------------------------------------------------------
const COPPER_FLUID_ID = "utopia:nitric_acid";
const COPPER_FLUID_MB = 1000; // mB consumed per recipe

// Manual spot for pairs the automatic search can't catch (e.g. items with no
// "copper" in their id). Format: ["input_id", "output_id"]. Each pair becomes
// one copper-style spouting recipe using the fluid above.
const EXTRA_COPPER_PAIRS = [
    ["minecraft:lightning_rod", "minecraft:oxidized_lightning_rod"],
    ["minecraft:waxed_lightning_rod", "minecraft:waxed_oxidized_lightning_rod"],
    // ["modid:input", "modid:output"],
];

// ---- Silver (Oreganized) ---------------------------------------------------
const SILVER_NAMESPACE = "oreganized";
const SILVER_FINAL_STAGE = "tarnished";   // skips "blemished", goes straight to this
const SILVER_FLUID_ID = "utopia:nitric_acid";
const SILVER_FLUID_MB = 1000;

// ---- Panes -----------------------------------------------------------------
const PANES_IN = 16;  // panes consumed per compacting recipe
const BLOCKS_OUT = 6; // glass blocks produced per compacting recipe


// =============================================================================
//  SHARED HELPERS
// =============================================================================

/** Splits "namespace:path" into { namespace, path }. Defaults to minecraft. */
function splitId(id) {
    let colonIdx = id.indexOf(":");
    return {
        namespace: colonIdx === -1 ? "minecraft" : id.substring(0, colonIdx),
        path: colonIdx === -1 ? id : id.substring(colonIdx + 1)
    };
}

/** True if the item with this id is a block item. */
function isBlockItem(id) {
    return typeof Item.of(id).item.getBlock === "function";
}

/** Returns the first candidate id that exists as an item (and isn't `self`), or null. */
function firstExisting(candidates, self) {
    for (let c = 0; c < candidates.length; c++) {
        if (candidates[c] !== self && Item.exists(candidates[c])) return candidates[c];
    }
    return null;
}

/**
 * Shared oxidation logic (copper and silver both use it).
 * Builds the final-stage id, checks it exists, and makes the spouting recipe.
 *   material - word being replaced in the fallback guess, e.g. "copper"
 *   stage    - final stage prefix, e.g. "oxidized" or "tarnished"
 * Returns true if a recipe was created. Failures go into missList / log.errors.
 *
 * The stage prefix goes on the front of the whole name (cut_copper ->
 * oxidized_cut_copper). Waxed items keep "waxed_" first, then the stage.
 * A trailing "_block" is also tried without (vanilla drops it on oxidized).
 */
function handleOxidation(event, id, material, stage, fluidId, fluidMb, tag, missList, log) {
    if (!isBlockItem(id)) return false; // non-blocks (tools, ingots...) aren't relevant

    let parts = splitId(id);
    let hasWaxed = parts.path.indexOf("waxed_") === 0;
    let core = hasWaxed ? parts.path.substring(6) : parts.path;
    let prefix = hasWaxed ? "waxed_" : "";

    let candidates = [parts.namespace + ":" + prefix + stage + "_" + core];
    if (core.indexOf("_block") === core.length - 6) {
        candidates.push(parts.namespace + ":" + prefix + stage + "_" + core.slice(0, -6));
    }
    candidates.push(id.replace(material, stage + "_" + material)); // fallback for other mods

    let finalId = firstExisting(candidates, id);
    if (!finalId) {
        missList.push(id + "?");
        return false;
    }

    // NOTE: the mineable/pickaxe tag check is intentionally skipped; the
    // available bindings in this KubeJS setup didn't support it.

    try {
        event.recipes.createFilling(finalId, [id, Fluid.of(fluidId, fluidMb)]);
        return true;
    } catch (err) {
        log.errors.push("[" + tag + "] " + id + ": " + err);
        return false;
    }
}


// =============================================================================
//  SECTION 1: COPPER OXIDATION
//  Base copper blocks -> fully oxidized variant using nitric acid.
//  No intermediate exposed/weathered recipes are made.
// =============================================================================

function isBaseCopper(id) {
    if (id.indexOf("copper") === -1) return false;
    if (id.indexOf("exposed") !== -1 || id.indexOf("weathered") !== -1 || id.indexOf("oxidized") !== -1) return false;
    return true;
}

function handleCopper(event, id, log) {
    return handleOxidation(event, id, "copper", "oxidized",
        COPPER_FLUID_ID, COPPER_FLUID_MB, "copper", log.missCopper, log);
}

/** Makes recipes for the manual EXTRA_COPPER_PAIRS list. Returns count created. */
function handleExtraCopperPairs(event, log) {
    let created = 0;
    for (let p = 0; p < EXTRA_COPPER_PAIRS.length; p++) {
        let input = EXTRA_COPPER_PAIRS[p][0];
        let output = EXTRA_COPPER_PAIRS[p][1];

        let missing = false;
        if (!Item.exists(input)) { log.missCopper.push(input + "?"); missing = true; }
        if (!Item.exists(output)) { log.missCopper.push(output + "?"); missing = true; }
        if (missing) continue;

        try {
            event.recipes.createFilling(output, [input, Fluid.of(COPPER_FLUID_ID, COPPER_FLUID_MB)]);
            created++;
        } catch (err) {
            log.errors.push("[copper extra] " + input + ": " + err);
        }
    }
    return created;
}


// =============================================================================
//  SECTION 2: SILVER OXIDATION (Oreganized)
//  Base silver blocks -> tarnished variant using nitric acid.
//  Skips the intermediate "blemished" stage, same as copper skips exposed/weathered.
// =============================================================================

function isBaseSilver(id) {
    if (id.indexOf(SILVER_NAMESPACE + ":") !== 0) return false;
    if (id.indexOf("silver") === -1) return false;
    if (id.indexOf("blemished") !== -1 || id.indexOf("tarnished") !== -1) return false;
    return true;
}

function handleSilver(event, id, log) {
    return handleOxidation(event, id, "silver", SILVER_FINAL_STAGE,
        SILVER_FLUID_ID, SILVER_FLUID_MB, "silver", log.missSilver, log);
}


// =============================================================================
//  SECTION 3: GLASS PANE COMPACTING
//  For every "*_pane" item, works out its de-paned block id, confirms that
//  block exists, then adds a Create Compacting recipe turning panes back into
//  blocks. Vanilla crafts 6 blocks -> 16 panes, so this is the reverse ratio.
// =============================================================================

function isPane(id) {
    return id.length >= 6 && id.lastIndexOf("_pane") === id.length - 5;
}

function handlePane(event, id, log) {
    let parts = splitId(id);
    let base = parts.path.slice(0, -5); // strip "_pane"

    // Candidate block ids, most likely first:
    //   glass_pane             -> glass
    //   red_stained_glass_pane -> red_stained_glass
    //   modded variants        -> same pattern, or with a "_glass"/"_block" suffix
    let candidates = [parts.namespace + ":" + base];
    if (base.indexOf("glass") === -1) {
        candidates.push(parts.namespace + ":" + base + "_glass");
        candidates.push(parts.namespace + ":" + base + "_block");
    }
    // Some mods keep panes in their own namespace but reuse vanilla blocks
    if (parts.namespace !== "minecraft") {
        candidates.push("minecraft:" + base);
    }

    let blockId = firstExisting(candidates, id);
    if (!blockId || !isBlockItem(blockId)) {
        log.missPane.push(id + "?");
        return false;
    }

    try {
        event.recipes.createCompacting(
            Item.of(blockId, BLOCKS_OUT),
            Item.of(id, PANES_IN)
        );
        return true;
    } catch (err) {
        log.errors.push("[pane] " + id + ": " + err);
        return false;
    }
}


// =============================================================================
//  MAIN: single pass over every item
// =============================================================================

ServerEvents.recipes(event => {
    let allItems = Ingredient.all.itemIds;

    let copperCreated = 0;
    let silverCreated = 0;
    let paneCreated = 0;
    let log = { missCopper: [], missSilver: [], missPane: [], errors: [] };

    for (let i = 0; i < allItems.length; i++) {
        let id = allItems[i].toString();

        if (isBaseCopper(id)) {
            if (handleCopper(event, id, log)) copperCreated++;
        } else if (isBaseSilver(id)) {
            if (handleSilver(event, id, log)) silverCreated++;
        } else if (isPane(id)) {
            if (handlePane(event, id, log)) paneCreated++;
        }
    }

    // Manual extras (no item search involved)
    copperCreated += handleExtraCopperPairs(event, log);

    // Condensed log. "modid:item?" = no matching target item was found.
    console.log("[utopia_recipes] copper: " + copperCreated + " created, " + log.missCopper.length + " no match" +
                " | silver: " + silverCreated + " created, " + log.missSilver.length + " no match" +
                " | panes: " + paneCreated + " created, " + log.missPane.length + " no match");
    if (log.missCopper.length > 0) console.log("[copper no match] " + log.missCopper.join(", "));
    if (log.missSilver.length > 0) console.log("[silver no match] " + log.missSilver.join(", "));
    if (log.missPane.length > 0) console.log("[pane no match] " + log.missPane.join(", "));
    if (log.errors.length > 0) console.log("[utopia_recipes errors]\n" + log.errors.join("\n"));
});