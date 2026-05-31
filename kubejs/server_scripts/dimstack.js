PlayerEvents.tick(event => {
    const player = event.player;
    const level = event.level;
    const server = event.server; // Captured here so scheduled tasks never lose it
    const time = level.time;
    const dim = String(level.dimension);

    // ==========================================
    // MASTER LOOP: Every 40 ticks (2 Seconds)
    // ==========================================
    if (time % 40 === 0) {

        // ------------------------------------------
        // TASK 1: Nether Arrival Carving (Synchronized with darkness_5)
        // ------------------------------------------
        if (dim.includes('nether') && player.tags.contains('darkness_5')) {
            player.tags.remove('darkness_5');

            let px = Math.floor(player.x);
            let py = Math.floor(player.y) + 1; // Center the room logic at chest height
            let pz = Math.floor(player.z);

            // Flat array of sequential commands to guarantee maximum engine compatibility
            let commands = [
                // Pass 1: Clear custom tag zones (Main body, X-walls, Z-walls, Roof)
                `execute in minecraft:the_nether positioned ${px} ${py} ${pz} run fill ~-3 ~-2 ~-3 ~3 ~2 ~3 air replace #utopia:remove_nether_roof`,
                `execute in minecraft:the_nether positioned ${px} ${py} ${pz} run fill ~-4 ~-1 ~-2 ~4 ~1 ~2 air replace #utopia:remove_nether_roof`,
                `execute in minecraft:the_nether positioned ${px} ${py} ${pz} run fill ~-2 ~-1 ~-4 ~2 ~1 ~4 air replace #utopia:remove_nether_roof`,
                `execute in minecraft:the_nether positioned ${px} ${py} ${pz} run fill ~-2 ~3 ~-2 ~2 ~3 ~2 air replace #utopia:remove_nether_roof`,

                // Pass 2: Clear netherrack zones (Main body, X-walls, Z-walls, Roof)
                `execute in minecraft:the_nether positioned ${px} ${py} ${pz} run fill ~-3 ~-2 ~-3 ~3 ~2 ~3 air replace minecraft:netherrack`,
                `execute in minecraft:the_nether positioned ${px} ${py} ${pz} run fill ~-4 ~-1 ~-2 ~4 ~1 ~2 air replace minecraft:netherrack`,
                `execute in minecraft:the_nether positioned ${px} ${py} ${pz} run fill ~-2 ~-1 ~-4 ~2 ~1 ~4 air replace minecraft:netherrack`,
                `execute in minecraft:the_nether positioned ${px} ${py} ${pz} run fill ~-2 ~3 ~-2 ~2 ~3 ~2 air replace minecraft:netherrack`,

                // Pass 3: Safe 3x3 landing pad under player's feet (strictly replaces air gaps)
                `execute in minecraft:the_nether positioned ${px} ${py} ${pz} run fill ~-1 ~-2 ~-1 ~1 ~-2 ~1 minecraft:netherrack replace air`
            ];

            // Sweep 1: Instant arrival carve
            for (let i = 0; i < commands.length; i++) {
                server.runCommandSilent(commands[i]);
            }

        }

        // ------------------------------------------
        // TASK 2: Void Rescues
        // ------------------------------------------
        if (player.y <= -60) {
            if (dim.includes('nether')) {
                let cx = Math.floor(player.x);
                let cz = Math.floor(player.z);
                let targetY = 110;

                // Add the receipt tag so Task 1 carves the room on arrival
                player.tags.add('darkness_5');

                player.potionEffects.add('minecraft:resistance', 200, 4);
                player.potionEffects.add('minecraft:slow_falling', 500, 0); // 25 Seconds

                player.teleportTo('minecraft:the_nether', cx, targetY, cz, player.yaw, player.pitch);
            }
            else if (dim.includes('end')) {
                player.potionEffects.add('minecraft:slow_falling', 1200, 0);
                player.teleportTo('minecraft:overworld', player.x, 300, player.z, player.yaw, player.pitch);
            }
        }

        // ------------------------------------------
        // TASK 3: Overworld Bedrock Darkness
        // Fires every 120 ticks (6 seconds)
        // ------------------------------------------
        if (time % 120 === 0) {
            if (dim.includes('overworld') && player.y <= -59) {

                let bx = player.blockX;
                let by = player.blockY;
                let bz = player.blockZ;

                let blockAtFeet = level.getBlock(bx, by, bz).id;
                let blockBelow = level.getBlock(bx, by - 1, bz).id;

                if (blockBelow === 'minecraft:bedrock' || blockAtFeet === 'minecraft:bedrock') {

                    let currentLevel = 0;

                    if (player.hasEffect('minecraft:darkness')) {
                        let effect = player.getEffect('minecraft:darkness');
                        if (effect) {
                            currentLevel = effect.getAmplifier() + 1;
                        }
                    }

                    let nextLevel = currentLevel + 1;

                    if (nextLevel === 2) {
                        player.tell("§5You feel dimensional forces getting stronger...");
                        player.playSound('minecraft:ambient.cave', 1.0, 1.0);
                    } else if (nextLevel === 4) {
                        player.tell("§cThe air is thick and warm. It becomes harder to breathe...");
                    }

                    // The Transition to Nether
                    if (nextLevel >= 5) {

                        player.tags.add('darkness_5');

                        let netherX = Math.floor(player.x / 8);
                        let netherZ = Math.floor(player.z / 8);
                        let targetY = 110;

                        player.potionEffects.add('minecraft:resistance', 200, 4);
                        player.potionEffects.add('minecraft:slow_falling', 500, 0); // 25 Seconds

                        // Send them down
                        player.teleportTo('minecraft:the_nether', netherX, targetY, netherZ, player.yaw, player.pitch);

                    } else {
                        player.potionEffects.add('minecraft:darkness', 160, nextLevel - 1);
                    }
                } else {
                    server.runCommandSilent(`effect clear ${player.username} minecraft:darkness`);
                }
            } else {
                server.runCommandSilent(`effect clear ${player.username} minecraft:darkness`);
            }
        }
    }
});
