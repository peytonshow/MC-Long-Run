// ============================================================================
//                         DATA-DRIVEN CONFIGURATION
// ============================================================================
const TREASURY_CONFIG = {
    vault: {
        'encoders': { id: 'utopia:encoder_stamp', defaultMax: 200, growthPerLevel: 200, label: 'Encoders' },
        'decoders': { id: 'utopia:decoder_stamp', defaultMax: 100, growthPerLevel: 100, label: 'Decoders' },
        'paper': { id: 'utopia:paper_stamp', defaultMax: 500, growthPerLevel: 500, label: 'Paper Stamps' },
        'iron': { id: 'utopia:coin_iron', unlock: 1, base: 500, label: 'Iron Coins' },
        'diamond': { id: 'utopia:coin_diamond', unlock: 5, base: 200, label: 'Diamond Coins' },
        'netherite': { id: 'utopia:bills_netherite', unlock: 10, base: 50, label: 'Netherite Bills' }
    }
};

// ============================================================================
//                          HELPER FUNCTIONS
// ============================================================================

function getCapacity(type, level) {
    if (type === 'iron') return level * TREASURY_CONFIG.vault.iron.base;
    if (type === 'diamond') return level >= 5 ? (level - 4) * TREASURY_CONFIG.vault.diamond.base : 0;
    if (type === 'netherite') return level >= 10 ? (level - 9) * TREASURY_CONFIG.vault.netherite.base : 0;
    if (type === 'encoders') return TREASURY_CONFIG.vault.encoders.defaultMax + ((level - 1) * TREASURY_CONFIG.vault.encoders.growthPerLevel);
    if (type === 'decoders') return TREASURY_CONFIG.vault.decoders.defaultMax + ((level - 1) * TREASURY_CONFIG.vault.decoders.growthPerLevel);
    if (type === 'paper') return TREASURY_CONFIG.vault.paper.defaultMax + ((level - 1) * TREASURY_CONFIG.vault.paper.growthPerLevel);
    return 0;
}

function assignNextGoal(server, level) {
    let options = ['iron'];
    if (level >= 5) options.push('diamond');
    if (level >= 10) options.push('netherite');
    
    let choice = options[Math.floor(Math.random() * options.length)];
    // Explictly push to NBT to prevent same-tick deletion bugs
    server.persistentData.putString('tres_target_resource', choice);
    server.persistentData.putInt('tres_target_amount', getCapacity(choice, level));
}

function initTreasury(server) {
    // Explicitly pushing Ints and Booleans directly to the NBT layer
    server.persistentData.putInt('tres_level', 1);

    server.persistentData.putInt('tres_encoders', TREASURY_CONFIG.vault.encoders.defaultMax);
    server.persistentData.putInt('tres_decoders', TREASURY_CONFIG.vault.decoders.defaultMax);
    server.persistentData.putInt('tres_paper', TREASURY_CONFIG.vault.paper.defaultMax);

    server.persistentData.putInt('tres_iron', 0);
    server.persistentData.putInt('tres_diamond', 0);
    server.persistentData.putInt('tres_netherite', 0);

    assignNextGoal(server, 1);
    server.persistentData.putBoolean('tres_initialized', true);
}

function attemptLevelUp(server, player) {
    let currentLevel = safeNum(server.persistentData.tres_level, 1);
    let rawTarget = server.persistentData.contains('tres_target_resource') ? server.persistentData.getString('tres_target_resource') : 'iron';
    let targetType = String(rawTarget).replace(/['"]/g, '');
    let targetAmt = safeNum(server.persistentData.tres_target_amount, 500);

    let vaultKey = 'tres_' + targetType;
    let currentAmt = safeNum(server.persistentData[vaultKey], 0);

    if (currentAmt >= targetAmt) {
        let nextLevel = currentLevel + 1;
        server.persistentData.putInt('tres_level', nextLevel);
        assignNextGoal(server, nextLevel);

        let curEnc = safeNum(server.persistentData.tres_encoders, 0);
        let curDec = safeNum(server.persistentData.tres_decoders, 0);
        let curPaper = safeNum(server.persistentData.tres_paper, 0);

        server.persistentData.putInt('tres_encoders', curEnc + TREASURY_CONFIG.vault.encoders.growthPerLevel);
        server.persistentData.putInt('tres_decoders', curDec + TREASURY_CONFIG.vault.decoders.growthPerLevel);
        server.persistentData.putInt('tres_paper', curPaper + TREASURY_CONFIG.vault.paper.growthPerLevel);

        // Stripped UUID King lookup, relies cleanly on username
        let kingName = server.persistentData.current_king ? String(server.persistentData.current_king).trim() : null;
        let honorReward = 5;

        if (kingName && kingName !== '') {
            let balances = readJSON(server, 'honor_balances', {});
            let currentHonor = safeNum(balances[kingName], 0);

            balances[kingName] = currentHonor + honorReward;
            writeJSON(server, 'honor_balances', balances);

            let displayTitle = `King ${kingName}`;

            let onlineKing = server.players.find(p => p.username === kingName);
            if (onlineKing) {
                onlineKing.tell(Text.gold(`[+ ${honorReward} Honor Points] You have been personally rewarded because the Treasury expanded during your reign!`));
            }

            server.runCommandSilent(`tellraw @a {"text":"[!] The Kingdom's Treasury has expanded to Level ${nextLevel}! ${displayTitle} earns +${honorReward} Honor!","color":"gold","bold":true}`);
        } else {
            server.runCommandSilent(`tellraw @a {"text":"[!] The Kingdom's Treasury has expanded to Level ${nextLevel}! (No active King to claim Honor)","color":"gold","bold":true}`);
        }

        player.tell(Text.green(`Treasury leveled up to Level ${nextLevel}!`));
        return true;
    }
    return false;
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

    if (!server.persistentData.contains('tres_initialized')) {
        initTreasury(server);
    }

    let currentTarget = server.persistentData.contains('tres_target_resource') ? String(server.persistentData.getString('tres_target_resource')) : '';
    if (!TREASURY_CONFIG.vault[currentTarget] || currentTarget === 'encoders' || currentTarget === 'decoders' || currentTarget === 'paper') {
        assignNextGoal(server, safeNum(server.persistentData.tres_level, 1));
    }

    ['tres_exp', 'tres_exp_ledger', 'tres_maxEncoders', 'tres_maxDecoders', 'tres_maxPaper'].forEach(k => {
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
                        return handleEquip(ctx, type, finalAmt, actionName === 'add');
                    })
                )
            );
        });
        return actionNode;
    };

    const registerTreasuryTree = (baseCommandName) => {
        event.register(C.literal(baseCommandName)
        .executes(ctx => showDashboard(ctx, true))
        .then(C.literal('level')
        .executes(ctx => showDashboard(ctx, true))
        .then(C.literal('info').executes(ctx => showLevelInfo(ctx)))
        )
        .then(C.literal('stamp')
        .then(buildActionNode('add', ['encoders', 'decoders', 'paper']))
        .then(buildActionNode('withdraw', ['encoders', 'decoders', 'paper']))
        .then(C.literal('resolve')
        .executes(ctx => handleResolve(ctx, null))
        .then(C.argument('target', A.STRING.create(event))
        .executes(ctx => handleResolve(ctx, A.STRING.getResult(ctx, 'target'))))
        )
        )
        .then(C.literal('vault')
        .executes(ctx => showDashboard(ctx, false))
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

    let rawTarget = server.persistentData.contains('tres_target_resource') ? String(server.persistentData.getString('tres_target_resource')).replace(/['"]/g, '') : 'iron';
    let targetType = TREASURY_CONFIG.vault[rawTarget] ? rawTarget : 'iron';
    let targetAmt = safeNum(server.persistentData.tres_target_amount, 500);

    let curIron = safeNum(server.persistentData.tres_iron, 0);
    let curDiamond = safeNum(server.persistentData.tres_diamond, 0);
    let curNetherite = safeNum(server.persistentData.tres_netherite, 0);

    let maxIron = getCapacity('iron', lvl);
    let maxDiamond = getCapacity('diamond', lvl);
    let maxNetherite = getCapacity('netherite', lvl);

    const makeBar = (letter, letterColor, cur, max, isTarget, tAmt) => {
        if (max === 0) {
            return Text.white(' ').append(Text.of(`[${letter}]`).color(letterColor).bold()).append(Text.gray(' [Locked]'));
        }
        let percentage = Math.min(1, cur / max);
        let filled = Math.floor(percentage * 20);
        let empty = 20 - filled;

        let fBar = '|'.repeat(Math.max(0, filled));
        let eBar = '|'.repeat(Math.max(0, empty));
        let barColor = isTarget ? 'gold' : 'green';

        let line = Text.white(' ')
        .append(Text.of(`[${letter}]`).color(letterColor).bold())
        .append(Text.white(' ['))
        .append(Text.of(fBar).color(barColor).bold())
        .append(Text.gray(eBar))
        .append(Text.white('] '))
        .append(Text.aqua(`${Math.floor(percentage * 100)}% `))
        .append(Text.gray(`(${cur}/${max})`));

        if (isTarget) {
            line.append(Text.yellow(` (Goal: ${tAmt} Coins)`));
        }

        return line;
    };

    let message = Text.of(' \n \n')
    .append(Text.gold('=== ').append(Text.white(`Treasury [Level ${lvl}]`).bold()).append(Text.gold(' ===\n')))
    .append(Text.of(' \n'))
    .append(Text.gold('--- Vault Capacity ---\n'))
    .append(makeBar('I', 'gray', curIron, maxIron, targetType === 'iron', targetAmt)).append('\n')
    .append(makeBar('D', 'aqua', curDiamond, maxDiamond, targetType === 'diamond', targetAmt)).append('\n')
    .append(makeBar('N', 'dark_purple', curNetherite, maxNetherite, targetType === 'netherite', targetAmt));

    if (showStamps) {
        let curEnc = safeNum(server.persistentData.tres_encoders, 0);
        let curDec = safeNum(server.persistentData.tres_decoders, 0);
        let curPaper = safeNum(server.persistentData.tres_paper, 0);

        let maxEnc = getCapacity('encoders', lvl);
        let maxDec = getCapacity('decoders', lvl);
        let maxPaper = getCapacity('paper', lvl);

        message.append('')
        .append(Text.gold('\n--- Stamps ---\n'))
        .append(Text.yellow('• Encoders: ').append(Text.white(`${curEnc}/${maxEnc}\n`)))
        .append(Text.yellow('• Decoders: ').append(Text.white(`${curDec}/${maxDec}\n`)))
        .append(Text.yellow('• Paper Stamps: ').append(Text.white(`${curPaper}/${maxPaper}`)));
    }

    let ironRate = server.persistentData.contains('tres_rate_iron') ? server.persistentData.getDouble('tres_rate_iron') : 0;
    let diamondRate = server.persistentData.contains('tres_rate_diamond') ? server.persistentData.getDouble('tres_rate_diamond') : 0;
    let netheriteRate = server.persistentData.contains('tres_rate_netherite') ? server.persistentData.getDouble('tres_rate_netherite') : 0;

    if (ironRate > 0 || diamondRate > 0 || netheriteRate > 0) {
        message.append(Text.gold('\n--- Active Exchange Rates ---\n'));

        if (ironRate > 0) {
            message.append(Text.green(`[ ${ironRate} R$D ] `).append(Text.white(`= 1 Iron Coin\n`)));
        }
        if (diamondRate > 0) {
            message.append(Text.green(`[ ${diamondRate} R$D ] `).append(Text.white(`= 1 Diamond Coin\n`)));
        }
        if (netheriteRate > 0) {
            message.append(Text.green(`[ ${netheriteRate} R$D ] `).append(Text.white(`= 1 Netherite Coin\n`)));
        }
    }

    player.tell(message);
    return 1;
}

function handleEquip(ctx, type, rawAmount, isAdding) {
    let player = ctx.source.player;
    let server = ctx.source.server;
    if (!player) return 0;

    let absAmt = Math.abs(safeNum(rawAmount, 0));
    if (absAmt <= 0) {
        player.tell(Text.red("The amount must be greater than zero."));
        return 0;
    }

    let configEntry = TREASURY_CONFIG.vault[type.toLowerCase()];
    let itemMap = {
        'iron': 'minecraft:iron_ingot',
        'gold': 'minecraft:gold_ingot',
        'diamond': 'minecraft:diamond',
        'emerald': 'minecraft:emerald'
    };

    let itemId = (configEntry && configEntry.id) ? configEntry.id : itemMap[type.toLowerCase()];
    if (!itemId) {
        player.tell(Text.red(`Invalid treasury type: ${type}`));
        return 0;
    }

    let pName = player.username; // Pure Username

    let ledger = readJSON(server, 'tres_ledger', {});
    if (!ledger[pName]) ledger[pName] = {};

    let vaultKey = 'tres_' + type.toLowerCase();
    let currentVaultStock = safeNum(server.persistentData[vaultKey], 0);

    if (isAdding) {
        let count = player.inventory.count(itemId);
        if (count < absAmt) {
            player.tell(Text.red(`You do not have enough ${type} to deposit. You have ${count}, but need ${absAmt}.`));
            return 0;
        }

        player.inventory.clear(Item.of(itemId), absAmt);

        ledger[pName][type] = (ledger[pName][type] || 0) - absAmt;
        server.persistentData.putInt(vaultKey, currentVaultStock + absAmt);

        player.tell(Text.green(`Successfully deposited `).append(Text.gold(`${absAmt} ${type}`)).append(Text.green(` into the Treasury.`)));

        if (['iron', 'diamond', 'netherite'].includes(type.toLowerCase())) {
            attemptLevelUp(server, player);
        }

    } else {
        if (currentVaultStock < absAmt) {
            let label = configEntry ? configEntry.label : type;
            player.tell(Text.red(`The Treasury only holds ${currentVaultStock} ${label}!`));
            return 0;
        }

        player.give(Item.of(itemId, absAmt));

        ledger[pName][type] = (ledger[pName][type] || 0) + absAmt;
        server.persistentData.putInt(vaultKey, currentVaultStock - absAmt);

        player.tell(Text.green(`Successfully withdrew `).append(Text.gold(`${absAmt} ${type}`)).append(Text.green(` from the Treasury.`)));
    }

    writeJSON(server, 'tres_ledger', ledger);
    return 1;
}

function handleResolve(ctx, rawTargetName) {
    const player = ctx.source.player;
    const server = ctx.source.server;

    if (!rawTargetName) {
        player.tell(' ');
        player.tell(Text.gold('--- Ledger Resolution System ---'));
        player.tell(Text.white('Use this command to fix ledger discrepancies after trading with another player.'));
        player.tell(Text.yellow('Usage: ').append(Text.white('/tres stamp resolve <player_name>')));
        return 1;
    }

    let targetName = String(rawTargetName).trim();
    let pName = player.username;

    if (pName.toLowerCase() === targetName.toLowerCase()) {
        player.tell(Text.red('You cannot resolve your ledger with yourself.'));
        return 0;
    }

    let ledger = readJSON(server, 'tres_ledger', {});

    // Ensure capitalization matches the stored keys, otherwise fallback to exact typed string
    let resolvedTargetKey = Object.keys(ledger).find(k => k.toLowerCase() === targetName.toLowerCase()) || targetName;

    let pData = ledger[pName] || {};
    let tData = ledger[resolvedTargetKey] || {};

    let msgParts = [];
    let keys = ['encoders', 'decoders', 'paper', 'iron', 'diamond', 'netherite'];

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
        player.tell(Text.red(`You cannot resolve a deficit unless you have contributed excess assets to the Kingdom, and ${resolvedTargetKey} has an active negative balance.`));
        return 0;
    }

    ledger[pName] = pData;
    ledger[resolvedTargetKey] = tData;

    writeJSON(server, 'tres_ledger', ledger);

    let msgStr = msgParts.join(' and ');
    player.tell(Text.green(`Successfully resolved ${msgStr} with ${resolvedTargetKey}.`));

    let onlineTarget = server.players.find(p => p.username === resolvedTargetKey);
    if (onlineTarget) {
        onlineTarget.tell(Text.green(`${player.username} has resolved ${msgStr} between your ledgers.`));
    }

    logAudit(server, 'vault', `${player.username} & ${resolvedTargetKey} resolved ${msgStr}`);
    return 1;
}

function showVaultLedger(ctx) {
    const player = ctx.source.player;
    const server = ctx.source.server;

    player.tell(' ');
    player.tell(Text.gold('--- Treasury Vault Ledger ---'));

    let ledger = readJSON(server, 'tres_ledger', {});
    let anythingTracked = false;

    // The keys are now simply the Usernames
    for (let userName in ledger) {
        let hasAssets = false;
        let pStr = [];
        let kStr = [];

        for (let key in ledger[userName]) {
            if (!TREASURY_CONFIG.vault[key]) continue;

            let val = ledger[userName][key];
            if (val !== 0) {
                hasAssets = true;
                let label = TREASURY_CONFIG.vault[key].label;
                if (val > 0) pStr.push(`${val} ${label}`);
                if (val < 0) kStr.push(`${Math.abs(val)} ${label}`);
            }
        }

        if (hasAssets) {
            anythingTracked = true;

            if (pStr.length > 0) {
                player.tell(Text.yellow(`- ${userName} owes the vault: `).append(Text.white(pStr.join(', '))));
            }
            if (kStr.length > 0) {
                let identity = (userName === player.username) ? 'you' : userName;
                player.tell(Text.green(`- Vault holds for ${identity}: `).append(Text.white(kStr.join(', '))));
            }
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

function handleAdminReset(ctx, password) {
    const server = ctx.source.server;
    const player = ctx.source.player;

    if (password !== 'CONFIRM') {
        if (player) player.tell(Text.red('Reset aborted. You must add "CONFIRM" in all caps to execute an admin reset.'));
        return 0;
    }

    let allKeys = [];
    try {
        allKeys = server.persistentData.getAllKeys();
    } catch(e) {
        try { allKeys = server.persistentData.nbt.getAllKeys(); } catch(err) {}
    }

    if (allKeys && allKeys.length > 0) {
        allKeys.forEach(k => server.persistentData.remove(k));
    } else {
        let knownKeys = [
            'tres_level', 'tres_encoders', 'tres_decoders',
            'tres_paper', 'tres_iron', 'tres_diamond', 'tres_netherite',
            'tres_initialized', 'tres_audit_v2_vault', 'tres_ledger', 'tres_name_cache',
            'tres_target_resource', 'tres_target_amount', 'honor_balances', 'current_king'
        ];
        knownKeys.forEach(k => server.persistentData.remove(k));
    }

    // Explicitly reinitialize with hard puts
    initTreasury(server);

    server.runCommandSilent(`tellraw @a {"text":"[!] Persistent Data has been completely wiped and re-initialized by an Admin.","color":"dark_red","bold":true}`);

    return 1;
}
