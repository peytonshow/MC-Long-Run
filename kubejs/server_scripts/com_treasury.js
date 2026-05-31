// ============================================================================
//                         DATA-DRIVEN CONFIGURATION
// ============================================================================
const TREASURY_CONFIG = {
    vault: {
        'encoders': { id: 'utopia:encoder_stamp', defaultMax: 500, growthPerLevel: 500, label: 'Encoders' },
        'decoders': { id: 'utopia:decoder_stamp', defaultMax: 500, growthPerLevel: 500, label: 'Decoders' },
        'iron': { id: 'utopia:coin_iron', unlock: 1, base: 500, label: 'Iron Coins' },
        'diamond': { id: 'utopia:coin_diamond', unlock: 5, base: 200, label: 'Diamond Coins' },
        'netherite': { id: 'utopia:bills_netherite', unlock: 10, base: 50, label: 'Netherite Bills' }
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

function getCapacity(type, level) {
    if (type === 'iron') return Math.min(level * TREASURY_CONFIG.vault.iron.base, 2000);
    if (type === 'diamond') return level >= 5 ? Math.min((level - 4) * TREASURY_CONFIG.vault.diamond.base, 2000) : 0;
    if (type === 'netherite') return level >= 10 ? Math.min((level - 9) * TREASURY_CONFIG.vault.netherite.base, 2000) : 0;
    if (type === 'encoders') return TREASURY_CONFIG.vault.encoders.defaultMax + ((level - 1) * TREASURY_CONFIG.vault.encoders.growthPerLevel);
    if (type === 'decoders') return TREASURY_CONFIG.vault.decoders.defaultMax + ((level - 1) * TREASURY_CONFIG.vault.decoders.growthPerLevel);
    return 0;
}

function assignNextGoal(server, level) {
    let options = ['iron'];
    if (level >= 5) options.push('diamond');
    if (level >= 10) options.push('netherite');

    let choice = options[Math.floor(Math.random() * options.length)];
    server.persistentData.tres_target_resource = choice;
    server.persistentData.tres_target_amount = getCapacity(choice, level);
}

function checkLevelUp(server) {
    let level = safeNum(server.persistentData.tres_level, 1);
    let rawTarget = String(server.persistentData.tres_target_resource || 'iron');
    let targetType = TREASURY_CONFIG.vault[rawTarget] ? rawTarget : 'iron';
    let targetAmt = safeNum(server.persistentData.tres_target_amount, 500);
    let currentAmt = safeNum(server.persistentData['tres_' + targetType], 0);

    if (currentAmt >= targetAmt) {
        level++;
        server.persistentData.tres_level = level;
        server.persistentData.tres_honor = safeNum(server.persistentData.tres_honor, 0) + 5;

        // Level up stamps
        let encGrowth = TREASURY_CONFIG.vault.encoders.growthPerLevel;
        server.persistentData.tres_maxEncoders = safeNum(server.persistentData.tres_maxEncoders, TREASURY_CONFIG.vault.encoders.defaultMax) + encGrowth;
        server.persistentData.tres_encoders = safeNum(server.persistentData.tres_encoders, TREASURY_CONFIG.vault.encoders.defaultMax) + encGrowth;

        let decGrowth = TREASURY_CONFIG.vault.decoders.growthPerLevel;
        server.persistentData.tres_maxDecoders = safeNum(server.persistentData.tres_maxDecoders, TREASURY_CONFIG.vault.decoders.defaultMax) + decGrowth;
        server.persistentData.tres_decoders = safeNum(server.persistentData.tres_decoders, TREASURY_CONFIG.vault.decoders.defaultMax) + decGrowth;

        assignNextGoal(server, level);

        let newTarget = String(server.persistentData.tres_target_resource).replace(/['"]/g, '');
        let validTarget = TREASURY_CONFIG.vault[newTarget] ? newTarget : 'iron';
        let newReq = server.persistentData.tres_target_amount;
        let label = TREASURY_CONFIG.vault[validTarget].label;

        server.runCommandSilent(`tellraw @a {"text":"[!] The Treasury reached its Hoard Goal and leveled up to ${level}! (+5 Honor, +${encGrowth} Encoders/Decoders). New Goal: Fill vault with ${newReq} ${label}.","color":"gold","bold":true}`);
    }
}

function logAudit(server, category, msg) {
    let key = 'tres_audit_v2_' + category;
    let arr = [];

    if (server.persistentData.contains(key)) {
        try { arr = JSON.parse(server.persistentData.getString(key)); } catch (e) { arr = []; }
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
        server.persistentData.tres_honor = 0;

        server.persistentData.tres_maxEncoders = TREASURY_CONFIG.vault.encoders.defaultMax;
        server.persistentData.tres_encoders = TREASURY_CONFIG.vault.encoders.defaultMax;

        server.persistentData.tres_maxDecoders = TREASURY_CONFIG.vault.decoders.defaultMax;
        server.persistentData.tres_decoders = TREASURY_CONFIG.vault.decoders.defaultMax;

        server.persistentData.tres_iron = 0;
        server.persistentData.tres_diamond = 0;
        server.persistentData.tres_netherite = 0;

        assignNextGoal(server, 1);
        server.persistentData.tres_initialized = true;
    }

    let currentTarget = String(server.persistentData.tres_target_resource || '');
    if (!TREASURY_CONFIG.vault[currentTarget] || currentTarget === 'encoders' || currentTarget === 'decoders') {
        assignNextGoal(server, safeNum(server.persistentData.tres_level, 1));
    }

    ['tres_exp', 'tres_exp_ledger'].forEach(k => {
        if (server.persistentData.contains(k)) server.persistentData.remove(k);
    });
});

ServerEvents.commandRegistry(event => {
    const { commands: C, arguments: A } = event;

    const buildActionNode = (actionName, types) => {
        let actionNode = C.literal(actionName);
        types.forEach(type => {
            actionNode.then(
                C.literal(type).then(
                    C.argument('amt', A.INTEGER.create(event))
                    .executes(ctx => {
                        let amt = A.INTEGER.getResult(ctx, 'amt');
                        let finalAmt = actionName === 'withdraw' ? -amt : amt;
                        return handleEquip(ctx, type, finalAmt);
                    })
                )
            );
        });
        return actionNode;
    };

    const registerTreasuryTree = (baseCommandName) => {
        event.register(C.literal(baseCommandName)
        .executes(ctx => showDashboard(ctx, true)) // Show stamps on /tres
        .then(C.literal('level')
        .executes(ctx => showDashboard(ctx, true)) // Show stamps on /tres level
        .then(C.literal('info').executes(ctx => showLevelInfo(ctx)))
        )
        .then(C.literal('stamp')
        .then(buildActionNode('add', ['encoders', 'decoders']))
        .then(buildActionNode('withdraw', ['encoders', 'decoders']))
        .then(C.literal('resolve')
        .executes(ctx => handleResolve(ctx, null))
        .then(C.argument('target', A.PLAYER.create(event))
        .executes(ctx => handleResolve(ctx, A.PLAYER.getResult(ctx, 'target'))))
        )
        )
        .then(C.literal('vault')
        .executes(ctx => showDashboard(ctx, false)) // HIDE stamps on /tres vault
        .then(buildActionNode('add', ['iron', 'diamond', 'netherite']))
        .then(buildActionNode('withdraw', ['iron', 'diamond', 'netherite']))
        )
        .then(C.literal('audit')
        .then(C.literal('latest')
        .then(C.literal('vault').executes(ctx => showAudit(ctx, 'vault')))
        )
        .then(C.literal('ledger')
        .then(C.literal('vault').executes(ctx => showVaultLedger(ctx)))
        )
        )
        .then(C.literal('admin')
        .then(C.literal('reset')
        .then(C.argument('password', A.STRING.create(event))
        .executes(ctx => handleAdminReset(ctx, A.STRING.getResult(ctx, 'password'))))
        )
        )
        );
    };

    registerTreasuryTree('treasury');
    registerTreasuryTree('tres');
});

// --- Core Handlers ---

function showLevelInfo(ctx) {
    return showDashboard(ctx, true);
}

function showDashboard(ctx, showStamps) {
    const player = ctx.source.player;
    const server = ctx.source.server;

    let lvl = safeNum(server.persistentData.tres_level, 1);

    let rawTarget = String(server.persistentData.tres_target_resource || 'iron').replace(/['"]/g, '');
    let targetType = TREASURY_CONFIG.vault[rawTarget] ? rawTarget : 'iron';
    let targetAmt = safeNum(server.persistentData.tres_target_amount, 500);
    let targetLabel = TREASURY_CONFIG.vault[targetType].label;

    let curIron = safeNum(server.persistentData.tres_iron, 0);
    let curDiamond = safeNum(server.persistentData.tres_diamond, 0);
    let curNetherite = safeNum(server.persistentData.tres_netherite, 0);

    let maxIron = getCapacity('iron', lvl);
    let maxDiamond = getCapacity('diamond', lvl);
    let maxNetherite = getCapacity('netherite', lvl);

    player.tell(' ');
    player.tell(' ');
    player.tell(Text.gold('=== ').append(Text.white(`Treasury Status [Level ${lvl}]`).bold()).append(Text.gold(' ===')));
    player.tell(' ');
    player.tell(Text.white(`Goal: Fill the vault with `).append(Text.yellow(`${targetAmt} ${targetLabel}`)).append(Text.white(` to reach Level ${lvl + 1}.`)));
    player.tell(' ');

    const makeBar = (letter, letterColor, cur, max, isTarget) => {
        if (max === 0) {
            return Text.white(' ').append(Text.of(`[${letter}]`).color(letterColor).bold()).append(Text.gray(' [Locked]'));
        }
        let percentage = Math.min(1, cur / max);
        let filled = Math.floor(percentage * 20);
        let empty = 20 - filled;

        let fBar = '|'.repeat(Math.max(0, filled));
        let eBar = '|'.repeat(Math.max(0, empty));
        let barColor = isTarget ? 'gold' : 'green';

        return Text.white(' ')
        .append(Text.of(`[${letter}]`).color(letterColor).bold())
        .append(Text.white(' ['))
        .append(Text.of(fBar).color(barColor).bold())
        .append(Text.gray(eBar))
        .append(Text.white('] '))
        .append(Text.aqua(`${Math.floor(percentage * 100)}% `))
        .append(Text.gray(`(${cur}/${max})`));
    };

    player.tell(Text.gold('--- Vault Capacity Meters ---'));
    player.tell(makeBar('I', 'gray', curIron, maxIron, targetType === 'iron'));
    player.tell(makeBar('D', 'aqua', curDiamond, maxDiamond, targetType === 'diamond'));
    player.tell(makeBar('N', 'dark_purple', curNetherite, maxNetherite, targetType === 'netherite'));

    if (showStamps) {
        let curEnc = safeNum(server.persistentData.tres_encoders, 0);
        let curDec = safeNum(server.persistentData.tres_decoders, 0);
        let maxEnc = getCapacity('encoders', lvl);
        let maxDec = getCapacity('decoders', lvl);

        player.tell(' ');
        player.tell(Text.gold('--- Stamps ---'));
        player.tell(Text.yellow('• Encoders: ').append(Text.white(`${curEnc}/${maxEnc}`)));
        player.tell(Text.yellow('• Decoders: ').append(Text.white(`${curDec}/${maxDec}`)));
    }

    return 1;
}

function handleAdminReset(ctx, password) {
    const server = ctx.source.server;
    const player = ctx.source.player;

    if (player && !player.hasPermissions('4')) {
        player.tell(Text.red('[!] Access Denied. Your Rank does not have the power to reset the Treasury.'));
        return 0;
    }

    if (password !== 'CONFIRM') {
        if (player) player.tell(Text.red('Reset aborted. You must add "CONFIRM" in all caps to execute an admin reset.'));
        return 0;
    }

    server.persistentData.tres_level = 1;
    server.persistentData.tres_honor = 0;

    server.persistentData.tres_maxEncoders = TREASURY_CONFIG.vault.encoders.defaultMax;
    server.persistentData.tres_encoders = TREASURY_CONFIG.vault.encoders.defaultMax;

    server.persistentData.tres_maxDecoders = TREASURY_CONFIG.vault.decoders.defaultMax;
    server.persistentData.tres_decoders = TREASURY_CONFIG.vault.decoders.defaultMax;

    server.persistentData.tres_iron = 0;
    server.persistentData.tres_diamond = 0;
    server.persistentData.tres_netherite = 0;

    server.persistentData.remove('tres_audit_v2_vault');
    server.persistentData.remove('tres_ledger');

    assignNextGoal(server, 1);
    server.persistentData.tres_initialized = true;

    server.runCommandSilent(`tellraw @a {"text":"[!] The Treasury has been reset by an Admin.","color":"red","bold":true}`);
    return 1;
}

function handleResolve(ctx, target) {
    const player = ctx.source.player;
    const server = ctx.source.server;

    if (!target) {
        player.tell(' ');
        player.tell(Text.gold('--- Ledger Resolution System ---'));
        player.tell(Text.white('Use this command to fix ledger discrepancies after trading with another player.'));
        player.tell(Text.yellow('Usage: ').append(Text.white('/tres stamp resolve <player>')));
        return 1;
    }

    if (player.username === target.username) {
        player.tell(Text.red('You cannot resolve your ledger with yourself.'));
        return 0;
    }

    if (!server.persistentData.contains('tres_ledger')) {
        player.tell(Text.red('No assets are currently tracked in the ledger.'));
        return 0;
    }

    let ledger = {};
    try { ledger = JSON.parse(server.persistentData.getString('tres_ledger')); }
    catch(e) { player.tell(Text.red('[!] Ledger data corrupted.')); return 0; }

    let pData = ledger[player.username] || {};
    let tData = ledger[target.username] || {};

    let msgParts = [];
    let keys = ['encoders', 'decoders', 'iron', 'diamond', 'netherite'];

    for (let key of keys) {
        let pVal = safeNum(pData[key], 0);
        let tVal = safeNum(tData[key], 0);

        if (pVal < 0 && tVal > 0) {
            let res = Math.min(Math.abs(pVal), tVal);
            pData[key] += res;
            tData[key] -= res;
            if (res > 0) msgParts.push(`${res} ${TREASURY_CONFIG.vault[key].label}`);
        }
    }

    if (msgParts.length === 0) {
        player.tell(Text.red(`You cannot resolve a deficit unless you have contributed excess assets to the Kingdom, and ${target.username} has a negative balance.`));
        return 0;
    }

    ledger[player.username] = pData;
    ledger[target.username] = tData;

    server.persistentData.putString('tres_ledger', JSON.stringify(ledger));

    let msgStr = msgParts.join(' and ');
    player.tell(Text.green(`Successfully resolved ${msgStr} with ${target.username}.`));
    target.tell(Text.green(`${player.username} has resolved ${msgStr} between your ledgers.`));

    logAudit(server, 'vault', `${player.username} & ${target.username} resolved ${msgStr}`);
    return 1;
}

function showVaultLedger(ctx) {
    const player = ctx.source.player;
    const server = ctx.source.server;

    player.tell(' ');
    player.tell(Text.gold('--- Treasury Vault Ledger ---'));

    if (!server.persistentData.contains('tres_ledger')) {
        player.tell(Text.gray('No assets are currently tracked in the ledger.'));
        return 1;
    }

    let ledger = {};
    try { ledger = JSON.parse(server.persistentData.getString('tres_ledger')); }
    catch(e) { player.tell(Text.red('Ledger data corrupted.')); return 0; }

    let anythingTracked = false;
    for (let user in ledger) {
        let hasAssets = false;
        let pStr = [];
        let kStr = [];

        for (let key in ledger[user]) {
            if (!TREASURY_CONFIG.vault[key]) continue;

            let val = ledger[user][key];
            if (val !== 0) {
                hasAssets = true;
                let label = TREASURY_CONFIG.vault[key].label;
                if (val > 0) pStr.push(`${val} ${label}`);
                if (val < 0) kStr.push(`${Math.abs(val)} ${label}`);
            }
        }

        if (hasAssets) {
            anythingTracked = true;
            if (pStr.length > 0) player.tell(Text.yellow(`- ${user} owes the vault: `).append(Text.white(pStr.join(', '))));
            if (kStr.length > 0) player.tell(Text.green(`- Vault holds for ${user}: `).append(Text.white(kStr.join(', '))));
        }
    }

    if (!anythingTracked) {
        player.tell(Text.gray('All distributed assets have been returned and no extras are held.'));
    }

    return 1;
}

function showAudit(ctx, category) {
    const player = ctx.source.player;

    player.tell(' ');
    player.tell(Text.gold(`--- Global Treasury Audit: ${category.toUpperCase()} ---`));

    let key = 'tres_audit_v2_' + category;
    let arr = [];

    if (ctx.source.server.persistentData.contains(key)) {
        try { arr = JSON.parse(ctx.source.server.persistentData.getString(key)); }
        catch (e) { arr = []; }
    }

    if (arr.length === 0) {
        player.tell(Text.gray('No entries recorded.'));
    } else {
        arr.forEach(log => player.tell(Text.yellow(log)));
    }
    return 1;
}
