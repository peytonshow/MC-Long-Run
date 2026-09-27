// ============================================================
// Ore Spawn Rate Helper — KubeJS 1.21.1 (NeoForge)
// Requires the "WorldJS" KubeJS addon (adds worldgen support back
// for 1.21+, since KubeJS's own WorldgenEvents stop at 1.20.1).
// Place this in kubejs/server_scripts/
// ============================================================

/**
 * Overrides a vanilla (or modded) ore's placement so you can control
 * how often/how much of it spawns, without touching the datapack JSON directly.
 *
 * @param {object} event        the ServerEvents.registry event (passed in automatically)
 * @param {string} placedId     the placed_feature id you're overriding, e.g. "minecraft:ore_diamond"
 * @param {object} opts
 * @param {number} [opts.veinsPerChunk]  how many vein attempts per chunk (replaces vanilla "count")
 * @param {number} [opts.rarity]         1-in-N chance per attempt to actually place (lower = more common). Omit to skip.
 * @param {number} [opts.minY]           lowest Y the vein can spawn at
 * @param {number} [opts.maxY]           highest Y the vein can spawn at
 * @param {"uniform"|"triangle"} [opts.heightType="uniform"]  distribution between minY/maxY
 * @param {boolean} [opts.everyLayer]    if true, ignore minY/maxY and use countOnEveryLayer(veinsPerChunk) instead
 */
function setOreSpawnRate(event, placedId, opts) {
    const {
        veinsPerChunk,
        rarity,
        minY,
        maxY,
        heightType = "uniform",
        everyLayer = false
    } = opts;

    // We "create" a dummy configured feature purely so we can chain
    // .withPlacement() onto an EXISTING vanilla id and overwrite it.
    // WorldJS treats withPlacement(existingId, ...) as "overwrite this placed feature".
    event.create(placedId.split(":")[1] + "_rate_override", "ore") // type doesn't matter, we're not touching the config
        .withPlacement(placedId, p => {
            p.modifiers(modifiers => {
                const { minecraft } = modifiers;

                if (everyLayer && veinsPerChunk != null) {
                    minecraft.countOnEveryLayer(veinsPerChunk);
                } else {
                    if (veinsPerChunk != null) minecraft.count(veinsPerChunk);
                    if (rarity != null) minecraft.rarityFilter(rarity);
                    if (minY != null && maxY != null) {
                        if (heightType === "triangle") {
                            minecraft.heightRangeTriangle(minecraft.absolute(minY), minecraft.absolute(maxY));
                        } else {
                            minecraft.heightRangeUniform(minecraft.absolute(minY), minecraft.absolute(maxY));
                        }
                    }
                }

                minecraft.inSquareSpread();
                minecraft.biome(); // keep it restricted to whatever biomes vanilla already allows
            });
        });
}

// ------------------------------------------------------------
// Example: completely change diamond ore's spawn rate
// ------------------------------------------------------------
ServerEvents.registry("worldgen/configured_feature", event => {
    setOreSpawnRate(event, "minecraft:ore_diamond", {
        veinsPerChunk: 12,   // vanilla is ~7, this makes it more common
        rarity: 2,           // lower = higher chance per attempt (vanilla-ish is around 4-9 depending on variant)
        minY: -64,
        maxY: 32,
        heightType: "triangle"
    });

    // Another example: make coal spawn on every Y layer, way more often
    setOreSpawnRate(event, "minecraft:ore_coal", {
        veinsPerChunk: 40,
        everyLayer: true
    });
});