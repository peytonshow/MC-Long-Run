const ClientboundSetTimePacket = Java.loadClass('net.minecraft.network.protocol.game.ClientboundSetTimePacket');

const ITEM_ID = 'utopia:platinum_pocketwatch';
const TOTAL_ABILITY_DURATION_SECONDS = 50; 
const GRACE_PERIOD_SECONDS = 10; 

const MAX_DAY_SPEED_MULTIPLIER = 200000; 
const ACCELERATION_EASE_EXPONENT = 5.0; 

const VANILLA_DAY_TICKS_PER_SECOND = 20; 
const TARGET_TICK_RATE = 15;
const MAX_RANDOM_TICK_SPEED = 1500;

const activeUsers = {};

const TORCH_SET = new Set([
    'minecraft:torch',
    'minecraft:wall_torch',
    'minecraft:soul_torch',
    'minecraft:soul_wall_torch'
]);

ItemEvents.rightClicked(ITEM_ID, event => {
    let player = event.player;
    let server = event.server;
    let username = player.username;

    if (activeUsers[username]) {
        player.tell('§7Acceleration is already active...');
        return;
    }

    event.item.shrink(1);
    let nowMs = Date.now();
    let initialDayCount = Math.floor(player.level.getDayTime() / 24000);

    activeUsers[username] = {
        startTimeMs: nowMs,
        lastUpdateMs: nowMs,
        timeAccumulator: 0,
        buffsGranted: false,
        lastDayCount: initialDayCount,
        startDayCount: initialDayCount,
        bonusDayCount: 0, 
        tickToggle: false,
        ending: false,
        lastRandomTickSpeed: 3
    };

    server.runCommandSilent('gamerule doDaylightCycle false');
    server.runCommandSilent('gamerule doMobSpawning false');
    server.runCommandSilent(`tick rate ${TARGET_TICK_RATE}`);
    server.runCommandSilent(`effect give @a minecraft:night_vision 61 1 true`);
    
    server.runCommandSilent('weather clear');
    
    console.info('Acceleration activated for ' + username);
});

ServerEvents.tick(event => {
    let server = event.server;

    for (let username in activeUsers) {
        try {
            let data = activeUsers[username];
            
            let player = null;
            server.players.forEach(p => {
                if (p.username === username) {
                    player = p;
                }
            });

            if (!player) {
                delete activeUsers[username];
                continue;
            }

            if (data.ending) {
                continue; 
            }

            let nowMs = Date.now();
            let dtSeconds = Math.min((nowMs - data.lastUpdateMs) / 1000, 0.1);
            data.lastUpdateMs = nowMs;

            let elapsedSeconds = (nowMs - data.startTimeMs) / 1000;
            let progress = Math.min(elapsedSeconds / TOTAL_ABILITY_DURATION_SECONDS, 1);
            
            let eased = Math.pow(progress, ACCELERATION_EASE_EXPONENT);
            let currentMultiplier = 1 + eased * (MAX_DAY_SPEED_MULTIPLIER - 1);

            server.runCommandSilent(`enhancedcelestials2core scheduleLunarEvent remove day 1`);
            server.runCommandSilent(`enhancedcelestials2core scheduleLunarEvent remove day 2`);
            server.runCommandSilent(`enhancedcelestials2core scheduleLunarEvent remove day 0`);

            // Scale random tick speed
            let targetRandomTick = Math.min(MAX_RANDOM_TICK_SPEED, Math.floor(3 + (eased * (MAX_RANDOM_TICK_SPEED - 3))));
            if (targetRandomTick !== data.lastRandomTickSpeed) {
                data.lastRandomTickSpeed = targetRandomTick;
                server.runCommandSilent(`gamerule randomTickSpeed ${targetRandomTick}`);
            }

            // --- HIGH SPEED BLOCK DECAY & TORCH WIPEOUT ---
            if (elapsedSeconds >= GRACE_PERIOD_SECONDS) {
                let level = player.level;
                let px = Math.floor(player.x);
                let py = Math.floor(player.y);
                let pz = Math.floor(player.z);
                
                // Radius expands up to 120 blocks as acceleration spikes
                let radius = Math.floor(50 + (eased * 70));

                // Total checks scaled up drastically: 50 -> 3000 per tick
                let checksThisTick = Math.floor(50 + (eased * 2950));

                for (let i = 0; i < checksThisTick; i++) {
                    let rx = px + Math.floor((Math.random() - 0.5) * (radius * 2));
                    let ry = py + Math.floor((Math.random() - 0.5) * 48);
                    let rz = pz + Math.floor((Math.random() - 0.5) * (radius * 2));

                    let block = level.getBlock(rx, ry, rz);
                    let id = String(block.getId());

                    if (TORCH_SET.has(id)) {
                        block.set('minecraft:air');
                    } else if (id === 'minecraft:cobblestone' || id === 'minecraft:stone') {
                        block.set('minecraft:mossy_cobblestone');
                    } else if (id === 'minecraft:stone_bricks') {
                        let targetBlock = Math.random() < 0.5 ? 'minecraft:cracked_stone_bricks' : 'minecraft:mossy_stone_bricks';
                        block.set(targetBlock);
                    } else if (id === 'minecraft:cobblestone_stairs') {
                        block.set('minecraft:mossy_cobblestone_stairs', block.getProperties());
                    } else if (id === 'minecraft:stone_brick_stairs') {
                        block.set('minecraft:mossy_stone_brick_stairs', block.getProperties());
                    } else if (id === 'minecraft:cobblestone_slab') {
                        block.set('minecraft:mossy_cobblestone_slab', block.getProperties());
                    } else if (id === 'minecraft:stone_brick_slab') {
                        block.set('minecraft:mossy_stone_brick_slab', block.getProperties());
                    } else if (id === 'minecraft:cobblestone_wall') {
                        block.set('minecraft:mossy_cobblestone_wall', block.getProperties());
                    } else if (id === 'minecraft:stone_brick_wall') {
                        block.set('minecraft:mossy_stone_brick_wall', block.getProperties());
                    }
                }

                // Dedicated torch deletion sweep: 20 -> 500 per tick
                let torchSweeps = Math.floor(20 + (eased * 480));
                for (let j = 0; j < torchSweeps; j++) {
                    let rx = px + Math.floor((Math.random() - 0.5) * (radius * 2));
                    let ry = py + Math.floor((Math.random() - 0.5) * 48);
                    let rz = pz + Math.floor((Math.random() - 0.5) * (radius * 2));

                    let block = level.getBlock(rx, ry, rz);
                    if (TORCH_SET.has(String(block.getId()))) {
                        block.set('minecraft:air');
                    }
                }
            }

            if (elapsedSeconds >= TOTAL_ABILITY_DURATION_SECONDS && !data.buffsGranted) {
                data.buffsGranted = true;
                player.tell('§5§lTIME HAS REACHED MAX ACCELERATION.');
                server.runCommandSilent(`effect give ${username} minecraft:speed 31 7 true`);
                server.runCommandSilent(`effect give ${username} minecraft:strength 31 1 true`);
                server.runCommandSilent(`effect give ${username} minecraft:resistance 31 5 true`);
                server.runCommandSilent(`effect give ${username} minecraft:regeneration 31 1 true`);
                server.runCommandSilent(`effect give ${username} minecraft:haste 31 2 true`);
                server.runCommandSilent(`effect give ${username} minecraft:jump_boost 31 3 true`);

                endMadeInHeaven(server, player, data);
                continue;
            }

            let dayTicksThisUpdate = VANILLA_DAY_TICKS_PER_SECOND * currentMultiplier * dtSeconds;

            data.timeAccumulator += dayTicksThisUpdate;
            let wholeTicksToAdd = Math.floor(data.timeAccumulator);
            data.timeAccumulator -= wholeTicksToAdd;

            if (wholeTicksToAdd > 0) {
                let ticksToApply = wholeTicksToAdd;
                
                if (wholeTicksToAdd >= 24000) {
                    let skippedDays = Math.floor(wholeTicksToAdd / 24000);
                    data.bonusDayCount += skippedDays;
                    ticksToApply = wholeTicksToAdd % 24000;
                }

                if (ticksToApply > 0) {
                    server.runCommandSilent(`time add ${ticksToApply}`);
                }

                let gameTime = player.level.getDayTime();
                let packet = new ClientboundSetTimePacket(gameTime, gameTime, false);
                player.connection.send(packet);

                let allPlayers = server.players;

                if (elapsedSeconds >= GRACE_PERIOD_SECONDS) {
                    server.runCommandSilent(`execute as @e[type=!player,type=!armor_stand,type=!experience_orb,type=!painting,type=!item_frame,sort=random,limit=1] run kill @s`);

                    let currentDayCount = Math.floor(player.level.getDayTime() / 24000) + data.bonusDayCount;
                    let daysPassed = currentDayCount - data.lastDayCount;

                    if (daysPassed > 0) {
                        data.lastDayCount = currentDayCount;
                        
                        let pitch = data.tickToggle ? '1.2' : '1.8';
                        data.tickToggle = !data.tickToggle;
                        server.runCommandSilent(`execute as ${username} at ${username} run playsound minecraft:ui.button.click master @s ~ ~ ~ 0.1 ${pitch}`);

                        let totalDaysElapsed = currentDayCount - data.startDayCount;

                        for (let pIdx = 0; pIdx < allPlayers.size(); pIdx++) {
                            let targetPlayer = allPlayers.get(pIdx);
                            let inventory = targetPlayer.inventory;

                            for (let slot = 0; slot < inventory.getContainerSize(); slot++) {
                                let stack = inventory.getItem(slot);
                                
                                if (stack != null && !stack.isEmpty()) {
                                    if (stack.isDamageableItem()) {
                                        let damageToApply = daysPassed * 5; 
                                        let currentDamage = stack.getDamageValue();
                                        let maxDamage = stack.getMaxDamage();

                                        if (currentDamage + damageToApply >= maxDamage) {
                                            inventory.setItem(slot, Item.of('minecraft:air'));
                                            server.runCommandSilent(`execute as ${targetPlayer.username} at ${targetPlayer.username} run playsound minecraft:entity.item.break player @s ~ ~ ~ 0.8 1.0`);
                                        } else {
                                            stack.setDamageValue(currentDamage + damageToApply);
                                        }
                                    }

                                    if (totalDaysElapsed >= 14 && stack.getId() !== 'minecraft:rotten_flesh') {
                                        if (stack.hasTag('c:foods')) {
                                            let currentCount = stack.getCount();
                                            let quarterCount = Math.max(1, Math.floor(currentCount / 4));
                                            inventory.setItem(slot, Item.of('minecraft:rotten_flesh', quarterCount));
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else {
                    data.lastDayCount = Math.floor(player.level.getDayTime() / 24000) + data.bonusDayCount;
                }
            }
        } catch (e) {
            console.error('Acceleration tick error processing ' + username + ': ' + e);
        }
    }
});

function endMadeInHeaven(server, player, data) {
    let username = player.username;
    
    if (data && data.bonusDayCount > 0) {
        let bonusTicks = data.bonusDayCount * 24000;
        server.runCommandSilent(`time add ${bonusTicks}`);
        
        let newGameTime = player.level.getDayTime();
        let packet = new ClientboundSetTimePacket(newGameTime, newGameTime, false);
        player.connection.send(packet);
        
        console.info(`Added ${bonusTicks} bonus ticks (${data.bonusDayCount} days) to total world time.`);
    }

    server.runCommandSilent('tick rate 20');
    server.runCommandSilent('gamerule doDaylightCycle true');
    server.runCommandSilent('gamerule doMobSpawning true');
    server.runCommandSilent('gamerule randomTickSpeed 3');
    
    server.runCommandSilent(`effect clear ${username} minecraft:speed`);
    server.runCommandSilent(`effect clear ${username} minecraft:strength`);
    server.runCommandSilent(`effect clear ${username} minecraft:resistance`);
    server.runCommandSilent(`effect clear ${username} minecraft:regeneration`);
    server.runCommandSilent(`effect clear ${username} minecraft:haste`);
    server.runCommandSilent(`effect clear ${username} minecraft:jump_boost`);
    server.runCommandSilent(`effect clear @a minecraft:night_vision`);

    server.runCommandSilent(`execute as ${username} at ${username} run playsound minecraft:entity.warden.death master @s ~ ~ ~ 1.0 1.0`);
    server.runCommandSilent(`weather thunder`);


    if (data) {
        data.ending = true;
        server.scheduleInTicks(5, callback => {
            delete activeUsers[username];
        });
    }
}