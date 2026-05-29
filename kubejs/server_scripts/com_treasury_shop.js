const TREASURY_SHOP_CONFIG = {
    1: { id: 'utopia:bills_netherite_slip', count: 1, cost: 1, label: 'Netherite Slip' },
    2: { id: 'utopia:bills_netherite', count: 1, cost: 2, label: 'Netherite Bill' },
    3: { id: 'minecraft:paper', count: 1, cost: 5, label: 'Mercenary Raid Orders', nbt: { treasury_ability: 'mercenaries' } },
    4: { id: 'minecraft:paper', count: 1, cost: 15, label: 'Royal Killswitch', nbt: { treasury_ability: 'killswitch' } }
};

function safeNum(val, fallback) {
    if (val == null) return fallback;
    let str = String(val).split('.')[0].replace(/[^0-9-]/g, '');
    let num = parseInt(str, 10);
    return isNaN(num) ? fallback : num;
}

function showShopPage(ctx) {
    const player = ctx.source.player;
    const server = ctx.source.server;

    if (player.username != server.persistentData.current_king) {
        player.tell(Text.red('Only the King can view the Royal Shop!'));
        return 0;
    }

    let points = safeNum(server.persistentData.tres_points, 0);

    let shopMenu = Text.gold('=== Royal Upgrade Point Shop ===\n')
    .append(Text.yellow(`Available Royal Points: ${points}\n`))
    .append(Text.gray('Use /tres shop buy <index> [quantity] to purchase items.\n\n'));

    for (let index in TREASURY_SHOP_CONFIG) {
        let shopItem = TREASURY_SHOP_CONFIG[index];
        shopMenu.append(Text.aqua(`[#${index}] `))
        .append(Text.green(`${shopItem.label} `))
        .append(Text.gray(`(x${shopItem.count}) `))
        .append(Text.yellow(`- Cost: ${shopItem.cost} Pts\n`));
    }

    player.tell(shopMenu);
    return 1;
}

function handleShopBuy(ctx, index, quantity) {
    const player = ctx.source.player;
    const server = ctx.source.server;
    if (!player) return 0;


    if (player.username != server.persistentData.current_king) {
        player.tell(Text.red('Only the King can purchase from the Royal Shop!'));
        return 0;
    }

    if (quantity <= 0) {
        player.tell(Text.red('Quantity must be greater than 0!'));
        return 0;
    }

    const shopItem = TREASURY_SHOP_CONFIG[index];
    if (!shopItem) {
        player.tell(Text.red(`Invalid shop item index! Type /tres shop to browse available entries.`));
        return 0;
    }

    let points = safeNum(server.persistentData.tres_points, 0);
    let totalCost = shopItem.cost * quantity;

    if (points < totalCost) {
        player.tell(Text.red(`Insufficient Royal Points! Required: ${totalCost}, Available: ${points}.`));
        return 0;
    }

    server.persistentData.tres_points = points - totalCost;

    let totalCount = shopItem.count * quantity;
    let itemStack = Item.of(shopItem.id, totalCount);

    if (shopItem.nbt) {
        itemStack = itemStack.withNBT(shopItem.nbt);
        try {
            itemStack.set('minecraft:custom_data', shopItem.nbt);
        } catch(e) {}
    }

    player.give(itemStack);
    player.tell(Text.green(`Purchased ${totalCount}x ${shopItem.label} for ${totalCost} Royal Points.`));
    player.tell(Text.yellow(`Remaining Balance: ${server.persistentData.tres_points} Points.`));

    let cleanItemId = String(shopItem.id).split(':').pop();
    logAudit(server, 'stamps', `${player.username} with ${totalCount} ${cleanItemId}`);

    return 1;
}
