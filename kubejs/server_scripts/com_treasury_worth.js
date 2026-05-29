const TREASURY_WORTH_CONFIG = {
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
    }
};

ServerEvents.commandRegistry(event => {
    const { commands: C } = event;

    const registerWorthTree = (baseCommandName) => {
        event.register(C.literal(baseCommandName)
        .then(C.literal('worth')
        .then(C.literal('currency').executes(ctx => showCurrencyWorth(ctx)))
        .then(C.literal('exp').executes(ctx => showMaterialWorth(ctx)))
        )
        );
    };

    registerWorthTree('treasury');
    registerWorthTree('tres');
});

function showCurrencyWorth(ctx) {
    const player = ctx.source.player;
    if (!player) return 0;

    player.tell(Text.gold('--- Financial Worth (Circulating Currency) ---'));
    for (let itemId in TREASURY_WORTH_CONFIG.currencies) {
        let currency = TREASURY_WORTH_CONFIG.currencies[itemId];
        let rsdString = String(currency.rsd).padStart(3, ' ');
        player.tell(Text.green(`[ ${rsdString} R$D ] `).append(Text.white(`- ${currency.label}`)));
    }
    return 1;
}

function showMaterialWorth(ctx) {
    const player = ctx.source.player;
    if (!player) return 0;

    player.tell(Text.gold('--- Upgrade Materials (Treasury Fuel) ---'));
    for (let itemId in TREASURY_WORTH_CONFIG.upgrades) {
        let upgrade = TREASURY_WORTH_CONFIG.upgrades[itemId];
        let xpString = String(upgrade.xp).padStart(2, ' ');
        player.tell(Text.lightPurple(`[ ${xpString} EXP ] `).append(Text.white(`- ${upgrade.label}`)));
    }
    return 1;
}
