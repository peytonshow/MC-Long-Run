// ============================================================================
//                          HELPER FUNCTIONS
// ============================================================================
const MAX_DECREES = 10;

function safeNum(val, fallback) {
    if (val == null) return fallback;
    let str = String(val).split('.')[0].replace(/[^0-9-]/g, '');
    let num = parseInt(str, 10);
    return isNaN(num) ? fallback : num;
}

function getDecrees(server) {
    if (server.persistentData.contains('tres_decrees')) {
        try {
            return JSON.parse(server.persistentData.getString('tres_decrees'));
        } catch (e) {
            return [];
        }
    }
    return [];
}

function saveDecrees(server, decrees) {
    server.persistentData.putString('tres_decrees', JSON.stringify(decrees));
}

// ============================================================================
//                          COMMAND REGISTRY
// ============================================================================
ServerEvents.commandRegistry(event => {
    const { commands: C, arguments: A } = event;

    event.register(
        C.literal('decree')

        // --- DECREE MANAGEMENT ---

        // Read decrees (1 page per section)
        .then(C.literal('read')
        .executes(ctx => showDecree(ctx, 1)) // Defaults to section 1
        .then(C.argument('section', A.INTEGER.create(event))
        .executes(ctx => showDecree(ctx, A.INTEGER.getResult(ctx, 'section')))
        )
        )

        // Edit decrees (Add and Remove)
        .then(C.literal('edit')
        // Add a new decree
        .then(C.literal('add')
        .then(C.argument('text', A.GREEDY_STRING.create(event))
        .executes(ctx => handleAddDecree(ctx, A.GREEDY_STRING.getResult(ctx, 'text')))
        )
        )

        // Remove decrees (Menu and Action)
        .then(C.literal('remove')
        .executes(ctx => showRemoveMenu(ctx))
        .then(C.argument('section', A.INTEGER.create(event))
        .executes(ctx => handleRemoveDecree(ctx, A.INTEGER.getResult(ctx, 'section')))
        )
        )
        )

        // --- FINANCIAL / TAX COMMANDS ---

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
    );
});

// ============================================================================
//                          DECREE / TAX LOGIC
// ============================================================================

function showDecree(ctx, sectionNum) {
    const player = ctx.source.player;
    const server = ctx.source.server;
    if (!player) return 0;

    let decrees = getDecrees(server);

    if (decrees.length === 0) {
        player.tell(Text.gray('The King has not issued any Royal Decrees yet.'));
        return 1;
    }

    let targetSection = safeNum(sectionNum, 1);
    if (targetSection < 1) targetSection = 1;
    if (targetSection > decrees.length) targetSection = decrees.length;

    let text = decrees[targetSection - 1];

    player.tell(Text.gold(`=== Royal Decree (§ ${targetSection}/${decrees.length}) ===`));
    player.tell(Text.white(text));

    if (targetSection < decrees.length) {
        player.tell(Text.gray(`\nUse /decree read ${targetSection + 1} to read the next section.`));
    }

    return 1;
}

function handleAddDecree(ctx, text) {
    const player = ctx.source.player;
    const server = ctx.source.server;
    if (!player) return 0;

    let currentKing = server.persistentData.current_king;
    if (player.username !== currentKing) {
        player.tell(Text.red('Only the King can issue a decree!'));
        return 0;
    }

    if (text.trim() === '') {
        player.tell(Text.red('Decrees cannot be empty!'));
        return 0;
    }

    let decrees = getDecrees(server);

    if (decrees.length >= MAX_DECREES) {
        player.tell(Text.red(`The Kingdom can only maintain ${MAX_DECREES} active decrees! Please remove one first.`));
        return 0;
    }

    decrees.push(text.trim());
    saveDecrees(server, decrees);

    player.tell(Text.green(`Decree added as § ${decrees.length}.`));
    server.runCommandSilent(`tellraw @a {"text":"The King has issued a new Royal Decree! Type /decree read ${decrees.length} to read it.","color":"gold"}`);
    return 1;
}

function showRemoveMenu(ctx) {
    const player = ctx.source.player;
    const server = ctx.source.server;
    if (!player) return 0;

    let currentKing = server.persistentData.current_king;
    if (player.username !== currentKing) {
        player.tell(Text.red('Only the King can remove decrees!'));
        return 0;
    }

    let decrees = getDecrees(server);

    if (decrees.length === 0) {
        player.tell(Text.gray('There are no decrees to remove.'));
        return 1;
    }

    player.tell(Text.gold('=== Decree Removal Menu ==='));

    decrees.forEach((text, idx) => {
        let snippet = text.length > 15 ? text.substring(0, 15) + '...' : text;
        player.tell(Text.yellow(`§ ${idx + 1}: `).append(Text.white(`"${snippet}"`)));
    });

    player.tell(Text.gray('\nUse /decree edit remove <number> to delete a specific decree.'));
    return 1;
}

function handleRemoveDecree(ctx, sectionNum) {
    const player = ctx.source.player;
    const server = ctx.source.server;
    if (!player) return 0;

    let currentKing = server.persistentData.current_king;
    if (player.username !== currentKing) {
        player.tell(Text.red('Only the King can remove decrees!'));
        return 0;
    }

    let decrees = getDecrees(server);
    let targetSection = safeNum(sectionNum, 0);

    if (targetSection < 1 || targetSection > decrees.length) {
        player.tell(Text.red('Invalid section number! Type /decree edit remove to view valid options.'));
        return 0;
    }

    // Remove the item at the specific index
    decrees.splice(targetSection - 1, 1);
    saveDecrees(server, decrees);

    player.tell(Text.green(`Successfully removed section § ${targetSection}. Subsequent decrees have shifted up.`));
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
