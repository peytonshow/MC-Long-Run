// ============================================================================
//                     TREASURY ABILITIES & REDEEMABLES
// ============================================================================

// 1. The Royal Killswitch (Right-Click Air)
ItemEvents.rightClicked(event => {
    const { item, player, server, hand } = event;
    if (hand !== 'MAIN_HAND') return;

    // Check if the item has the custom treasury_ability tag
    if (item.nbt && item.nbt.treasury_ability == 'killswitch') {
        // Consume the item
        item.count--;

        // Force the promotion via console since the player might not have OP
        server.runCommandSilent(`coronation promote ${player.username}`);

        player.tell(Text.gold('The Killswitch has been activated. A fresh Crown has been materialized.'));
        server.runCommandSilent(`tellraw @a {"text":"A Royal Killswitch has been activated!","color":"dark_red","bold":true}`);
    }
});

// 2. Mercenary Raid Orders (Right-Click a Player)
ItemEvents.entityInteracted(event => {
    const { item, player, target, server, hand } = event;
    if (hand !== 'MAIN_HAND') return;

    // Ensure the target is a player and the item is the Mercenary order
    if (target.isPlayer() && item.nbt && item.nbt.treasury_ability == 'mercenaries') {
        // Consume the item
        item.count--;

        player.tell(Text.green(`Mercenaries have been dispatched to hunt down ${target.username}.`));
        target.tell(Text.darkRed("You feel like you're being watched..."));

        // Capture exact dimensional coordinates to prevent combat-logging exploits
        const tX = target.x;
        const tY = target.y;
        const tZ = target.z;
        const tDim = target.level.dimension.toString(); // e.g. "minecraft:overworld"

        // Schedule the raid to spawn 5 seconds (100 ticks) later for dramatic effect
        server.scheduleInTicks(100, ctx => {
            // Spawn 2 Pillagers with Crossbows
            server.runCommandSilent(`execute in ${tDim} positioned ${tX} ${tY} ${tZ} run summon pillager ~5 ~ ~ {HandItems:[{id:"minecraft:crossbow",Count:1b}]}`);
            server.runCommandSilent(`execute in ${tDim} positioned ${tX} ${tY} ${tZ} run summon pillager ~-5 ~ ~ {HandItems:[{id:"minecraft:crossbow",Count:1b}]}`);

            // Spawn 2 Vindicators with Iron Axes
            server.runCommandSilent(`execute in ${tDim} positioned ${tX} ${tY} ${tZ} run summon vindicator ~ ~ ~5 {HandItems:[{id:"minecraft:iron_axe",Count:1b}]}`);
            server.runCommandSilent(`execute in ${tDim} positioned ${tX} ${tY} ${tZ} run summon vindicator ~ ~ ~-5 {HandItems:[{id:"minecraft:iron_axe",Count:1b}]}`);
        });
    }
});
