// ============================================================================
//                         DATA-DRIVEN CONFIGURATION
// ============================================================================
const TREASURY_CONFIG = {
    currencies: {
        'utopia:bills_netherite': { rsd: 100, label: 'Netherite Bill' },
        'utopia:bills_netherite_slip': { rsd: 50, label: 'Netherite Slip' },
        'utopia:coin_diamond': { rsd: 20, label: 'Diamond Coin' },
        'utopia:coin_diamond_fractional': { rsd: 10, label: 'Diamond Fractional' },
        'utopia:coin_iron': { rsd: 2, label: 'Iron Coin' },
        'utopia:coin_iron_fractional': { rsd: 1, label: 'Iron Fractional' }
    },
    upgrades: {
        'minecraft:emerald': { xp: 1, label: 'Emerald' },
        'minecraft:gold_ingot': { xp: 2, label: 'Gold Ingot' }
    },
    stamps: {
        'encoders': { id: 'utopia:encoder_stamp', defaultMax: 20, growthPerLevel: 100 },
        'decoders': { id: 'utopia:decoder_stamp', defaultMax: 10, growthPerLevel: 10 }
    }
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

function logAudit(server, category, msg) {
    let key = 'tres_audit_v2_' + category;
    let arr = [];

    if (server.persistentData.contains(key)) {
        try {
            arr = JSON.parse(server.persistentData.getString(key));
        } catch (e) {
            arr = [];
        }
    }

    const d = new Date();
    const pad = (n) => n < 10 ? '0' + n : n;
    const timestamp = `${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;

    arr.push(`[${timestamp}] ${msg}`);

    if (arr.length > 10) arr.shift();

    server.persistentData.putString(key, JSON.stringify(arr));
}

// ============================================================================

ServerEvents.loaded(event => {
    const { server } = event;

    if (server.persistentData.tres_initialized == null) {
        server.persistentData.tres_level = 1;
        server.persistentData.tres_exp = 0;
        server.persistentData.tres_points = 0;

        server.persistentData.tres_maxEncoders = TREASURY_CONFIG.stamps.encoders.defaultMax;
        server.persistentData.tres_encoders = TREASURY_CONFIG.stamps.encoders.defaultMax;

        server.persistentData.tres_maxDecoders = TREASURY_CONFIG.stamps.decoders.defaultMax;
        server.persistentData.tres_decoders = TREASURY_CONFIG.stamps.decoders.defaultMax;

        server.persistentData.tres_initialized = true;
    }

    if (server.persistentData.treasury) {
        server.persistentData.remove('treasury');
    }
});

ServerEvents.commandRegistry(event => {
    const { commands: C, arguments: A } = event;

    const buildEquipNode = (nodeName, type) => {
        return C.literal(nodeName)
        .then(C.literal('add').then(C.argument('amt', A.INTEGER.create(event))
        .executes(ctx => handleEquip(ctx, type, A.INTEGER.getResult(ctx, 'amt')))))
        .then(C.literal('remove').then(C.argument('amt', A.INTEGER.create(event))
        .executes(ctx => handleEquip(ctx, type, -A.INTEGER.getResult(ctx, 'amt')))));
    };

    const registerTreasuryTree = (baseCommandName) => {
        event.register(C.literal(baseCommandName)
        .executes(ctx => showLevelInfo(ctx))
        .then(C.literal('stamp')
        .executes(ctx => showStampInfo(ctx))
        .then(buildEquipNode('encoder', 'encoders'))
        .then(buildEquipNode('decoder', 'decoders'))
        // This is the correct structure for the resolve command
        .then(C.literal('resolve')
        .executes(ctx => handleResolve(ctx, null))
        .then(C.argument('target', A.PLAYER.create(event))
        .executes(ctx => handleResolve(ctx, A.PLAYER.getResult(ctx, 'target'))))
        )
        )
        .then(C.literal('level')
        .executes(ctx => showLevelInfo(ctx))
        .then(C.literal('add').executes(ctx => handleDeposit(ctx)))
        )
        .then(C.literal('audit')
        .then(C.literal('latest')
        .then(C.literal('exp').executes(ctx => showAudit(ctx, 'exp')))
        .then(C.literal('stamp').executes(ctx => showAudit(ctx, 'stamps')))
        )
        .then(C.literal('ledger')
        .then(C.literal('exp').executes(ctx => showExpLedger(ctx)))
        .then(C.literal('stamp').executes(ctx => showStampLedger(ctx)))
        )
        )
        .then(C.literal('admin')
        .requires(src => src.hasPermission(4))
        .then(C.literal('reset').executes(ctx => handleAdminReset(ctx)))
        )
        );
    };

    registerTreasuryTree('treasury');
    registerTreasuryTree('tres');
});

// --- Core Handlers ---

function showStampInfo(ctx) {
    const player = ctx.source.player;
    const server = ctx.source.server;

    let enc = safeNum(server.persistentData.tres_encoders, 0);
    let maxEnc = safeNum(server.persistentData.tres_maxEncoders, TREASURY_CONFIG.stamps.encoders.defaultMax);
    let dec = safeNum(server.persistentData.tres_decoders, 0);
    let maxDec = safeNum(server.persistentData.tres_maxDecoders, TREASURY_CONFIG.stamps.decoders.defaultMax);

    player.tell(Text.gold('--- Treasury Stamp Vault ---'));
    player.tell(Text.yellow(`Encoders: ${enc}/${maxEnc}`));
    player.tell(Text.yellow(`Decoders: ${dec}/${maxDec}`));
    return 1;
}

function showLevelInfo(ctx) {
    const player = ctx.source.player;
    const server = ctx.source.server;

    for (let i = 0; i < 100; i++) { player.tell(' '); }

    // Standard JS parseInt() natively stops at decimals or letters (e.g., "1.0d1" becomes 1)
    let lvl = parseInt(server.persistentData.tres_level) || 1;
    let exp = parseInt(server.persistentData.tres_exp) || 0;
    let points = parseInt(server.persistentData.tres_points) || 0;
    let enc = parseInt(server.persistentData.tres_encoders) || 0;
    let dec = parseInt(server.persistentData.tres_decoders) || 0;

    let maxEncDefault = typeof TREASURY_CONFIG !== 'undefined' ? TREASURY_CONFIG.stamps.encoders.defaultMax : 20;
    let maxDecDefault = typeof TREASURY_CONFIG !== 'undefined' ? TREASURY_CONFIG.stamps.decoders.defaultMax : 10;

    let maxEnc = parseInt(server.persistentData.tres_maxEncoders) || maxEncDefault;
    let maxDec = parseInt(server.persistentData.tres_maxDecoders) || maxDecDefault;

    let expIntoLevel = exp % 100;
    let percentage = expIntoLevel / 100;

    let totalSegments = 20;
    let filledSegments = Math.floor(percentage * totalSegments);
    let emptySegments = totalSegments - filledSegments;

    let filledBar = '|'.repeat(Math.max(0, filledSegments));
    let emptyBar = '|'.repeat(Math.max(0, emptySegments));

    let screen = Text.gold('=== ' ).append(Text.white('Kingdom Treasury Status').bold()).append(Text.gold(' ===\n\n'));
    screen.append(Text.yellow('• Current Level: ').append(Text.white(lvl).green().bold()));
    screen.append(Text.white('\n  [')).append(Text.green(filledBar).bold()).append(Text.gray(emptyBar)).append(Text.white('] '));
    screen.append(Text.aqua(Math.floor(percentage * 100) + '% ')).append(Text.gray(`(${expIntoLevel}/100 to Lv.${lvl + 1})`));
    screen.append(Text.yellow('\n\n• Total Experience: ').append(Text.white(exp)));
    screen.append(Text.yellow('\n• Royal Points: ').append(Text.white(points).gold()));
    screen.append(Text.gold('\n\n--- Stamp Vault ---'));
    screen.append(Text.yellow('\n• Encoders: ').append(Text.white(`${enc}/${maxEnc}`)));
    screen.append(Text.yellow('\n• Decoders: ').append(Text.white(`${dec}/${maxDec}`)));

    player.tell(screen);
    return 1;
}

function handleDeposit(ctx) {
    const player = ctx.source.player;
    const server = ctx.source.server;
    const item = player.mainHandItem;

    const upgradeData = TREASURY_CONFIG.upgrades[item.id];
    if (!upgradeData) {
        if (TREASURY_CONFIG.currencies[item.id]) {
            player.tell(Text.red('Circulating currency cannot be used to upgrade the Treasury! Use Gold or Emeralds.'));
            return 0;
        }
        player.tell(Text.red('Invalid upgrade fuel! Hold Gold Ingots or Emeralds.'));
        return 0;
    }

    const value = upgradeData.xp;
    const amt = item.count;
    const gain = value * amt;

    let currentExp = safeNum(server.persistentData.tres_exp, 0);
    let currentLevel = safeNum(server.persistentData.tres_level, 1);

    currentExp += gain;
    server.persistentData.tres_exp = currentExp;

    // --- JSON EXP LEDGER TRACKING ---
    let expLedger = {};
    if (server.persistentData.contains('tres_exp_ledger')) {
        try {
            expLedger = JSON.parse(server.persistentData.getString('tres_exp_ledger'));
        } catch(e) { }
    }
    expLedger[player.username] = (expLedger[player.username] || 0) + gain;
    server.persistentData.putString('tres_exp_ledger', JSON.stringify(expLedger));
    // --------------------------------

    let cleanItemName = String(item.id).split(':').pop();
    logAudit(server, 'exp', `${player.username} dep ${amt} ${cleanItemName}`);

    item.shrink(amt);

    let leveledUp = false;
    let pointsGained = 0;

    while (currentExp >= currentLevel * 100) {
        currentLevel++;
        pointsGained += 5;
        leveledUp = true;

        let newMaxEncoders = safeNum(server.persistentData.tres_maxEncoders, TREASURY_CONFIG.stamps.encoders.defaultMax) + TREASURY_CONFIG.stamps.encoders.growthPerLevel;
        let newMaxDecoders = safeNum(server.persistentData.tres_maxDecoders, TREASURY_CONFIG.stamps.decoders.defaultMax) + TREASURY_CONFIG.stamps.decoders.growthPerLevel;

        server.persistentData.tres_maxEncoders = newMaxEncoders;
        server.persistentData.tres_maxDecoders = newMaxDecoders;
    }

    if (leveledUp) {
        server.persistentData.tres_level = currentLevel;
        server.persistentData.tres_points = safeNum(server.persistentData.tres_points, 0) + pointsGained;
        server.runCommandSilent(`tellraw @a {"text":"Treasury leveled up to ${currentLevel}! Capacity increased. (Total Vault EXP: ${currentExp})","color":"gold"}`);
    } else {
        player.tell(Text.green(`Deposited successfully (+${gain} EXP). Vault holds ${currentExp} Total EXP.`));
    }

    return showLevelInfo(ctx);
}

function handleEquip(ctx, type, amt) {
    const player = ctx.source.player;
    const server = ctx.source.server;

    if (amt === 0) {
        player.tell(Text.red('You cannot deposit or withdraw 0 stamps!'));
        return 0;
    }

    const isAdding = amt > 0;
    const absAmt = Math.abs(amt);

    const stampConfig = TREASURY_CONFIG.stamps[type];
    const itemId = stampConfig.id;

    let currentAmt = safeNum(server.persistentData['tres_' + type], 0);
    let maxStr = type === 'encoders' ? 'tres_maxEncoders' : 'tres_maxDecoders';
    let max = safeNum(server.persistentData[maxStr], stampConfig.defaultMax);

    if (!isAdding && player.username != server.persistentData.current_king) {
        player.tell(Text.red('Only the King can remove equipment from the Treasury!'));
        return 0;
    }

    if (isAdding && currentAmt + absAmt > max) {
        player.tell(Text.red(`The Treasury cannot hold that many! Vault capacity for ${type} is ${currentAmt}/${max}.`));
        return 0;
    }
    if (!isAdding && currentAmt - absAmt < 0) {
        player.tell(Text.red(`The Treasury doesn't have enough! Only ${currentAmt} available.`));
        return 0;
    }

    if (isAdding) {
        if (player.mainHandItem.id !== itemId) {
            player.tell(Text.red(`You must hold the physical stamp (${itemId}) in your hand to vault it!`));
            return 0;
        }
        if (player.mainHandItem.count < absAmt) {
            player.tell(Text.red(`You don't have enough stamps in your hand! You need ${absAmt}.`));
            return 0;
        }
        player.mainHandItem.shrink(absAmt);
    } else {
        player.give(Item.of(itemId, absAmt));
    }

    server.persistentData['tres_' + type] = currentAmt + amt;

    // --- JSON STAMP LEDGER TRACKING ---
    let ledger = {};
    if (server.persistentData.contains('tres_ledger')) {
        try {
            ledger = JSON.parse(server.persistentData.getString('tres_ledger'));
        } catch(e) { }
    }

    if (!ledger[player.username]) ledger[player.username] = { encoders: 0, decoders: 0 };

    if (isAdding) {
        ledger[player.username][type] -= absAmt; // Allows negative balance if player deposits more than withdrawn
    } else {
        ledger[player.username][type] += absAmt;
    }

    server.persistentData.putString('tres_ledger', JSON.stringify(ledger));
    // ----------------------------------

    const actionStr = isAdding ? 'dep' : 'with';
    logAudit(server, 'stamps', `${player.username} ${actionStr} ${absAmt} ${type}`);

    player.tell(Text.green(`Successfully ${isAdding ? 'deposited' : 'withdrawn'} ${absAmt} ${type}. Vault Balance: ${currentAmt + amt}/${max}`));

    return 1;
}

function handleResolve(ctx, target) {
    const player = ctx.source.player;
    const server = ctx.source.server;

    // --- NEW: Informational help when no target is provided ---
    if (!target) {
        player.tell(Text.gold('\n\n--- Stamp Resolution System ---'));
        player.tell(Text.white('Use this command to fix ledger discrepancies after trading stamps.'));
        player.tell(Text.yellow('Usage: ').append(Text.white('/tres stamp resolve <player>')));
        player.tell(Text.gray('If you and another player have opposing debts (one positive, one negative), this will automatically move them toward zero, clearing your names with the Kingdom. This can be done as part of a deal or in exchange for good will.'));
        return 1;
    }




    if (player.username === target.username) {
        player.tell(Text.red('You cannot resolve your ledger with yourself.'));
        return 0;
    }

    if (!server.persistentData.contains('tres_ledger')) {
        player.tell(Text.red('No stamps are currently tracked in the ledger.'));
        return 0;
    }

    let ledger = {};
    try {
        ledger = JSON.parse(server.persistentData.getString('tres_ledger'));
    } catch(e) {
        player.tell(Text.red('[!] Ledger data corrupted. Fuck.'));
        return 0;
    }

    let pData = ledger[player.username] || { encoders: 0, decoders: 0 };
    let tData = ledger[target.username] || { encoders: 0, decoders: 0 };

    if (pData.encoders >= 0 && pData.decoders >= 0) {
        player.tell(Text.red('You cannot absolve a deficit unless you have given stamps.'));
        return 0;
    }

    let resEnc = 0;
    let resDec = 0;

    // Resolve Encoders
    if (pData.encoders > 0 && tData.encoders < 0) {
        resEnc = Math.min(pData.encoders, Math.abs(tData.encoders));
        pData.encoders -= resEnc;
        tData.encoders += resEnc;
    } else if (pData.encoders < 0 && tData.encoders > 0) {
        resEnc = Math.min(Math.abs(pData.encoders), tData.encoders);
        pData.encoders += resEnc;
        tData.encoders -= resEnc;
    }

    // Resolve Decoders
    if (pData.decoders > 0 && tData.decoders < 0) {
        resDec = Math.min(pData.decoders, Math.abs(tData.decoders));
        pData.decoders -= resDec;
        tData.decoders += resDec;
    } else if (pData.decoders < 0 && tData.decoders > 0) {
        resDec = Math.min(Math.abs(pData.decoders), tData.decoders);
        pData.decoders += resDec;
        tData.decoders -= resDec;
    }

    if (resEnc === 0 && resDec === 0) {
        player.tell(Text.red(`You and ${target.username} do not have opposing ledger balances to resolve.`));
        return 0;
    }

    ledger[player.username] = pData;
    ledger[target.username] = tData;

    server.persistentData.putString('tres_ledger', JSON.stringify(ledger));

    let msgParts = [];
    if (resEnc > 0) msgParts.push(`${resEnc} Encoders`);
    if (resDec > 0) msgParts.push(`${resDec} Decoders`);
    let msgStr = msgParts.join(' and ');

    player.tell(Text.green(`Successfully resolved ${msgStr} with ${target.username}.`));
    target.tell(Text.green(`${player.username} has resolved ${msgStr} between your ledgers.`));

    logAudit(server, 'stamps', `${player.username} & ${target.username} resolved ${msgStr}`);
    return 1;
}

function showExpLedger(ctx) {
    const player = ctx.source.player;
    const server = ctx.source.server;

    player.tell(Text.gold('\n\n--- Treasury EXP Ledger ---'));

    if (!server.persistentData.contains('tres_exp_ledger')) {
        player.tell(Text.gray('No EXP has been deposited yet.'));
        return 1;
    }

    let ledger = {};
    try {
        ledger = JSON.parse(server.persistentData.getString('tres_exp_ledger'));
    } catch(e) {
        player.tell(Text.red('Ledger data corrupted.'));
        return 0;
    }

    let anythingTracked = false;
    let sortedUsers = Object.keys(ledger).sort((a, b) => ledger[b] - ledger[a]);

    for (let user of sortedUsers) {
        let exp = ledger[user] || 0;
        if (exp > 0) {
            anythingTracked = true;
            player.tell(Text.yellow(`- ${user} lifetime contribution: `).append(Text.white(`${exp} EXP`)));
        }
    }

    if (!anythingTracked) {
        player.tell(Text.gray('No EXP has been deposited yet.'));
    }

    return 1;
}

function showStampLedger(ctx) {
    const player = ctx.source.player;
    const server = ctx.source.server;

    player.tell(Text.gold('\n\n--- Treasury Stamp Ledger ---'));

    if (!server.persistentData.contains('tres_ledger')) {
        player.tell(Text.gray('No stamps are currently tracked in the ledger.'));
        return 1;
    }

    let ledger = {};
    try {
        ledger = JSON.parse(server.persistentData.getString('tres_ledger'));
    } catch(e) {
        player.tell(Text.red('Ledger data corrupted.'));
        return 0;
    }

    let anythingTracked = false;
    for (let user in ledger) {
        let enc = ledger[user].encoders || 0;
        let dec = ledger[user].decoders || 0;

        if (enc !== 0 || dec !== 0) {
            anythingTracked = true;

            let p_enc = enc > 0 ? enc : 0;
            let p_dec = dec > 0 ? dec : 0;
            let k_enc = enc < 0 ? Math.abs(enc) : 0;
            let k_dec = dec < 0 ? Math.abs(dec) : 0;

            if (p_enc > 0 || p_dec > 0) {
                player.tell(Text.yellow(`- ${user} holds: `)
                .append(Text.white(`${p_enc} Encoders, ${p_dec} Decoders`)));
            }
            if (k_enc > 0 || k_dec > 0) {
                player.tell(Text.green(`- Kingdom holds for ${user}: `)
                .append(Text.white(`${k_enc} Encoders, ${k_dec} Decoders `)));
            }
        }
    }

    if (!anythingTracked) {
        player.tell(Text.gray('All distributed stamps have been returned and no extras are held.'));
    }

    return 1;
}

function showAudit(ctx, category) {
    const player = ctx.source.player;
    player.tell(Text.gold(`--- Global Treasury Audit: ${category.toUpperCase()} ---`));

    let key = 'tres_audit_v2_' + category;
    let arr = [];

    if (ctx.source.server.persistentData.contains(key)) {
        try {
            arr = JSON.parse(ctx.source.server.persistentData.getString(key));
        } catch (e) {
            arr = [];
        }
    }

    if (arr.length === 0) {
        player.tell(Text.gray('No entries recorded.'));
    } else {
        arr.forEach(log => {
            player.tell(Text.yellow(log));
        });
    }
    return 1;
}

function handleAdminReset(ctx) {
    const server = ctx.source.server;

    server.persistentData.tres_level = 1;
    server.persistentData.tres_exp = 0;
    server.persistentData.tres_points = 0;

    server.persistentData.tres_maxEncoders = TREASURY_CONFIG.stamps.encoders.defaultMax;
    server.persistentData.tres_encoders = TREASURY_CONFIG.stamps.encoders.defaultMax;

    server.persistentData.tres_maxDecoders = TREASURY_CONFIG.stamps.decoders.defaultMax;
    server.persistentData.tres_decoders = TREASURY_CONFIG.stamps.decoders.defaultMax;

    server.persistentData.remove('tres_audit_v2_exp');
    server.persistentData.remove('tres_audit_v2_stamps');
    server.persistentData.remove('tres_ledger');
    server.persistentData.remove('tres_exp_ledger');

    server.persistentData.tres_initialized = true;

    server.runCommandSilent(`tellraw @a {"text":"[!] The Treasury has been reset by an Admin.","color":"red","bold":true}`);
    return 1;
}
