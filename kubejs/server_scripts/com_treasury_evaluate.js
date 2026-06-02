const PAPER_CURRENCY = {
    'utopia:bill_one': { rsd: 1, label: '1$ Bill' },
    'utopia:bill_five': { rsd: 5, label: '5$ Bill' },
    'utopia:bill_twenty': { rsd: 20, label: '20$ Bill' },
    'utopia:bill_one_hundred': { rsd: 100, label: '100$ Bill' },
    'utopia:bill_one_thousand': { rsd: 1000, label: '1000$ Bill' }
};

const MATERIAL_CURRENCY = {
    'iron': { id: 'utopia:coin_iron', fracId: 'utopia:coin_iron_fractional', label: 'Iron' },
    'diamond': { id: 'utopia:coin_diamond', fracId: 'utopia:coin_diamond_fractional', label: 'Diamond' },
    'netherite': { id: 'utopia:coin_netherite', fracId: 'utopia:coin_netherite_slip', label: 'Scrap' }
};

function getDynamicRate(server, type) {
    let key = 'tres_rate_' + type;
    return server.persistentData.contains(key) ? server.persistentData.getDouble(key) : 0;
}

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
    const server = ctx.source.server;
    if (!player) return 0;

    let totalRSD = 0;
    let counts = {};

    const getItemData = (id) => {
        if (PAPER_CURRENCY[id]) return { val: PAPER_CURRENCY[id].rsd, label: PAPER_CURRENCY[id].label };
        for (let type in MATERIAL_CURRENCY) {
            let mat = MATERIAL_CURRENCY[type];
            let rate = getDynamicRate(server, type);
            if (id === mat.id) return { val: rate, label: `${mat.label} Coin` };
            if (id === mat.fracId) return { val: rate / 2, label: `${mat.label} Fractional` };
        }
        return null;
    };

    const processItem = (item) => {
        let data = getItemData(String(item.id));
        if (data && data.val > 0) {
            counts[data.label] = (counts[data.label] || 0) + item.count;
            totalRSD += data.val * item.count;
        }
    };

    if (mode === 'hand') {
        processItem(player.mainHandItem);
    } else if (mode === 'inventory') {
        for (let item of player.inventory.allItems) {
            if (!item.isEmpty()) processItem(item);
        }
    }

    player.tell(Text.gold(`\n\n=== Wealth Evaluation (${mode === 'hand' ? 'Main Hand' : 'Inventory'}) ===`));

    let foundCurrency = false;
    for (let label in counts) {
        if (counts[label] > 0) {
            player.tell(Text.yellow(`- ${label}: `).append(Text.white(counts[label])));
            foundCurrency = true;
        }
    }

    if (!foundCurrency) {
        player.tell(Text.gray('No recognizable wealth found in target space.'));
        return 1;
    }

    player.tell(Text.green(`\nTotal Liquid Value: ${totalRSD} R$D`));
    return 1;
}
