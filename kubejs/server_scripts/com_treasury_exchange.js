// ============================================================================
//                      TREASURY EXCHANGE SYSTEM
// ============================================================================
const EX_BILLS = [
    { id: 'utopia:1000_dollar_bill', val: 1000 },
    { id: 'utopia:100_dollar_bill', val: 100 },
    { id: 'utopia:20_dollar_bill', val: 20 },
    { id: 'utopia:5_dollar_bill', val: 5 },
    { id: 'utopia:1_dollar_bill', val: 1 }
];

function safeNum(val, fallback) {
    if (val == null) return fallback;
    let str = String(val).split('.')[0].replace(/[^0-9-]/g, '');
    let num = parseInt(str, 10);
    return isNaN(num) ? fallback : num;
}

function getPlayerPaperBalance(player) {
    let bal = 0;
    for (let item of player.inventory.allItems) {
        if (item.isEmpty()) continue;
        let strId = String(item.id);
        let bill = EX_BILLS.find(b => b.id === strId);
        if (bill) bal += bill.val * item.count;
    }
    return bal;
}

function processPaperPayment(player, server, cost) {
    let currentBal = getPlayerPaperBalance(player);
    if (currentBal < cost) return false;

    // Wipe all paper from inventory
    EX_BILLS.forEach(b => server.runCommandSilent(`clear "${player.username}" ${b.id}`));

    // Give back exact change
    let changeDue = currentBal - cost;
    for (let b of EX_BILLS) {
        let count = Math.floor(changeDue / b.val);
        if (count > 0) {
            player.give(Item.of(b.id, count));
            changeDue -= count * b.val;
        }
    }
    return true;
}

ServerEvents.commandRegistry(event => {
    const { commands: C, arguments: A } = event;

    const registerExchangeTree = (baseCommandName) => {
        event.register(C.literal(baseCommandName)
        // /tres exchange <material> <amount>
        .then(C.literal('exchange')
        .then(C.argument('material', A.STRING.create(event))
        .then(C.argument('rsd_amount', A.INTEGER.create(event))
        .executes(ctx => handleTradeIn(ctx, A.STRING.getResult(ctx, 'material'), A.INTEGER.getResult(ctx, 'rsd_amount')))
        )
        )
        )
        // /tres rate ...
        .then(C.literal('rate')
        // 1. Base Command: Shows Info & Rates
        .executes(ctx => showExchangeInfo(ctx))

        // 2. Admin Command: King Sets the Rate
        .then(C.literal('set')
        .then(C.argument('material', A.STRING.create(event))
        .then(C.argument('rate', A.DOUBLE.create(event))
        .executes(ctx => handleSetRate(ctx, A.STRING.getResult(ctx, 'material'), A.DOUBLE.getResult(ctx, 'rate')))
        )
        )
        )
        )
        );
    };

    registerExchangeTree('treasury');
    registerExchangeTree('tres');
});

// ============================================================================
//                              COMMAND LOGIC
// ============================================================================

function showExchangeInfo(ctx) {
    const player = ctx.source.player;
    const server = ctx.source.server;
    if (!player) return 0;

    player.tell(Text.gold('\n=== Treasury Paper Exchange ==='));
    player.tell(Text.gray('Trade in your Paper Currency for Kingdom Assets.'));
    player.tell(Text.yellow('Usage: ').append(Text.white('/tres exchange <iron|diamond|scrap> <R$D_Amount>')));

    player.tell(Text.gold('\n--- Active Exchange Rates ---'));
    ['iron', 'diamond', 'scrap'].forEach(mat => {
        let rateKey = 'tres_rate_' + mat;
        let rate = server.persistentData.contains(rateKey) ? server.persistentData.getDouble(rateKey) : 0;

        let label = mat.charAt(0).toUpperCase() + mat.slice(1);
        if (rate > 0) {
            player.tell(Text.green(`[ ${rate} R$D ] `).append(Text.white(`= 1 ${label} Coin`)));
        } else {
            player.tell(Text.red(`[ Unpegged ] `).append(Text.gray(`- ${label} is not trading.`)));
        }
    });
    player.tell(' ');
    return 1;
}

function handleSetRate(ctx, rawMat, rate) {
    const player = ctx.source.player;
    const server = ctx.source.server;
    if (player.username !== server.persistentData.current_king) {
        player.tell(Text.red('Only the King can set exchange rates.'));
        return 0;
    }

    let mat = String(rawMat).toLowerCase();
    if (mat !== 'iron' && mat !== 'diamond' && mat !== 'scrap') {
        player.tell(Text.red(`Invalid material. Valid coins: iron, diamond, scrap.`));
        return 0;
    }

    server.persistentData['tres_rate_' + mat] = rate;

    let label = mat.charAt(0).toUpperCase() + mat.slice(1);
    server.runCommandSilent(`tellraw @a {"text":"[!] The King has adjusted the Exchange Rate! ${label} Coins are now pegged at ${rate} R$D.","color":"gold"}`);
    return 1;
}

function handleTradeIn(ctx, rawMat, rsdAmount) {
    const player = ctx.source.player;
    const server = ctx.source.server;
    if (!player) return 0;

    let mat = String(rawMat).toLowerCase();
    const validMats = {
        'iron': 'utopia:coin_iron',
        'diamond': 'utopia:coin_diamond',
        'scrap': 'utopia:coin_netherite'
    };

    if (!validMats[mat]) {
        player.tell(Text.red(`Invalid material. Valid coins: iron, diamond, scrap.`));
        return 0;
    }

    if (rsdAmount <= 0) {
        player.tell(Text.red('You must trade in an amount greater than 0 R$D.'));
        return 0;
    }

    let rateKey = 'tres_rate_' + mat;
    let rate = server.persistentData.contains(rateKey) ? server.persistentData.getDouble(rateKey) : 0;

    if (rate <= 0) {
        player.tell(Text.red(`The Kingdom is not currently accepting paper for ${mat}. The rate is unpegged.`));
        return 0;
    }

    // Must be cleanly divisible to issue whole coins from the vault
    if (rsdAmount % rate !== 0) {
        player.tell(Text.red(`Your R$D amount (${rsdAmount}) must be a clean multiple of the current rate (${rate}) to receive whole coins.`));
        return 0;
    }

    let coinQty = Math.floor(rsdAmount / rate);
    let vaultKey = 'tres_' + mat;
    let vaultStock = safeNum(server.persistentData[vaultKey], 0);

    // Checks if the Treasury has physically run out of coins
    if (vaultStock < coinQty) {
        player.tell(Text.red(`The Treasury does not have enough ${mat} to fulfill this exchange. (Stock: ${vaultStock}, Requested: ${coinQty})`));
        return 0;
    }

    let balance = getPlayerPaperBalance(player);
    if (balance < rsdAmount) {
        player.tell(Text.red(`Insufficient funds. You are trying to trade in ${rsdAmount} R$D, but only have ${balance} R$D in paper currency.`));
        return 0;
    }

    // Takes exact paper amount, gives change if necessary
    processPaperPayment(player, server, rsdAmount);

    // Distribute the material coins in manageable chunks
    let remainingCoins = coinQty;
    let coinId = validMats[mat];
    while (remainingCoins > 0) {
        let chunk = Math.min(remainingCoins, 64);
        player.give(Item.of(coinId, chunk));
        remainingCoins -= chunk;
    }

    // Deduct physical assets from Treasury data
    server.persistentData[vaultKey] = vaultStock - coinQty;

    let label = mat.charAt(0).toUpperCase() + mat.slice(1);
    player.tell(Text.green(`Successfully traded in ${rsdAmount} R$D for ${coinQty}x ${label} Coins.`));
    return 1;
}
