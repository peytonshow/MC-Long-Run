// 1. Initialize the 'king' team when the server loads
ServerEvents.loaded(event => {
    const server = event.server;
    server.runCommandSilent('team add king');
    server.runCommandSilent('team modify king prefix {"text":"[King] ","color":"gold"}');
});

// 2. Register the core /coronation subcommands
ServerEvents.commandRegistry(event => {
    const { commands: Commands, arguments: Arguments } = event;

    event.register(
        Commands.literal('coronation')

        // SUBCOMMAND: /coronation begin
        .then(Commands.literal('begin')
        .executes(ctx => {
            const player = ctx.source.player;
            const server = ctx.source.server;
            if (!player) return 0;

            const crownId = 'utopia:crown';
            const hasCrownOnHead = player.headArmorItem.id === crownId;
            const hasCrownInInv = player.inventory.count(crownId) > 0;

            let currentKing = server.persistentData.current_king;
            if(player.username == currentKing) {
                player.tell(Text.gold('You are already the King, fool!'));
            } else if (hasCrownOnHead) {

                // --- LEGITIMACY CHECK ---
                let activeIdRaw = server.persistentData.active_crown_id;
                let activeIdStr = activeIdRaw != null ? String(activeIdRaw).split('.')[0].replace(/[^0-9]/g, '') : "";

                let customData = player.headArmorItem.get('minecraft:custom_data');
                let crownIdStr = "INVALID";

                if (customData) {
                    let rawValue = null;

                    if (customData.crown_id !== undefined) {
                        rawValue = customData.crown_id;
                    } else if (typeof customData.get === 'function') {
                        rawValue = customData.get('crown_id');
                    }

                    if (rawValue != null) {
                        crownIdStr = String(rawValue).split('.')[0].replace(/[^0-9]/g, '');
                    } else {
                        let match = String(customData).match(/crown_id["']?\s*[:=]\s*(\d+)/);
                        if (match) crownIdStr = match[1];
                    }
                }

                if (activeIdStr === "" || activeIdStr !== crownIdStr) {
                    player.setHeadArmorItem(Item.of('utopia:shattering_crown'));
                    server.runCommandSilent(`tellraw @a {"text":"${player.username} attempted to claim the throne with a FORGED Crown!","color":"red"}`);
                    return 0;
                }
                // --- END LEGITIMACY CHECK ---

                // Failsafe: Instantly boots everyone out of the king role before adding the new king
                server.runCommandSilent('team empty king');

                server.persistentData.current_king = player.username;
                server.runCommandSilent(`team join king ${player.username}`);

                // REAL CROWN: Stamps the crown with the current King's username
                player.headArmorItem.set('minecraft:lore', [`§6§lKing: ${player.username}`]);

                server.runCommandSilent(`tellraw @a {"text":"${player.username} has claimed the throne and is now the King!","color":"gold"}`);

            } else if (hasCrownInInv) {
                player.tell(Text.yellow('You hold the crown, now all that is left is to put it on your head to begin the Coronation.'));
            } else {
                let currentKing = server.persistentData.current_king;
                if (currentKing && currentKing !== '') {
                    player.tell(Text.red(`You do not have the crown. The current King, ${currentKing}, has it.`));
                } else {
                    player.tell(Text.red('You do not have the Crown. The Throne remains empty...'));
                }
            }
            return 1;
        })
        )

        // SUBCOMMAND: /coronation abdicate
        .then(Commands.literal('abdicate')
        .executes(ctx => {
            const player = ctx.source.player;
            const server = ctx.source.server;
            if (!player) return 0;

            let currentKing = server.persistentData.current_king;

            if (currentKing === player.username) {
                server.runCommandSilent(`team leave ${player.username}`);
                server.persistentData.current_king = '';

                player.tell(Text.green('You have abdicated the throne.'));
                server.runCommandSilent(`tellraw @a {"text":"${player.username} has abdicated! The throne is now empty.","color":"yellow"}`);
            } else {
                player.tell(Text.red('Only the King can abdicate, you buffoon!'));
            }
            return 1;
        })
        )

        // SUBCOMMAND: /coronation who
        .then(Commands.literal('who')
        .executes(ctx => {
            const player = ctx.source.player;
            const server = ctx.source.server;
            if (!player) return 0;

            let currentKing = server.persistentData.current_king;

            if (currentKing && currentKing !== '') {
                player.tell(Text.gold(`The current King is ${currentKing}.`));
            } else {
                player.tell(Text.yellow('The throne is currently empty.'));
            }
            return 1;
        })
        )

        // SUBCOMMAND: /coronation promote <player>
        .then(Commands.literal('promote')
        .requires(src => src.hasPermission(2))
        .then(Commands.argument('target', Arguments.PLAYER.create(event))
        .executes(ctx => {
            let player = ctx.source.player;
            let target = Arguments.PLAYER.getResult(ctx, 'target');

            // Generates a strictly unique numeric ID using the current timestamp
            let uniqueId = Date.now() + Math.floor(Math.random() * 1000);

            let crown = Item.of('utopia:crown');
            crown.set('minecraft:custom_data', { crown_id: uniqueId });

            // Intended Coup Feature: This actively overwrites the current King's legitimacy
            ctx.source.server.persistentData.active_crown_id = uniqueId;

            target.give(crown);

            player.tell(Text.green(`Promoted! ${target.username} has been given an initialized crown with ID: ${uniqueId}.`));
            target.tell(Text.gold('You have been granted the Royal Crown. Put it on and use /coronation begin to claim the throne!'));
            return 1;
        })
        )
        )
    );
});
