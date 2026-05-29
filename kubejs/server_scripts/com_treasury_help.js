function safeNum(val, fallback) {
    if (val == null) return fallback;
    let str = String(val).split('.')[0].replace(/[^0-9-]/g, '');
    let num = parseInt(str, 10);
    return isNaN(num) ? fallback : num;
}

ServerEvents.commandRegistry(event => {
    const { commands: C, arguments: A } = event;

    event.register(C.literal('treasury')
    .executes(ctx => showLevelInfo(ctx))
    .then(C.literal('help')
    .executes(ctx => showHelpPage(ctx, 1))
    .then(C.argument('page', A.INTEGER.create(event))
    .executes(ctx => showHelpPage(ctx, A.INTEGER.getResult(ctx, 'page')))
    )
    )
    );
});

function showHelpPage(ctx, page) {
    const player = ctx.source.player;
    if (!player) return 0;

    // --- Clear Chat History ---
    for (let i = 0; i < 100; i++) { player.tell(' '); }

    let targetPage = safeNum(page, 1);
    if (targetPage < 1) targetPage = 1;
    if (targetPage > 5) targetPage = 5;

    let pageContent;

    // Page 1: Command Directory
    if (targetPage === 1) {
        pageContent = Text.red('=== Command Directory (Page 1/5) ===\n')
        .append(Text.yellow('/tres level ')).append(Text.gray('- Check Treasury Level\n'))
        .append(Text.yellow('/tres level add ')).append(Text.gray('- Deposit Materials for Treasury EXP\n'))
        .append(Text.yellow('/tres worth <currency|exp> ')).append(Text.gray('- View Currency/EXP values\n'))
        .append(Text.yellow('/tres stamp <type> <add|remove> <qty>\n'))
        .append(Text.yellow('/tres stamp resolve <player> ')).append(Text.gray('- Resolve Stamp imbalances\n'))
        .append(Text.yellow('/tres evaluate <hand|inventory> ')).append(Text.gray('- Check wealth\n'))
        .append(Text.yellow('/tres audit <ledger|latest> <exp|stamp> ')).append(Text.gray('- History logs\n\n'))
        .append(Text.gray('Use /tres help <2-5> for manual chapters.'));
        // Page 2: Currencies
    } else if (targetPage === 2) {
        pageContent = Text.red('=== Chapter I: The Economy (Page 2/5) ===\n')
        .append(Text.white(' The economy is built on the ')).append(Text.green('Royal Dollar (R$D)')).append(Text.white(', which only the King can authorize. All currency, no matter how indirectly, was commisioned by the King.\n\n'))
        .append(Text.white('Currency Rules:\n'))
        .append(Text.white('1. ')).append(Text.yellow('Fractionals: ')).append(Text.white('Bills and Coins can be split and recombined freely into their half counterpart.\n'))
        .append(Text.white('2. ')).append(Text.yellow('Downgrading: ')).append(Text.white('Raw currency can be split into lower tiers (e.g., Diamond to Iron), but this does not apply upward.'));
        // Page 3: Stamps
    } else if (targetPage === 3) {
        pageContent = Text.red('=== Chapter II: Stamps & Infrastructure (Page 3/5) ===\n')
        .append(Text.white('Stamps facilitate the conversion of wealth:\n'))
        .append(Text.gray('• Encoders: ')).append(Text.white('Convert raw materials into money.\n'))
        .append(Text.gray('• Decoders: ')).append(Text.white('Convert money back into raw materials.\n\n'))
        .append(Text.white('• Access: ')).append(Text.white('Because the King controls the Stamps, it may not be possible to obtain them directly. The King\'s policy may prohibit distributing stamps direcyly.'));

        // Page 4: The King's Role
    } else if (targetPage === 4) {
        pageContent = Text.red('=== Chapter III: The King\'s Mandate (Page 4/5) ===\n')
        .append(Text.white('The King serves as the guardian of the vault.\n\n'))
        .append(Text.gold('• Exclusive Access: ')).append(Text.white('Only the King is authorized to remove stamps from the Treasury.\n'))
        .append(Text.gold('• Royal Incentives: ')).append(Text.white('By maintaining the vault and collecting taxes, the King earns ')).append(Text.gold('Royal Points')).append(Text.white('. These points are awarded as the Treasury grows, fueling the Kingdom\'s prosperity.'));

        // Page 5: Treasury & Leveling
    } else if (targetPage === 5) {
        pageContent = Text.red('=== Chapter IV: The Treasury (Page 5/5) ===\n')
        .append(Text.white(' The Treasury is the heart of the King\'s Power, granting more Stamps and Upgrade Points. Upgrade Points give the ability to purchase certain actions or items from their exclusive shop. You can level it up yourself for political favor with the King, or the King may improve it themselves. All transactions are viewable on the Ledger.\n\n'))
        .append(Text.gold('• How to Upgrade:\n'))
        .append(Text.white('Deposit ')).append(Text.gold('Gold Ingots')).append(Text.white(' or ')).append(Text.green('Emeralds')).append(Text.white(' using ')).append(Text.yellow('/tres level add')).append(Text.white('.'))
    }

    // Single output call
    player.tell(pageContent);

    return 1;
}
