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

    event.register(
        C.literal('decree')
        .then(C.literal('tax')
        .executes(ctx => showTaxInfo(ctx))
        .then(C.literal('invoice')
        .then(C.argument('amount', A.INTEGER.create(event))
        .then(C.argument('target', A.PLAYER.create(event))
        .executes(ctx => handleTaxInvoice(ctx, A.INTEGER.getResult(ctx, 'amount'), A.PLAYER.getResult(ctx, 'target')))
        )
        )
        )
        .then(C.literal('deduct')
        .then(C.argument('amount', A.INTEGER.create(event))
        .then(C.argument('target', A.PLAYER.create(event))
        .executes(ctx => handleTaxDeduct(ctx, A.INTEGER.getResult(ctx, 'amount'), A.PLAYER.getResult(ctx, 'target')))
        )
        )
        )
        .then(C.literal('owed')
        .then(C.argument('target', A.PLAYER.create(event))
        .executes(ctx => showTaxOwed(ctx, A.PLAYER.getResult(ctx, 'target')))
        )
        )
        )
        .then(C.literal('inscribe')
        .then(C.argument('text', A.GREEDY_STRING.create(event))
        .executes(ctx => handleInscribe(ctx, A.GREEDY_STRING.getResult(ctx, 'text')))
        )
        )
    );
});

// ============================================================================
//                          TAX / DECREE LOGIC
// ============================================================================

function showTaxInfo(ctx) {
    const player = ctx.source.player;
    const server = ctx.source.server;
    if (!player) return 0;

    let decree = server.persistentData.tres_tax_decree;

    player.tell(Text.gold('=== Royal Tax Decree ==='));
    if (decree && decree !== '') {
        player.tell(Text.white(decree));
    } else {
        player.tell(Text.gray('The King has not inscribed any tax information yet.'));
    }
    return 1;
}

function handleInscribe(ctx, text) {
    const player = ctx.source.player;
    const server = ctx.source.server;
    if (!player) return 0;

    let currentKing = server.persistentData.current_king;
    if (player.username !== currentKing) {
        player.tell(Text.red('Only the King can inscribe the tax decree!'));
        return 0;
    }

    server.persistentData.tres_tax_decree = text;
    player.tell(Text.green('Tax decree successfully inscribed.'));

    // Updated alert to point to the standalone command
    server.runCommandSilent(`tellraw @a {"text":"The King has updated the Royal Tax Decree! Type /decree tax to read it.","color":"gold"}`);
    return 1;
}

function handleTaxInvoice(ctx, amount, target) {
    const player = ctx.source.player;
    const server = ctx.source.server;
    if (!player) return 0;

    let currentKing = server.persistentData.current_king;
    if (player.username !== currentKing) {
        player.tell(Text.red('Only the King can issue tax invoices!'));
        return 0;
    }

    if (amount <= 0) {
        player.tell(Text.red('Amount must be greater than 0.'));
        return 0;
    }

    let key = 'tres_tax_owed_' + target.username;
    let currentOwed = safeNum(server.persistentData[key], 0);
    let newOwed = currentOwed + amount;

    server.persistentData[key] = newOwed;

    player.tell(Text.green(`Invoiced ${target.username} for ${amount}. They now owe a total of ${newOwed}.`));
    target.tell(Text.gold(`[Royal Decree] The King has invoiced you for ${amount} in taxes! You now owe a total of ${newOwed}.`));
    return 1;
}

function handleTaxDeduct(ctx, amount, target) {
    const player = ctx.source.player;
    const server = ctx.source.server;
    if (!player) return 0;

    let currentKing = server.persistentData.current_king;
    if (player.username !== currentKing) {
        player.tell(Text.red('Only the King can deduct from owed taxes!'));
        return 0;
    }

    if (amount <= 0) {
        player.tell(Text.red('Amount must be greater than 0.'));
        return 0;
    }

    let key = 'tres_tax_owed_' + target.username;
    let currentOwed = safeNum(server.persistentData[key], 0);
    let newOwed = Math.max(0, currentOwed - amount); // Prevents negative debt

    server.persistentData[key] = newOwed;

    player.tell(Text.green(`Deducted ${amount} from ${target.username}'s taxes. They now owe ${newOwed} total.`));
    target.tell(Text.yellow(`[Royal Decree] The King has marked off ${amount} from your owed taxes. You now owe a total of ${newOwed}.`));
    return 1;
}

function showTaxOwed(ctx, target) {
    const player = ctx.source.player;
    const server = ctx.source.server;
    if (!player) return 0;

    let key = 'tres_tax_owed_' + target.username;
    let currentOwed = safeNum(server.persistentData[key], 0);

    player.tell(Text.yellow(`${target.username} currently owes `).append(Text.white(`${currentOwed}`)).append(Text.yellow(` in taxes.`)));
    return 1;
}
