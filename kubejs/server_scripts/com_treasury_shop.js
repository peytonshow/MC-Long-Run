const TREASURY_ITEM_SHOP_CONFIG = {
    1: { id: 'utopia:coin_diamond', count: 8, cost: 3, label: 'Diamond Coin' },
    2: { id: 'utopia:coin_iron', count: 100, cost: 1, label: 'Iron Coin' },
    3: { id: 'musketmod:musket_with_scope', count: 1, cost: 2, label: 'Scoped Musket' }
};

const TREASURY_ORDER_SHOP_CONFIG = {
    1: { id: 'mercenaries', cost: 6, label: 'Mercenaries', desc: 'Dispatch a paratrooper raid party of Axemen and Mounted Musketeers from a cardinal direction.' },
    2: { id: 'doom', cost: 12, label: 'Doom', desc: 'Deploys a Nether squad of Piglins, Ghasts, and Blazes from afar.' },
    3: { id: 'annihilation', cost: 25, label: 'Annihilation', desc: 'Illuminates the target and surrounds them from afar with 70 Creepers.' },
    4: { id: 'guards', cost: 8, label: 'Royal Guards', desc: 'Deploys a squad of 5 armed Villager Guards around the target to defend them.' }
};

// ============================================================================
//                          HELPER FUNCTIONS
// ============================================================================
function safeNum(val, fallback) {
    if (val == null) return fallback;
    let str = String(val).split('.')[0].replace(/[^0-9-]/g, '');
    let num = parseInt(str, 10);
    return isNaN(num) ? fallback : num;
}

// ============================================================================
//                          COMMAND REGISTRY
// ============================================================================
ServerEvents.commandRegistry(event => {
    const { commands: C, arguments: A } = event;

    const registerShopTree = (baseCommandName) => {
        event.register(C.literal(baseCommandName)
        .then(C.literal('shop')
        // SUBMENU: Physical Items
        .then(C.literal('items')
        .executes(ctx => showItemShop(ctx))
        .then(C.literal('buy')
        .then(C.argument('index', A.INTEGER.create(event))
        .executes(ctx => handleItemBuy(ctx, A.INTEGER.getResult(ctx, 'index'), 1))
        .then(C.argument('quantity', A.INTEGER.create(event))
        .executes(ctx => handleItemBuy(ctx, A.INTEGER.getResult(ctx, 'index'), A.INTEGER.getResult(ctx, 'quantity')))
        )
        )
        )
        )
        // SUBMENU: King's Orders
        .then(C.literal('orders')
        .executes(ctx => showOrderShop(ctx))
        .then(C.literal('buy')
        .then(C.argument('index', A.INTEGER.create(event))
        .then(C.argument('target', A.PLAYER.create(event))
        .executes(ctx => handleOrderBuy(ctx, A.INTEGER.getResult(ctx, 'index'), A.PLAYER.getResult(ctx, 'target')))
        )
        )
        )
        )
        )
        );
    };

    registerShopTree('treasury');
    registerShopTree('tres');
});

// ============================================================================
//                          SHOP HANDLERS
// ============================================================================

function showItemShop(ctx) {
    const player = ctx.source.player;
    const server = ctx.source.server;

    if (player.username != server.persistentData.current_king) {
        player.tell(Text.red('Only the King can view the Royal Item Shop!'));
        return 0;
    }

    let points = safeNum(server.persistentData.tres_points, 0);

    let shopMenu = Text.gold('=== Royal Item Shop ===\n')
    .append(Text.yellow(`Available Royal Points: ${points}\n`))
    .append(Text.gray('Use /tres shop items buy <index> [quantity] to purchase.\n\n'));

    for (let index in TREASURY_ITEM_SHOP_CONFIG) {
        let shopItem = TREASURY_ITEM_SHOP_CONFIG[index];
        shopMenu.append(Text.aqua(`[#${index}] `))
        .append(Text.green(`${shopItem.label} `))
        .append(Text.gray(`(x${shopItem.count}) `))
        .append(Text.yellow(`- Cost: ${shopItem.cost} Pts\n`));
    }

    player.tell(shopMenu);
    return 1;
}

function handleItemBuy(ctx, index, quantity) {
    const player = ctx.source.player;
    const server = ctx.source.server;
    if (!player) return 0;

    if (player.username != server.persistentData.current_king) {
        player.tell(Text.red('Only the King can purchase from the Royal Item Shop!'));
        return 0;
    }

    if (quantity <= 0) {
        player.tell(Text.red('Quantity must be greater than 0!'));
        return 0;
    }

    const shopItem = TREASURY_ITEM_SHOP_CONFIG[index];
    if (!shopItem) {
        player.tell(Text.red(`Invalid item index! Type /tres shop items to browse available entries.`));
        return 0;
    }

    let points = safeNum(server.persistentData.tres_points, 0);
    let totalCost = shopItem.cost * quantity;

    if (points < totalCost) {
        player.tell(Text.red(`Insufficient Royal Points! Required: ${totalCost}, Available: ${points}.`));
        return 0;
    }

    server.persistentData.tres_points = points - totalCost;

    let totalCount = shopItem.count * quantity;
    let itemStack = Item.of(shopItem.id, totalCount);

    player.give(itemStack);
    player.tell(Text.green(`Purchased ${totalCount}x ${shopItem.label} for ${totalCost} Royal Points.`));
    player.tell(Text.yellow(`Remaining Balance: ${server.persistentData.tres_points} Points.`));

    return 1;
}

function showOrderShop(ctx) {
    const player = ctx.source.player;
    const server = ctx.source.server;

    if (player.username != server.persistentData.current_king) {
        player.tell(Text.red('Only the King can view the Royal Orders!'));
        return 0;
    }

    let points = safeNum(server.persistentData.tres_points, 0);

    let shopMenu = Text.gold('=== Royal Orders ===\n')
    .append(Text.yellow(`Available Royal Points: ${points}\n`))
    .append(Text.gray('Use /tres shop orders buy <index> <target> to issue an order.\n\n'));

    for (let index in TREASURY_ORDER_SHOP_CONFIG) {
        let order = TREASURY_ORDER_SHOP_CONFIG[index];
        shopMenu.append(Text.aqua(`[#${index}] `))
        .append(Text.green(`[${order.label}] `))
        .append(Text.yellow(`- Cost: ${order.cost} Pts\n`))
        .append(Text.red(`${order.desc}\n\n`));
    }

    player.tell(shopMenu);
    return 1;
}

function handleOrderBuy(ctx, index, targetPlayer) {
    const player = ctx.source.player;
    const server = ctx.source.server;
    if (!player) return 0;

    if (player.username != server.persistentData.current_king) {
        player.tell(Text.red('Only the King can issue Royal Orders!'));
        return 0;
    }

    const order = TREASURY_ORDER_SHOP_CONFIG[index];
    if (!order) {
        player.tell(Text.red(`Invalid order index! Type /tres shop orders to browse available entries.`));
        return 0;
    }

    let points = safeNum(server.persistentData.tres_points, 0);
    if (points < order.cost) {
        player.tell(Text.red(`Insufficient Royal Points! Required: ${order.cost}, Available: ${points}.`));
        return 0;
    }

    if (order.id === 'mercenaries') {
        return executeMercenaries(player, server, targetPlayer, order.cost);
    } else if (order.id === 'doom') {
        return executeDoom(player, server, targetPlayer, order.cost);
    } else if (order.id === 'annihilation') {
        return executeAnnihilation(player, server, targetPlayer, order.cost);
    } else if (order.id === 'guards') {
        return executeGuards(player, server, targetPlayer, order.cost);
    }

    return 1;
}

// ============================================================================
//                          ORDER EXECUTION LOGIC
// ============================================================================

function executeMercenaries(player, server, target, cost) {
    let points = safeNum(server.persistentData.tres_points, 0);
    server.persistentData.tres_points = points - cost;

    server.runCommandSilent(`execute as ${target.username} at @s run playsound minecraft:entity.enderman.stare ambient @s ~ ~ ~ 1 0.5`);
    server.runCommandSilent(`execute as ${target.username} at @s run playsound minecraft:entity.warden.heartbeat master @s ~ ~ ~ 2 0.8`);

    player.tell(Text.green(`Mercenaries have been dispatched to hunt down ${target.username} for ${cost} Points.`));
    player.tell(Text.yellow(`Remaining Balance: ${server.persistentData.tres_points} Points.`));

    let targetIdStr = String(target.uuid);
    let kingIdStr = String(player.uuid);
    let targetName = target.username;

    server.scheduleInTicks(140, scheduleCtx => {
        let onlineTarget = server.getPlayer(targetIdStr);

        if (!onlineTarget) {
            let currentPoints = safeNum(server.persistentData.tres_points, 0);
            server.persistentData.tres_points = currentPoints + cost;

            let kingPlayer = server.getPlayer(kingIdStr);
            if (kingPlayer) {
                kingPlayer.tell(Text.yellow(`[!] ${targetName} fled the server before the mercenaries could reach them! ${cost} Pts have been refunded.`));
            }
            return;
        }

        let tX = onlineTarget.x;
        let tY = onlineTarget.y;
        let tZ = onlineTarget.z;
        let tDim = onlineTarget.level.dimension.toString();

        let directions = [{x: 25, z: 0}, {x: -25, z: 0}, {x: 0, z: 25}, {x: 0, z: -25}];
        let cardinalDir = directions[Math.floor(Math.random() * directions.length)];

        let spawnX = tX + cardinalDir.x;
        let spawnZ = tZ + cardinalDir.z;
        let spawnY = tY + 25;

        let numAxemen = Math.floor(Math.random() * 2) + 1;
        let numMusket = Math.floor(Math.random() * 2) + 1;
        let numPhantoms = Math.floor(Math.random() * 3) + 1;

        let raidTag = "raid_" + Date.now();
        let followAttr = `Attributes:[{Name:"generic.follow_range",Base:150.0}]`;

        let axeName = `CustomName:'{"text":"Hired Axeman","color":"dark_red","bold":true}'`;
        let musketName = `CustomName:'{"text":"Hired Musketeer","color":"gold"}'`;
        let phantomName = `CustomName:'{"text":"Hired Sky-Hunter","color":"aqua"}'`;

        for (let i = 0; i < numAxemen; i++) {
            let offsetX = (Math.random() * 10) - 5;
            let offsetZ = (Math.random() * 10) - 5;
            server.runCommandSilent(`execute in ${tDim} positioned ${spawnX + offsetX} ${spawnY} ${spawnZ + offsetZ} run summon vindicator ~ ~ ~ {Tags:["${raidTag}"], ${followAttr}, ${axeName}, HandItems:[{id:"minecraft:golden_axe",Count:1b}]}`);
        }

        for (let i = 0; i < numMusket; i++) {
            let offsetX = (Math.random() * 10) - 5;
            let offsetZ = (Math.random() * 10) - 5;
            let horseNBT = `{Tame:1b, SaddleItem:{id:"minecraft:saddle",Count:1b}, Tags:["${raidTag}"], Passengers:[{id:"minecraft:pillager", Tags:["${raidTag}"], ${followAttr}, ${musketName}, HandItems:[{id:"musketmod:pistol",Count:1b}]}]}`;

            server.runCommandSilent(`execute in ${tDim} positioned ${spawnX + offsetX} ${spawnY} ${spawnZ + offsetZ} run summon horse ~ ~ ~ ${horseNBT}`);
        }

        for (let i = 0; i < numPhantoms; i++) {
            let offsetX = (Math.random() * 16) - 8;
            let offsetZ = (Math.random() * 16) - 8;
            server.runCommandSilent(`execute in ${tDim} positioned ${spawnX + offsetX} ${spawnY + 10} ${spawnZ + offsetZ} run summon phantom ~ ~ ~ {Tags:["${raidTag}"], ${followAttr}, ${phantomName}, Size:1}`);
        }

        server.runCommandSilent(`execute in ${tDim} as @e[tag=${raidTag},type=!minecraft:phantom] run effect give @s minecraft:slow_falling 30 0 true`);
        server.runCommandSilent(`execute in ${tDim} as @e[tag=${raidTag},type=minecraft:phantom] run effect give @s minecraft:fire_resistance 120 0 true`);
        server.runCommandSilent(`effect give ${targetName} minecraft:glowing 30 0 true`);

        server.scheduleInTicks(10, aggroCtx => {
            let currentTarget = server.getPlayer(targetIdStr);
            if (currentTarget) {
                currentTarget.level.getEntities().forEach(mob => {
                    if (mob.tags.contains(raidTag)) {
                        if (typeof mob.setTarget === 'function') mob.setTarget(currentTarget);
                        else if (typeof mob.setAttackTarget === 'function') mob.setAttackTarget(currentTarget);
                    }
                });
            }
        });
    });

    return 1;
}

function executeDoom(player, server, target, cost) {
    let points = safeNum(server.persistentData.tres_points, 0);
    server.persistentData.tres_points = points - cost;

    server.runCommandSilent(`execute as ${target.username} at @s run playsound minecraft:entity.wither.spawn master @s ~ ~ ~ 1 0.5`);
    server.runCommandSilent(`execute as ${target.username} at @s run playsound minecraft:entity.ghast.warn master @s ~ ~ ~ 2 0.8`);
    server.runCommandSilent(`effect give ${target.username} minecraft:glowing 30 0 true`);

    player.tell(Text.green(`Nether Doom has been brought upon ${target.username} for ${cost} Points.`));
    player.tell(Text.yellow(`Remaining Balance: ${server.persistentData.tres_points} Points.`));

    let targetIdStr = String(target.uuid);
    let kingIdStr = String(player.uuid);
    let targetName = target.username;

    server.scheduleInTicks(140, scheduleCtx => {
        let onlineTarget = server.getPlayer(targetIdStr);

        if (!onlineTarget) {
            let currentPoints = safeNum(server.persistentData.tres_points, 0);
            server.persistentData.tres_points = currentPoints + cost;

            let kingPlayer = server.getPlayer(kingIdStr);
            if (kingPlayer) {
                kingPlayer.tell(Text.yellow(`[!] ${targetName} fled the server before doom could reach them! ${cost} Pts have been refunded.`));
            }
            return;
        }

        let tX = onlineTarget.x;
        let tY = onlineTarget.y;
        let tZ = onlineTarget.z;
        let tDim = onlineTarget.level.dimension.toString();

        let directions = [{x: 45, z: 0}, {x: -45, z: 0}, {x: 0, z: 45}, {x: 0, z: -45}];
        let cardinalDir = directions[Math.floor(Math.random() * directions.length)];

        let spawnX = tX + cardinalDir.x;
        let spawnZ = tZ + cardinalDir.z;
        let spawnY = tY + 25;

        let doomTag = "doom_" + Date.now();
        let followAttr = `Attributes:[{Name:"generic.follow_range",Base:150.0}]`;

        let ghastName = `CustomName:'{"text":"Dread-Ghast","color":"red","bold":true}'`;
        let piglinName = `CustomName:'{"text":"Nether Brute","color":"gold","bold":true}'`;
        let blazeName = `CustomName:'{"text":"Inferno","color":"gold","bold":true}'`;

        for (let i = 0; i < 2; i++) {
            let offsetX = (Math.random() * 10) - 5;
            let offsetZ = (Math.random() * 10) - 5;
            server.runCommandSilent(`execute in ${tDim} positioned ${spawnX + offsetX} ${spawnY + 10} ${spawnZ + offsetZ} run summon ghast ~ ~ ~ {Tags:["${doomTag}"], ${followAttr}, ${ghastName}}`);
        }

        for (let i = 0; i < 5; i++) {
            let offsetX = (Math.random() * 10) - 5;
            let offsetZ = (Math.random() * 10) - 5;
            server.runCommandSilent(`execute in ${tDim} positioned ${spawnX + offsetX} ${spawnY} ${spawnZ + offsetZ} run summon piglin ~ ~ ~ {Tags:["${doomTag}"], ${followAttr}, IsImmuneToZombification:1b, ${piglinName}, HandItems:[{id:"minecraft:golden_sword",Count:1b},{}]}`);
        }

        let numBlazes = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < numBlazes; i++) {
            let offsetX = (Math.random() * 6) - 3;
            let offsetZ = (Math.random() * 6) - 3;
            server.runCommandSilent(`execute in ${tDim} positioned ${spawnX + offsetX} ${spawnY} ${spawnZ + offsetZ} run summon blaze ~ ~ ~ {Tags:["${doomTag}"], ${followAttr}, ${blazeName}}`);
        }

        server.runCommandSilent(`execute in ${tDim} as @e[tag=${doomTag},type=!minecraft:ghast] run effect give @s minecraft:slow_falling 30 0 true`);
        server.runCommandSilent(`effect give ${targetName} minecraft:glowing 30 0 true`);

        server.scheduleInTicks(10, aggroCtx => {
            let currentTarget = server.getPlayer(targetIdStr);
            if (currentTarget) {
                currentTarget.level.getEntities().forEach(mob => {
                    if (mob.tags.contains(doomTag)) {
                        if (typeof mob.setTarget === 'function') mob.setTarget(currentTarget);
                        else if (typeof mob.setAttackTarget === 'function') mob.setAttackTarget(currentTarget);
                    }
                });
            }
        });
    });

    return 1;
}

function executeAnnihilation(player, server, target, cost) {
    let points = safeNum(server.persistentData.tres_points, 0);
    server.persistentData.tres_points = points - cost;

    server.runCommandSilent(`execute as ${target.username} at @s run playsound minecraft:entity.creeper.primed master @s ~ ~ ~ 3 0.5`);

    player.tell(Text.green(`Annihilation ordered on ${target.username} for ${cost} Points.`));
    player.tell(Text.yellow(`Remaining Balance: ${server.persistentData.tres_points} Points.`));

    let targetIdStr = String(target.uuid);
    let kingIdStr = String(player.uuid);
    let targetName = target.username;

    server.scheduleInTicks(140, scheduleCtx => {
        let onlineTarget = server.getPlayer(targetIdStr);

        if (!onlineTarget) {
            let currentPoints = safeNum(server.persistentData.tres_points, 0);
            server.persistentData.tres_points = currentPoints + cost;

            let kingPlayer = server.getPlayer(kingIdStr);
            if (kingPlayer) {
                kingPlayer.tell(Text.yellow(`[!] ${targetName} fled the server! ${cost} Pts have been refunded.`));
            }
            return;
        }

        let tX = onlineTarget.x;
        let tY = onlineTarget.y;
        let tZ = onlineTarget.z;
        let tDim = onlineTarget.level.dimension.toString();

        let spawnY = tY + 40;
        let annihTag = "annihilate_" + Date.now();
        let followAttr = `Attributes:[{Name:"generic.follow_range",Base:150.0}]`;
        let creeperName = `CustomName:'{"text":"Bomber","color":"green","bold":true}'`;

        let radius = 42;

        for (let i = 0; i < 70; i++) {
            let angle = (i / 70) * Math.PI * 2;
            let offsetX = Math.cos(angle) * radius;
            let offsetZ = Math.sin(angle) * radius;

            server.runCommandSilent(`execute in ${tDim} positioned ${tX + offsetX} ${spawnY} ${tZ + offsetZ} run summon creeper ~ ~ ~ {Tags:["${annihTag}"], ${followAttr}, ${creeperName}}`);
        }

        server.runCommandSilent(`execute in ${tDim} as @e[tag=${annihTag}] run effect give @s minecraft:slow_falling 30 0 true`);
        server.runCommandSilent(`effect give ${targetName} minecraft:glowing 30 0 true`);

        server.scheduleInTicks(10, aggroCtx => {
            let currentTarget = server.getPlayer(targetIdStr);
            if (currentTarget) {
                currentTarget.level.getEntities().forEach(mob => {
                    if (mob.tags.contains(annihTag)) {
                        if (typeof mob.setTarget === 'function') mob.setTarget(currentTarget);
                        else if (typeof mob.setAttackTarget === 'function') mob.setAttackTarget(currentTarget);
                    }
                });
            }
        });
    });

    return 1;
}

function executeGuards(player, server, target, cost) {
    let points = safeNum(server.persistentData.tres_points, 0);
    server.persistentData.tres_points = points - cost;

    server.runCommandSilent(`execute as ${target.username} at @s run playsound minecraft:item.horn.call master @s ~ ~ ~ 1 1.0`);

    player.tell(Text.green(`Royal Guards have been deployed to defend ${target.username} for ${cost} Points.`));
    player.tell(Text.yellow(`Remaining Balance: ${server.persistentData.tres_points} Points.`));

    let targetIdStr = String(target.uuid);
    let kingIdStr = String(player.uuid);
    let targetName = target.username;

    server.scheduleInTicks(140, scheduleCtx => {
        let onlineTarget = server.getPlayer(targetIdStr);

        if (!onlineTarget) {
            let currentPoints = safeNum(server.persistentData.tres_points, 0);
            server.persistentData.tres_points = currentPoints + cost;

            let kingPlayer = server.getPlayer(kingIdStr);
            if (kingPlayer) {
                kingPlayer.tell(Text.yellow(`[!] ${targetName} fled the server! ${cost} Pts have been refunded.`));
            }
            return;
        }

        let tX = onlineTarget.x;
        let tY = onlineTarget.y;
        let tZ = onlineTarget.z;
        let tDim = onlineTarget.level.dimension.toString();

        let guardTag = "guard_" + Date.now();
        let followAttr = `Attributes:[{Name:"generic.follow_range",Base:150.0}]`;
        let guardName = `CustomName:'{"text":"Royal Guard","color":"gray","bold":true}'`;

        // Setting drop chances to exactly 0.0f ensures the gear vanishes entirely when the mob dies
        let armorNBT = `ArmorItems:[{id:"minecraft:chainmail_boots",Count:1b},{id:"minecraft:chainmail_leggings",Count:1b},{id:"minecraft:chainmail_chestplate",Count:1b},{id:"minecraft:chainmail_helmet",Count:1b}]`;
        let handNBT = `HandItems:[{id:"musketmod:musket",Count:1b},{}]`;
        let dropChances = `ArmorDropChances:[0.0f,0.0f,0.0f,0.0f],HandDropChances:[0.0f,0.0f]`;

        // Spawn 5 Villager Guards in a tight circle directly around the player
        let radius = 3;
        for (let i = 0; i < 5; i++) {
            let angle = (i / 5) * Math.PI * 2;
            let offsetX = Math.cos(angle) * radius;
            let offsetZ = Math.sin(angle) * radius;

            server.runCommandSilent(`execute in ${tDim} positioned ${tX + offsetX} ${tY} ${tZ + offsetZ} run summon guardvillagers:guard ~ ~ ~ {Tags:["${guardTag}"], ${followAttr}, ${guardName}, ${armorNBT}, ${handNBT}, ${dropChances}}`);
        }

        server.runCommandSilent(`effect give ${targetName} minecraft:glowing 10 0 true`);
    });

    return 1;
}
