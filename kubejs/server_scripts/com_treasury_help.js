function safeNum(val, fallback) {
    if (val == null) return fallback;
    let str = String(val).split('.')[0].replace(/[^0-9-]/g, '');
    let num = parseInt(str, 10);
    return isNaN(num) ? fallback : num;
}

ServerEvents.commandRegistry(event => {
    const { commands: C, arguments: A } = event;

    event.register(C.literal('treasuryhelp')
    .executes(ctx => showHelpPage(ctx, 1))
    .then(C.argument('page', A.INTEGER.create(event))
    .executes(ctx => showHelpPage(ctx, A.INTEGER.getResult(ctx, 'page')))
    )
    );

    // Alias for quick typing
    event.register(C.literal('treshelp')
    .executes(ctx => showHelpPage(ctx, 1))
    .then(C.argument('page', A.INTEGER.create(event))
    .executes(ctx => showHelpPage(ctx, A.INTEGER.getResult(ctx, 'page')))
    )
    );
});

function showHelpPage(ctx, page) {
    const player = ctx.source.player;
    if (!player) return 0;

    for (let i = 0; i < 2; i++) { player.tell(' '); }

    let targetPage = safeNum(page, 1);
    if (targetPage < 1) targetPage = 1;
    if (targetPage > 4) targetPage = 4;

    let pageContent;

    if (targetPage === 1) {
        pageContent = Text.red('\n\n=== Command Directory (Page 1/4) ===\n')
        .append(Text.yellow('/tres vault ')).append(Text.gray('- Check Treasury Dashboard & Meters\n'))
        .append(Text.yellow('/tres worth ')).append(Text.gray('- View Currency Values\n'))
        .append(Text.yellow('/tres vault <iron|diamond|netherite> <add|withdraw> <qty>\n'))
        .append(Text.yellow('/tres stamp resolve <player> ')).append(Text.gray('- Resolve ledger debts\n'))
        .append(Text.yellow('/tres audit ledger vault ')).append(Text.gray('- View who owes the Kingdom\n\n'))
        .append(Text.gray('Use /treshelp <2-4> for manual chapters.'));
    } else if (targetPage === 2) {
        pageContent = Text.red('\n\n=== Chapter I: The Economy (Page 2/4) ===\n')
        .append(Text.white('The economy is built on the ')).append(Text.green('Royal Dollar (R$D)')).append(Text.white('. All currency, no matter how indirectly, was commissioned by the King.\n\n'))
        .append(Text.white('1. ')).append(Text.yellow('Fractionals: ')).append(Text.white('Bills and Coins can be split and recombined freely.\n'))
        .append(Text.white('2. ')).append(Text.yellow('Encoders: ')).append(Text.white('Stamps controlled strictly by the King to convert raw wealth.'));
    } else if (targetPage === 3) {
        pageContent = Text.red('\n\n=== Chapter II: The King\'s Mandate (Page 3/4) ===\n')
        .append(Text.white('The King serves as the guardian of the vault.\n\n'))
        .append(Text.gold('• Exclusive Access: ')).append(Text.white('Only the King is authorized to remove assets from the Treasury.\n'))
        .append(Text.gold('• Royal Incentives: ')).append(Text.white('By improving the Treasury, the King earns ')).append(Text.gold('Royal Points')).append(Text.white(' and generates new ')).append(Text.gold('Encoders')).append(Text.white('.'));
    } else if (targetPage === 4) {
        pageContent = Text.red('\n\n=== Chapter III: The National Hoard (Page 4/4) ===\n')
        .append(Text.white('To level up the Treasury, the Kingdom must reach a specific "Hoard Goal" (filling the vault with Iron, Diamond, or Netherite). The required resource changes upon leveling up.\n\n'))
        .append(Text.gold('• How to Upgrade:\n'))
        .append(Text.white('Deposit the requested currency using ')).append(Text.yellow('/tres vault <type> add')).append(Text.white('. When the target threshold is met, the Treasury expands its capacity, and generates rewards.'));
    }

    player.tell(pageContent);
    return 1;
}
