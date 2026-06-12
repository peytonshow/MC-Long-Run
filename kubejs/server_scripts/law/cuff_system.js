// ============================================================================
//               IN-MEMORY CACHES (NO PERSISTENT DATA/NBT USED)
// ============================================================================
const restraintCooldowns = {}; // Tracks right-click debounce { "Username": 123456789 }
const crouchStates = {};       // Tracks if a player was crouching last tick { "Username": true }
const cuffTimestamps = {};     // Tracks when cuffs were applied { "Username": { chest: 12345, boots: 12345 } }

// ============================================================================
//                         DATA-DRIVEN CONFIGURATION
// ============================================================================
const RESTRAINT_CONFIG = {
    tools: {
        chest: 'utopia:handcuffs',
        boots: 'utopia:shackles'
    },
    armor: {
        chest: 'utopia:used_handcuffs',
        boots: 'utopia:used_shackles'
    },
    settings: {
        baseDurationTicks: 100,      // 5 seconds of slowness applied per click/tick
        clickDebounceMs: 950,        // ~1 second between level increments while holding right-click
        escapeLockoutTimeMs: 30000,  // 30 seconds before they can struggle
        durabilityDamagePerShift: 1, // 1 durability damage per shift
        struggleSoundChance: 0.3     // 30% chance to play sound when escaping/struggling
    }
};

// ============================================================================
//               APPLICATION MECHANIC (SLOWNESS METER VIA HOLD RIGHT-CLICK)
// ============================================================================
ItemEvents.entityInteracted(event => {
    try {
        let player = event.player;
        let target = event.target;
        let item = event.item;
        let server = player.server;

        if (!player || !target || !target.isPlayer()) return;

        let isChest = item.id === RESTRAINT_CONFIG.tools.chest;
        let isBoots = item.id === RESTRAINT_CONFIG.tools.boots;
        if (!isChest && !isBoots) return;

        let type = isChest ? 'chest' : 'boots';
        let existingArmor = type === 'chest' ? target.chestArmorItem : target.feetArmorItem;

        if (existingArmor.id === RESTRAINT_CONFIG.armor[type]) {
            player.tell(Text.red(`${target.username} is already securely restrained there.`));
            return;
        }

        // In-Memory Debounce Tracking
        let username = player.username;
        let now = Date.now();
        let lastClick = restraintCooldowns[username] || 0;
        if (now - lastClick < RESTRAINT_CONFIG.settings.clickDebounceMs) return;
        restraintCooldowns[username] = now;

        // Fetch target's current slowness amplifier dynamically
        let currentAmp = -1;
        let activeEffect = target.potionEffects.getActive('minecraft:slowness');
        if (activeEffect != null) {
            currentAmp = activeEffect.amplifier;
        }

        let nextAmp = currentAmp + 1;

        if (nextAmp >= 4) {
            // LEVEL 5 ACHIEVED: Apply Restraints
            if (server) {
                server.runCommandSilent(`effect clear ${target.username} minecraft:slowness`);
                server.runCommandSilent(`execute at ${target.username} run playsound minecraft:block.chain.attach player @a ~ ~ ~ 1 0.8`);
            }

            let restraintItem = Item.of(RESTRAINT_CONFIG.armor[type]);
            restraintItem.set('minecraft:enchantments', {
                levels: { 'minecraft:binding_curse': 1, 'minecraft:vanishing_curse' : 1 }
            });

            // FIXED: Use the proper KubeJS method to pop the item out into the world
            if (existingArmor && existingArmor.id !== 'minecraft:air') {
                target.block.popItem(existingArmor);
            }

            if (type === 'chest') {
                target.setChestArmorItem(restraintItem);
            } else {
                target.setFeetArmorItem(restraintItem);
            }

            // Consume 1 of the tool items from the player's hand
            item.count--;

            // Save application time to In-Memory Map
            if (!cuffTimestamps[target.username]) cuffTimestamps[target.username] = {};
            cuffTimestamps[target.username][type] = now;

            target.tell(Text.darkRed('You have been successfully bound in restraints!'));
            player.tell(Text.green(`Successfully restrained ${target.username}.`));
        } else {
            // INCREMENT METER
            let durationSeconds = Math.floor(RESTRAINT_CONFIG.settings.baseDurationTicks / 20);
            if (server) {
                server.runCommandSilent(`effect give ${target.username} minecraft:slowness ${durationSeconds} ${nextAmp} true`);
            }

            // Visual feedback
            let typeStr = isChest ? "Chest Restraints" : "Leg Shackles";
            let percentage = (nextAmp + 1) * 20;
            let progressBar = "▪".repeat(nextAmp + 1) + "▫".repeat(4 - nextAmp);

            let displayMsg = Text.yellow(`Securing ${typeStr}: [${progressBar}] ${percentage}%`);
            player.setStatusMessage(displayMsg);
            target.setStatusMessage(Text.red(`Someone is restraining you! [${progressBar}] ${percentage}%`));
        }

    } catch (error) {
        console.error("Error encountered in cuff_system.js: " + error);
    }
});

// ============================================================================
//               CORE TICK MECHANIC (BREAKOUT & ACTIVE DEBUFFS)
// ============================================================================
PlayerEvents.tick(event => {
    const { player, server } = event;
    if (player.isFake()) return;

    let now = Date.now();
    let hasChestCuff = player.chestArmorItem.id === RESTRAINT_CONFIG.armor.chest;
    let hasBootShackle = player.feetArmorItem.id === RESTRAINT_CONFIG.armor.boots;

    // 1. Shift-Spam Breakout Mechanics
    if (hasChestCuff || hasBootShackle) {
        let isCrouching = player.isCrouching();
        // Read from In-Memory Map
        let wasCrouching = crouchStates[player.username] || false;

        if (isCrouching && !wasCrouching) {
            // Prevent double-breaking. We use a flag to only allow one item to take damage per shift.
            let struggled = false;

            if (hasChestCuff) {
                let placedTime = (cuffTimestamps[player.username] && cuffTimestamps[player.username].chest) ? cuffTimestamps[player.username].chest : 0;
                if (now - placedTime > RESTRAINT_CONFIG.settings.escapeLockoutTimeMs) {
                    processStruggle(player, 'chest', server);
                    struggled = true;
                }
            }

            // Only process boot struggle if they didn't just struggle against the chest restraints
            if (hasBootShackle && !struggled) {
                let placedTime = (cuffTimestamps[player.username] && cuffTimestamps[player.username].boots) ? cuffTimestamps[player.username].boots : 0;
                if (now - placedTime > RESTRAINT_CONFIG.settings.escapeLockoutTimeMs) {
                    processStruggle(player, 'boots', server);
                }
            }
        }
        // Update In-Memory Map
        crouchStates[player.username] = isCrouching;
    }

    // 2. Active Debuff Maintenance Pulse (Runs every 5 seconds / 100 ticks)
    if (server.tickCount % 100 === 0) {
        if (hasChestCuff) {
            player.potionEffects.add('minecraft:weakness', 120, 4, false, false);
            player.potionEffects.add('minecraft:mining_fatigue', 120, 0, false, false);
        }
        if (hasBootShackle) {
            player.potionEffects.add('minecraft:slowness', 120, 3, false, false);
        }
    }
});

// ============================================================================
//                           ESCAPE ENGINE HELPER
// ============================================================================
function processStruggle(player, type, server) {
    let item = type === 'chest' ? player.chestArmorItem : player.feetArmorItem;
    let currentDamage = item.get('minecraft:damage') || 0;
    let maxDamage = item.maxDamage || 240;

    let newDamage = currentDamage + RESTRAINT_CONFIG.settings.durabilityDamagePerShift;

    // RNG check against your configured chance variable
    if (Math.random() < RESTRAINT_CONFIG.settings.struggleSoundChance) {
        server.runCommandSilent(`execute at ${player.username} run playsound minecraft:block.chain.step player @a ~ ~ ~ 0.6 1.2`);
    }

    if (newDamage >= maxDamage) {
        // Break cuffs and clean up In-Memory Maps
        if (type === 'chest') {
            player.setChestArmorItem('minecraft:air');
            if (cuffTimestamps[player.username]) delete cuffTimestamps[player.username].chest;
        } else {
            player.setFeetArmorItem('minecraft:air');
            if (cuffTimestamps[player.username]) delete cuffTimestamps[player.username].boots;
        }
        server.runCommandSilent(`execute at ${player.username} run playsound minecraft:entity.item.break player @a ~ ~ ~ 1 0.9`);

        // Changed from player.tell() to player.setStatusMessage()
        player.setStatusMessage(Text.green('With a final burst of strength, you shattered your restraints!'));
    } else {
        item.set('minecraft:damage', newDamage);

        if (type === 'chest') player.setChestArmorItem(item);
        else player.setFeetArmorItem(item);

        player.setStatusMessage(Text.red(`Struggling... Durability: ${maxDamage - newDamage}/${maxDamage}`));
    }
}
