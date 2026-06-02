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
    if (type === 'iron') return level * TREASURY_CONFIG.vault.iron.base;
    if (type === 'diamond') return level >= 5 ? (level - 4) * TREASURY_CONFIG.vault.diamond.base : 0;
    if (type === 'netherite') return level >= 10 ? (level - 9) * TREASURY_CONFIG.vault.netherite.base : 0;
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

// Internal Local Storage Mirror to map UUID strings back to their latest usernames
function cachePlayerName(server, uuid, username) {
    let cache = {};
    if (server.persistentData.contains('tres_name_cache')) {
        try { cache = JSON.parse(server.persistentData.getString('tres_name_cache')); } catch(e) {}
    }

    // Strip any single or double quotes natively included by KubeJS text components
    let cleanName = String(username).replace(/['"]/g, '');

    cache[String(uuid)] = cleanName;
    server.persistentData.putString('tres_name_cache', JSON.stringify(cache));
}

function getCachedName(server, uuid, fallback) {
    if (server.persistentData.contains('tres_name_cache')) {
        try {
            let cache = JSON.parse(server.persistentData.getString('tres_name_cache'));
            if (cache[String(uuid)]) return cache[String(uuid)];
        } catch(e) {}
    }
    return fallback;
}

function attemptLevelUp(server, player) {
    let currentLevel = safeNum(server.persistentData.tres_level, 1);
    let targetType = String(server.persistentData.tres_target_resource || 'iron').replace(/['"]/g, '');
    let targetAmt = safeNum(server.persistentData.tres_target_amount, 500);

    let vaultKey = 'tres_' + targetType;
    let currentAmt = safeNum(server.persistentData[vaultKey], 0);

    if (currentAmt >= targetAmt) {
        server.persistentData.tres_level = currentLevel + 1;
        assignNextGoal(server, currentLevel + 1);

        // Keep depositor name cached
        cachePlayerName(server, player.uuid, player.username);

        let kingUUID = server.persistentData.current_king ? String(server.persistentData.current_king).trim() : null;
        let honorReward = 5;

        if (kingUUID && kingUUID !== '') {
            let balances = {};
            if (server.persistentData.contains('honor_balances')) {
                try { balances = JSON.parse(server.persistentData.getString('honor_balances')); } catch(e) {}
            }

            // Award honor directly to the King's UUID entry in the global registry
            let currentHonor = safeNum(balances[kingUUID], 0);
            let newBalance = currentHonor + honorReward;
            balances[kingUUID] = newBalance;
            server.persistentData.putString('honor_balances', JSON.stringify(balances));

            // Fix the redundant "King The King" grammar
            let rawKingName = getCachedName(server, kingUUID, null);
            let displayTitle = rawKingName ? `King ${rawKingName}` : "The King";

            // Alert the King directly if they are currently online
            let onlineKing = server.players.find(p => String(p.uuid) === kingUUID);
            if (onlineKing) {
                onlineKing.tell(Text.gold(`[+ ${honorReward} Honor Points] You have been personally rewarded because the Treasury expanded during your reign!`));
            }

            server.runCommandSilent(`tellraw @a {"text":"[!] The Kingdom's Treasury has expanded to Level ${currentLevel + 1}! ${displayTitle} earns +${honorReward} Honor!","color":"gold","bold":true}`);
        } else {
            server.runCommandSilent(`tellraw @a {"text":"[!] The Kingdom's Treasury has expanded to Level ${currentLevel + 1}! (No active King to claim Honor)","color":"gold","bold":true}`);
        }

        player.tell(Text.green(`Treasury leveled up to Level ${currentLevel + 1}!`));
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

    if (server.persistentData.tres_initialized == null) {
        server.persistentData.tres_level = 1;

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
        .executes(ctx => showDashboard(ctx, true))
        .then(C.literal('level')
        .executes(ctx => showDashboard(ctx, true))
        .then(C.literal('info').executes(ctx => showLevelInfo(ctx)))
        )
        .then(C.literal('stamp')
        .then(buildActionNode('add', ['encoders', 'decoders']))
        .then(buildActionNode('withdraw', ['encoders', 'decoders']))
        .then(C.literal('resolve')
        .executes(ctx => handleResolve(ctx, null))
        // UPGRADED: Swapped A.PLAYER to A.STRING to process offline players via text input
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

    let rawTarget = String(server.persistentData.tres_target_resource || 'iron').replace(/['"]/g, '');
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
        let maxEnc = getCapacity('encoders', lvl);
        let maxDec = getCapacity('decoders', lvl);

        message.append('')
        .append(Text.gold('\n--- Stamps ---\n'))
        .append(Text.yellow('• Encoders: ').append(Text.white(`${curEnc}/${maxEnc}\n`)))
        .append(Text.yellow('• Decoders: ').append(Text.white(`${curDec}/${maxDec}`)));
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

function handleEquip(ctx, type, amt) {
    const player = ctx.source.player;
    const server = ctx.source.server;
    if (!player) return 0;

    // Cache names anytime an asset is interacted with
    cachePlayerName(server, player.uuid, player.username);

    if (Number(amt) === 0) {
        player.tell(Text.red('You cannot deposit or withdraw 0 items!'));
        return 0;
    }

    const isAdding = amt > 0;
    const absAmt = Math.abs(amt);

    // UPGRADED: Expecting current_king variable to hold a clean string UUID
    let currentKingUUID = server.persistentData.current_king;
    if (isAdding && (!currentKingUUID || String(currentKingUUID).trim() === '')) {
        player.tell(Text.red('There is currently no active King! Deposits into the Treasury are suspended.'));
        return 0;
    }

    const vaultConfig = TREASURY_CONFIG.vault[type];
    if (!vaultConfig) return 0;
    const itemId = vaultConfig.id;

    let currentLevel = safeNum(server.persistentData.tres_level, 1);
    if (vaultConfig.unlock && currentLevel < vaultConfig.unlock) {
        player.tell(Text.red(`The Treasury cannot accept ${vaultConfig.label} until Level ${vaultConfig.unlock}.`));
        return 0;
    }

    let currentAmt = safeNum(server.persistentData['tres_' + type], 0);
    let max = getCapacity(type, currentLevel);

    // UPGRADED: Strictly verifies withdrawal rights via King UUID comparison
    if (!isAdding && String(player.uuid) !== String(currentKingUUID)) {
        player.tell(Text.red('Only the King can remove assets from the Treasury!'));
        return 0;
    }

    if (isAdding && currentAmt + absAmt > max) {
        player.tell(Text.red(`The Treasury is full! Vault capacity for ${vaultConfig.label} is ${currentAmt}/${max}. Level up to expand.`));
        return 0;
    }
    if (!isAdding && currentAmt - absAmt < 0) {
        player.tell(Text.red(`The Treasury doesn't have enough! Only ${currentAmt} available.`));
        return 0;
    }

    if (isAdding) {
        let invCount = player.inventory.count(itemId);
        if (invCount < absAmt) {
            player.tell(Text.red(`You don't have enough in your inventory! You have ${invCount}, but need ${absAmt}.`));
            return 0;
        }
        server.runCommandSilent(`clear "${player.username}" ${itemId} ${absAmt}`);
    } else {
        let remaining = absAmt;
        while (remaining > 0) {
            let chunk = Math.min(remaining, 64);
            player.give(Item.of(itemId, chunk));
            remaining -= chunk;
        }
    }

    server.persistentData['tres_' + type] = currentAmt + amt;

    let ledger = {};
    if (server.persistentData.contains('tres_ledger')) {
        try { ledger = JSON.parse(server.persistentData.getString('tres_ledger')); } catch(e) {}
    }

    // UPGRADED: Store individual debts inside the JSON ledger indexed by player UUID
    let pUUID = String(player.uuid);
    if (!ledger[pUUID]) ledger[pUUID] = {};
    if (!ledger[pUUID][type]) ledger[pUUID][type] = 0;

    if (isAdding) {
        ledger[pUUID][type] -= absAmt;
    } else {
        ledger[pUUID][type] += absAmt;
    }

    server.persistentData.putString('tres_ledger', JSON.stringify(ledger));

    const actionStr = isAdding ? 'dep' : 'with';
    logAudit(server, 'vault', `${player.username} ${actionStr} ${absAmt} ${type}`);

    player.tell(Text.green(`Successfully ${isAdding ? 'deposited' : 'withdrawn'} ${absAmt} ${type}. Vault Balance: ${currentAmt + amt}/${max}`));

    if (isAdding && type !== 'encoders' && type !== 'decoders') {
        attemptLevelUp(server, player);
    }

    return 1;
}

function handleResolve(ctx, targetName) {
    const player = ctx.source.player;
    const server = ctx.source.server;

    if (!targetName) {
        player.tell(' ');
        player.tell(Text.gold('--- Ledger Resolution System ---'));
        player.tell(Text.white('Use this command to fix ledger discrepancies after trading with another player.'));
        player.tell(Text.yellow('Usage: ').append(Text.white('/tres stamp resolve <player_name>')));
        return 1;
    }

    targetName = String(targetName).trim();
    cachePlayerName(server, player.uuid, player.username);

    // UPGRADED: Calling the function residing inside uuid_resolver.js to translate text args
    let targetUUID = parseUsernameToUUID(server, targetName);
    if (!targetUUID) {
        player.tell(Text.red(`Could not resolve a unique UUID for "${targetName}". Ensure the name is spelled correctly and they have joined before.`));
        return 0;
    }

    if (String(player.uuid) === targetUUID) {
        player.tell(Text.red('You cannot resolve your ledger with yourself.'));
        return 0;
    }

    // Capture newest text mapping for the target UUID
    cachePlayerName(server, targetUUID, targetName);

    if (!server.persistentData.contains('tres_ledger')) {
        player.tell(Text.red('No assets are currently tracked in the ledger.'));
        return 0;
    }

    let ledger = {};
    try { ledger = JSON.parse(server.persistentData.getString('tres_ledger')); }
    catch(e) { player.tell(Text.red('[!] Ledger data corrupted.')); return 0; }

    // UPGRADED: Pull sub-records out via strict UUID indexing
    let pUUID = String(player.uuid);
    let pData = ledger[pUUID] || {};
    let tData = ledger[targetUUID] || {};

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
        player.tell(Text.red(`You cannot resolve a deficit unless you have contributed excess assets to the Kingdom, and ${targetName} has an active negative balance.`));
        return 0;
    }

    ledger[pUUID] = pData;
    ledger[targetUUID] = tData;

    server.persistentData.putString('tres_ledger', JSON.stringify(ledger));

    let msgStr = msgParts.join(' and ');
    player.tell(Text.green(`Successfully resolved ${msgStr} with ${targetName}.`));

    // Safely alerts target only if they are currently logged in
    let onlineTarget = server.players.find(p => String(p.uuid) === targetUUID);
    if (onlineTarget) {
        onlineTarget.tell(Text.green(`${player.username} has resolved ${msgStr} between your ledgers.`));
    }

    logAudit(server, 'vault', `${player.username} & ${targetName} resolved ${msgStr}`);
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

    // UPGRADED: Loops through structural UUID keys, but builds strings using cached usernames
    for (let userUUID in ledger) {
        let hasAssets = false;
        let pStr = [];
        let kStr = [];

        for (let key in ledger[userUUID]) {
            if (!TREASURY_CONFIG.vault[key]) continue;

            let val = ledger[userUUID][key];
            if (val !== 0) {
                hasAssets = true;
                let label = TREASURY_CONFIG.vault[key].label;
                if (val > 0) pStr.push(`${val} ${label}`);
                if (val < 0) kStr.push(`${Math.abs(val)} ${label}`);
            }
        }

        if (hasAssets) {
            anythingTracked = true;
            let readableName = getCachedName(server, userUUID, `Player (${userUUID.substring(0, 6)})`);

            if (pStr.length > 0) {
                player.tell(Text.yellow(`- ${readableName} owes the vault: `).append(Text.white(pStr.join(', '))));
            }
            if (kStr.length > 0) {
                let identity = (userUUID === String(player.uuid)) ? 'you' : readableName;
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

    // Attempt to dynamically fetch and remove absolutely every key in persistent data
    let allKeys = [];
    try {
        allKeys = server.persistentData.getAllKeys();
    } catch(e) {
        // Fallback for differing KubeJS NBT versions
        try { allKeys = server.persistentData.nbt.getAllKeys(); } catch(err) {}
    }

    if (allKeys && allKeys.length > 0) {
        allKeys.forEach(k => server.persistentData.remove(k));
    } else {
        // Failsafe: Hardcoded wipe if dynamic key fetch is unsupported by your modloader version
        let knownKeys = [
            'tres_level', 'tres_maxEncoders', 'tres_encoders', 'tres_maxDecoders', 'tres_decoders',
            'tres_iron', 'tres_diamond', 'tres_netherite', 'tres_initialized', 'tres_audit_v2_vault',
            'tres_ledger', 'tres_name_cache', 'tres_target_resource', 'tres_target_amount',
            'honor_balances', 'current_king'
        ];
        knownKeys.forEach(k => server.persistentData.remove(k));
    }

    server.runCommandSilent(`tellraw @a {"text":"[!] The Server's Persistent Data has been completely wiped by an Admin. Reloading server...","color":"dark_red","bold":true}`);

    // Trigger KubeJS/Server reload
    server.runCommandSilent('reload');

    return 1;
}
