const HONOR_ITEM_SHOP_CONFIG = {
    1: { id: 'utopia:coin_diamond', count: 8, cost: 3, label: 'Diamond Coin' },
    2: { id: 'utopia:coin_iron', count: 100, cost: 1, label: 'Iron Coin' },
    3: { id: 'musketmod:musket_with_scope', count: 1, cost: 2, label: 'Scoped Musket' }
};

const HONOR_ORDER_SHOP_CONFIG = {
    1: { id: 'mercenaries', cost: 6, label: 'Mercenaries', desc: 'Dispatch a paratrooper raid party of Axemen and Mounted Musketeers from a cardinal direction.' },
    2: { id: 'doom', cost: 12, label: 'Doom', desc: 'Deploys a Nether squad of Piglins, Ghasts, and Blazes from afar.' },
    3: { id: 'annihilation', cost: 25, label: 'Annihilation', desc: 'Illuminates the target and surrounds them from afar with 70 Creepers.' },
    4: { id: 'guards', cost: 8, label: 'Royal Guards', desc: 'Deploys a squad of 5 armed Villager Guards around the target to defend them.' }
};

// ============================================================================
//                          COMMAND REGISTRY
// ============================================================================
ServerEvents.commandRegistry(event => {
    const { commands: C, arguments: A } = event;

    event.register(C.literal('honor')
    .executes(ctx => showHonorInfo(ctx))
    .then(C.literal('list').executes(ctx => showHonorList(ctx)))
    .then(C.literal('item')
    .executes(ctx => showItemShop(ctx))
    .then(C.argument('index', A.INTEGER.create(event))
    .executes(ctx => handleItemBuy(ctx, A.INTEGER.getResult(ctx, 'index'), 1))
    .then(C.argument('quantity', A.INTEGER.create(event))
    .executes(ctx => handleItemBuy(ctx, A.INTEGER.getResult(ctx, 'index'), A.INTEGER.getResult(ctx, 'quantity')))
    )
    )
    )
    .then(C.literal('order')
    .executes(ctx => showOrderShop(ctx))
    .then(C.argument('index', A.INTEGER.create(event))
    .then(C.argument('target', A.STRING.create(event))
    .executes(ctx => handleOrderBuy(ctx, A.INTEGER.getResult(ctx, 'index'), A.STRING.getResult(ctx, 'target')))
    )
    )
    )
    );
});

// ============================================================================
//                          MENU HANDLERS
// ============================================================================
function showHonorInfo(ctx) {
    const player = ctx.source.player;
    let points = safeNum(player.persistentData.honor_points, 0);

    player.tell(Text.gold('=== Personal Honor ===\n')
    .append(Text.yellow(`Current Balance: ${points} Pts\n\n`))
    .append(Text.gray('Earn Honor Points by levelling up the Treasury as King.\n'))
    .append(Text.gray('Use ')).append(Text.aqua('/honor item')).append(Text.gray(' or ')).append(Text.aqua('/honor order')).append(Text.gray(' to view rewards.\n'))
    .append(Text.gray('Use ')).append(Text.aqua('/honor list')).append(Text.gray(' to view the top contributors.'))
    );
    return 1;
}

function showItemShop(ctx) {
    const player = ctx.source.player;
    let points = safeNum(player.persistentData.honor_points, 0);

    let shopMenu = Text.gold('=== Honor Item Shop ===\n')
    .append(Text.yellow(`Your Honor Points: ${points}\n\n`))
    .append(Text.gray('Buy: /honor item <index> [quantity]\n'));

    for (let index in HONOR_ITEM_SHOP_CONFIG) {
        let shopItem = HONOR_ITEM_SHOP_CONFIG[index];
        shopMenu.append(Text.aqua(`[#${index}] `))
        .append(Text.green(`${shopItem.label} `))
        .append(Text.gray(`(x${shopItem.count}) `))
        .append(Text.yellow(`- Cost: ${shopItem.cost} Pts\n`));
    }

    player.tell(shopMenu);
    return 1;
}

function showOrderShop(ctx) {
    const player = ctx.source.player;
    let points = safeNum(player.persistentData.honor_points, 0);

    let shopMenu = Text.gold('=== Honor Order Shop ===\n')
    .append(Text.yellow(`Your Honor Points: ${points}\n\n`))
    .append(Text.gray('Buy: /honor order <index> <target>\n'));

    for (let index in HONOR_ORDER_SHOP_CONFIG) {
        let order = HONOR_ORDER_SHOP_CONFIG[index];
        shopMenu.append(Text.aqua(`[#${index}] `))
        .append(Text.green(`[${order.label}] `))
        .append(Text.yellow(`- Cost: ${order.cost} Pts\n`))
        .append(Text.red(`${order.desc}\n\n`));
    }

    player.tell(shopMenu);
    return 1;
}

function showHonorList(ctx) {
    const player = ctx.source.player;
    const server = ctx.source.server;

    // Direct read using helper, purely relies on Username keys
    let balances = readJSON(server, 'honor_balances', {});

    let sorted = Object.keys(balances).map(k => {
        return { name: k, points: balances[k] };
    }).sort((a, b) => b.points - a.points);

    let listMenu = Text.gold('=== Highest Honor ===\n');

    if (sorted.length === 0) {
        listMenu.append(Text.gray('No honor has been recorded yet.'));
    } else {
        let limit = Math.min(5, sorted.length);
        for (let i = 0; i < limit; i++) {
            let color = i === 0 ? 'gold' : (i === 1 ? 'gray' : (i === 2 ? 'red' : 'yellow'));
            listMenu.append(Text.of(`#${i+1} `).color(color))
            .append(Text.white(`${sorted[i].name} `))
            .append(Text.gray(`- ${sorted[i].points} Pts\n`));
        }
    }

    player.tell(listMenu);
    return 1;
}

// ============================================================================
//                          BUY HANDLERS
// ============================================================================
function handleItemBuy(ctx, index, quantity) {
    const player = ctx.source.player;
    const server = ctx.source.server;
    if (!player) return 0;

    if (quantity <= 0) {
        player.tell(Text.red('Quantity must be greater than 0!'));
        return 0;
    }

    const shopItem = HONOR_ITEM_SHOP_CONFIG[index];
    if (!shopItem) {
        player.tell(Text.red(`Invalid item index! Type /honor shop to browse available entries.`));
        return 0;
    }

    let points = safeNum(player.persistentData.honor_points, 0);
    let totalCost = shopItem.cost * quantity;

    if (points < totalCost) {
        player.tell(Text.red(`Insufficient Honor Points! Required: ${totalCost}, You Have: ${points}.`));
        return 0;
    }

    let newBalance = points - totalCost;
    player.persistentData.honor_points = newBalance;

    updateHonorLedger(server, player.username, newBalance);

    let totalCount = shopItem.count * quantity;
    let itemStack = Item.of(shopItem.id, totalCount);

    player.give(itemStack);
    player.tell(Text.green(`Purchased ${totalCount}x ${shopItem.label} for ${totalCost} Honor Points.`));
    player.tell(Text.yellow(`Your New Balance: ${player.persistentData.honor_points} Points.`));

    return 1;
}

function handleOrderBuy(ctx, index, targetNameStr) {
    const player = ctx.source.player;
    const server = ctx.source.server;
    if (!player) return 0;

    const order = HONOR_ORDER_SHOP_CONFIG[index];
    if (!order) {
        player.tell(Text.red(`Invalid order index! Type /honor order to browse available entries.`));
        return 0;
    }

    let points = safeNum(player.persistentData.honor_points, 0);
    if (points < order.cost) {
        player.tell(Text.red(`Insufficient Honor Points! Required: ${order.cost}, You Have: ${points}.`));
        return 0;
    }

    // Direct Online Player resolution via Username
    let onlineTarget = server.players.find(p => p.username.toLowerCase() === String(targetNameStr).toLowerCase());
    if (!onlineTarget) {
        player.tell(Text.red(`Could not locate a player named "${targetNameStr}" online.`));
        return 0;
    }

    if (order.id === 'mercenaries') {
        return executeMercenaries(player, server, onlineTarget, order.cost);
    } else if (order.id === 'doom') {
        return executeDoom(player, server, onlineTarget, order.cost);
    } else if (order.id === 'annihilation') {
        return executeAnnihilation(player, server, onlineTarget, order.cost);
    } else if (order.id === 'guards') {
        return executeGuards(player, server, onlineTarget, order.cost);
    }

    return 1;
}

// ============================================================================
//                          ORDER EXECUTION LOGIC
// ============================================================================

function refundBuyer(server, buyerName, cost, targetName) {
    let buyerPlayer = server.players.find(p => p.username === buyerName);
    if (buyerPlayer) {
        let currentPoints = safeNum(buyerPlayer.persistentData.honor_points, 0);
        let refundedBalance = currentPoints + cost;
        buyerPlayer.persistentData.honor_points = refundedBalance;
        updateHonorLedger(server, buyerName, refundedBalance);
        buyerPlayer.tell(Text.yellow(`[!] ${targetName} fled the server! ${cost} Pts have been refunded to your account.`));
    } else {
        // Global refund if buyer logged off before the hit could connect
        let balances = readJSON(server, 'honor_balances', {});
        balances[buyerName] = safeNum(balances[buyerName], 0) + cost;
        writeJSON(server, 'honor_balances', balances);
    }
}

function executeMercenaries(player, server, onlineTarget, cost) {
    let points = safeNum(player.persistentData.honor_points, 0);
    let newBalance = points - cost;
    player.persistentData.honor_points = newBalance;
    updateHonorLedger(server, player.username, newBalance);

    server.runCommandSilent(`execute as ${onlineTarget.username} at @s run playsound minecraft:entity.enderman.stare ambient @s ~ ~ ~ 1 0.5`);
    server.runCommandSilent(`execute as ${onlineTarget.username} at @s run playsound minecraft:entity.warden.heartbeat master @s ~ ~ ~ 2 0.8`);

    player.tell(Text.green(`Mercenaries have been dispatched to hunt down ${onlineTarget.username} for ${cost} Points.`));
    player.tell(Text.yellow(`Your New Balance: ${player.persistentData.honor_points} Points.`));

    let buyerName = player.username;
    let targetName = onlineTarget.username;

    server.scheduleInTicks(140, scheduleCtx => {
        let currentTarget = server.players.find(p => p.username === targetName);
        if (!currentTarget) return refundBuyer(server, buyerName, cost, targetName);

        let tX = currentTarget.x;
        let tY = currentTarget.y;
        let tZ = currentTarget.z;
        let tDim = currentTarget.level.dimension.toString();

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
            let horseNBT = `{Tame:1b, Health:14.0f, Attributes:[{Name:"generic.max_health",Base:14.0}], Tags:["${raidTag}"], Passengers:[{id:"minecraft:pillager", Tags:["${raidTag}"], ${followAttr}, ${musketName}, HandItems:[{id:"musketmod:pistol",Count:1b}]}]}`;
            server.runCommandSilent(`execute in ${tDim} positioned ${spawnX + offsetX} ${spawnY} ${spawnZ + offsetZ} run summon horse ~ ~ ~ ${horseNBT}`);
        }

        for (let i = 0; i < numPhantoms; i++) {
            let offsetX = (Math.random() * 16) - 8;
            let offsetZ = (Math.random() * 16) - 8;
            server.runCommandSilent(`execute in ${tDim} positioned ${spawnX + offsetX} ${spawnY + 10} ${spawnZ + offsetZ} run summon phantom ~ ~ ~ {Tags:["${raidTag}"], ${followAttr}, ${phantomName}, Size:1}`);
        }

        server.runCommandSilent(`execute in ${tDim} as @e[tag=${raidTag},type=!minecraft:phantom] run effect give @s minecraft:slow_falling 30 0 true`);
        server.runCommandSilent(`execute in ${tDim} as @e[tag=${raidTag},type=minecraft:phantom] run effect give @s minecraft:fire_resistance 120 0 true`);
        server.runCommandSilent(`effect give ${currentTarget.username} minecraft:glowing 30 0 true`);

        server.scheduleInTicks(10, aggroCtx => {
            let lateTarget = server.players.find(p => p.username === targetName);
            if (lateTarget) {
                lateTarget.level.getEntities().forEach(mob => {
                    if (mob.tags.contains(raidTag)) {
                        if (typeof mob.setTarget === 'function') mob.setTarget(lateTarget);
                        else if (typeof mob.setAttackTarget === 'function') mob.setAttackTarget(lateTarget);
                    }
                });
            }
        });
    });

    return 1;
}

function executeDoom(player, server, onlineTarget, cost) {
    let points = safeNum(player.persistentData.honor_points, 0);
    let newBalance = points - cost;
    player.persistentData.honor_points = newBalance;
    updateHonorLedger(server, player.username, newBalance);

    server.runCommandSilent(`execute as ${onlineTarget.username} at @s run playsound minecraft:entity.wither.spawn master @s ~ ~ ~ 1 0.5`);
    server.runCommandSilent(`execute as ${onlineTarget.username} at @s run playsound minecraft:entity.ghast.warn master @s ~ ~ ~ 2 0.8`);
    server.runCommandSilent(`effect give ${onlineTarget.username} minecraft:glowing 30 0 true`);

    player.tell(Text.green(`Nether Doom has been brought upon ${onlineTarget.username} for ${cost} Points.`));
    player.tell(Text.yellow(`Your New Balance: ${player.persistentData.honor_points} Points.`));

    let buyerName = player.username;
    let targetName = onlineTarget.username;

    server.scheduleInTicks(140, scheduleCtx => {
        let currentTarget = server.players.find(p => p.username === targetName);
        if (!currentTarget) return refundBuyer(server, buyerName, cost, targetName);

        let tX = currentTarget.x;
        let tY = currentTarget.y;
        let tZ = currentTarget.z;
        let tDim = currentTarget.level.dimension.toString();

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
        server.runCommandSilent(`effect give ${currentTarget.username} minecraft:glowing 30 0 true`);

        server.scheduleInTicks(10, aggroCtx => {
            let lateTarget = server.players.find(p => p.username === targetName);
            if (lateTarget) {
                lateTarget.level.getEntities().forEach(mob => {
                    if (mob.tags.contains(doomTag)) {
                        if (typeof mob.setTarget === 'function') mob.setTarget(lateTarget);
                        else if (typeof mob.setAttackTarget === 'function') mob.setAttackTarget(lateTarget);
                    }
                });
            }
        });
    });

    return 1;
}

function executeAnnihilation(player, server, onlineTarget, cost) {
    let points = safeNum(player.persistentData.honor_points, 0);
    let newBalance = points - cost;
    player.persistentData.honor_points = newBalance;
    updateHonorLedger(server, player.username, newBalance);

    server.runCommandSilent(`execute as ${onlineTarget.username} at @s run playsound minecraft:entity.creeper.primed master @s ~ ~ ~ 3 0.5`);
    player.tell(Text.green(`Annihilation ordered on ${onlineTarget.username} for ${cost} Points.`));
    player.tell(Text.yellow(`Your New Balance: ${player.persistentData.honor_points} Points.`));

    let buyerName = player.username;
    let targetName = onlineTarget.username;

    server.scheduleInTicks(140, scheduleCtx => {
        let currentTarget = server.players.find(p => p.username === targetName);
        if (!currentTarget) return refundBuyer(server, buyerName, cost, targetName);

        let tX = currentTarget.x;
        let tY = currentTarget.y;
        let tZ = currentTarget.z;
        let tDim = currentTarget.level.dimension.toString();

        let spawnY = tY + 40;
        let annihTag = "annihilate_" + Date.now();
        let followAttr = `Attributes:[{Name:"generic.follow_range",Base:150.0}]`;
        let creeperName = `CustomName:'{"text":"Bomber","color":"green","bold":true}'`;

        let radius = 42;
        let numCreepers = 18;
        let startAngle = Math.random() * (Math.PI * 2);

        for (let i = 0; i < numCreepers; i++) {
            let angle = startAngle + ((i / numCreepers) * (Math.PI / 2));
            let offsetX = Math.cos(angle) * radius;
            let offsetZ = Math.sin(angle) * radius;

            server.runCommandSilent(`execute in ${tDim} positioned ${tX + offsetX} ${spawnY} ${tZ + offsetZ} run summon creeper ~ ~ ~ {Tags:["${annihTag}"], ${followAttr}, ${creeperName}}`);
        }

        server.runCommandSilent(`execute in ${tDim} as @e[tag=${annihTag}] run effect give @s minecraft:slow_falling 30 0 true`);
        server.runCommandSilent(`effect give ${currentTarget.username} minecraft:glowing 30 0 true`);

        server.scheduleInTicks(10, aggroCtx => {
            let lateTarget = server.players.find(p => p.username === targetName);
            if (lateTarget) {
                lateTarget.level.getEntities().forEach(mob => {
                    if (mob.tags.contains(annihTag)) {
                        if (typeof mob.setTarget === 'function') mob.setTarget(lateTarget);
                        else if (typeof mob.setAttackTarget === 'function') mob.setAttackTarget(lateTarget);
                    }
                });
            }
        });
    });

    return 1;
}

function executeGuards(player, server, onlineTarget, cost) {
    let points = safeNum(player.persistentData.honor_points, 0);
    let newBalance = points - cost;
    player.persistentData.honor_points = newBalance;
    updateHonorLedger(server, player.username, newBalance);

    server.runCommandSilent(`execute as ${onlineTarget.username} at @s run playsound minecraft:item.goat_horn.play master @s ~ ~ ~ 1 1.0`);
    player.tell(Text.green(`Royal Guards have been deployed to defend ${onlineTarget.username} for ${cost} Points.`));
    player.tell(Text.yellow(`Your New Balance: ${player.persistentData.honor_points} Points.`));

    let buyerName = player.username;
    let targetName = onlineTarget.username;

    server.scheduleInTicks(140, scheduleCtx => {
        let currentTarget = server.players.find(p => p.username === targetName);
        if (!currentTarget) return refundBuyer(server, buyerName, cost, targetName);

        let tX = currentTarget.x;
        let tY = currentTarget.y;
        let tZ = currentTarget.z;
        let tDim = currentTarget.level.dimension.toString();

        let guardTag = "guard_" + Date.now();
        let followAttr = `Attributes:[{Name:"generic.follow_range",Base:150.0}]`;
        let guardName = `CustomName:'{"text":"Royal Guard","color":"gray","bold":true}'`;

        let armorNBT = `ArmorItems:[{id:"minecraft:chainmail_boots",Count:1b},{id:"minecraft:chainmail_leggings",Count:1b},{id:"minecraft:chainmail_chestplate",Count:1b},{id:"minecraft:chainmail_helmet",Count:1b}]`;
        let handNBT = `HandItems:[{id:"musketmod:musket",Count:1b},{}]`;
        let dropChances = `ArmorDropChances:[0.0f,0.0f,0.0f,0.0f],HandDropChances:[0.0f,0.0f]`;

        let radius = 3;
        for (let i = 0; i < 5; i++) {
            let angle = (i / 5) * Math.PI * 2;
            let offsetX = Math.cos(angle) * radius;
            let offsetZ = Math.sin(angle) * radius;

            server.runCommandSilent(`execute in ${tDim} positioned ${tX + offsetX} ${tY} ${tZ + offsetZ} run summon guardvillagers:guard ~ ~ ~ {Tags:["${guardTag}"], ${followAttr}, ${guardName}, ${armorNBT}, ${handNBT}, ${dropChances}}`);
        }

        server.runCommandSilent(`effect give ${currentTarget.username} minecraft:glowing 10 0 true`);
    });

    return 1;
}
