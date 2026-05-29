const TREASURY_EVAL_CONFIG = {
    currencies: {
        'utopia:bills_netherite': { rsd: 100, label: 'Netherite Bill' },
        'utopia:bills_netherite_slip': { rsd: 50, label: 'Netherite Slip' },
        'utopia:coin_diamond': { rsd: 20, label: 'Diamond Coin' },
        'utopia:coin_diamond_fractional': { rsd: 10, label: 'Diamond Fractional' },
        'utopia:coin_iron': { rsd: 2, label: 'Iron Coin' },
        'utopia:coin_iron_fractional': { rsd: 1, label: 'Iron Fractional' }
    }
};

ServerEvents.commandRegistry(event => {
    const { commands: C } = event;

    const registerEvaluateTree = (baseCommandName) => {
        event.register(C.literal(baseCommandName)
        .then(C.literal('evaluate')
        .then(C.literal('hand').executes(ctx => handleEvaluate(ctx, 'hand')))
        .then(C.literal('inventory').executes(ctx => handleEvaluate(ctx, 'inventory')))
        )
        );
    };

    registerEvaluateTree('treasury');
    registerEvaluateTree('tres');
});

function handleEvaluate(ctx, mode) {
    const player = ctx.source.player;
    if (!player) return 0;

    let totalRSD = 0;
    let counts = {};

    if (mode === 'hand') {
        let item = player.mainHandItem;
        let id = String(item.id);
        if (TREASURY_EVAL_CONFIG.currencies[id]) {
            counts[id] = item.count;
            totalRSD += TREASURY_EVAL_CONFIG.currencies[id].rsd * item.count;
        }
    } else if (mode === 'inventory') {
        for (let item of player.inventory.allItems) {
            if (item.isEmpty()) continue;
            let id = String(item.id);
            if (TREASURY_EVAL_CONFIG.currencies[id]) {
                counts[id] = (counts[id] || 0) + item.count;
                totalRSD += TREASURY_EVAL_CONFIG.currencies[id].rsd * item.count;
            }
        }
    }

    player.tell(Text.gold(`=== Currency Evaluation (${mode === 'hand' ? 'Main Hand' : 'Inventory'}) ===`));

    let foundCurrency = false;
    for (let id in counts) {
        if (counts[id] > 0) {
            let label = TREASURY_EVAL_CONFIG.currencies[id].label;
            player.tell(Text.yellow(`- ${label}: `).append(Text.white(counts[id])));
            foundCurrency = true;
        }
    }

    if (!foundCurrency) {
        player.tell(Text.gray('No circulating currency found in target space.'));
        return 1;
    }

    player.tell(Text.green(`\nTotal Value: ${totalRSD} R$D`));
    return 1;
}
