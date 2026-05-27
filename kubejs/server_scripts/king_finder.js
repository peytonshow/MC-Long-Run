// 1. Initialize the 'king' team when the server starts
ServerEvents.loaded(event => {
    const server = event.server;
    // Create the team (fails silently if it already exists, which is fine)
    server.runCommandSilent('team add king');
    // Set the prefix for Chat and Tab Menu
    server.runCommandSilent('team modify king prefix {"text":"[King] ","color":"gold"}');
});

// 2. Check player inventories to grant/revoke the status
PlayerEvents.tick(event => {
    const player = event.player;
    const server = event.server;

    // To prevent lag, we only run this on the server side, and only check every 10 ticks (0.5 seconds)
    if (player.level.clientSide || player.age % 10 !== 0) return;

    // Check if the player has the crown anywhere in their inventory/armor slots
    let hasCrown = player.inventory.count('utopia:crown') > 0;

    // We use a tag to track if they already have the status, so we don't spam commands
    let isKing = player.tags.contains('is_king');

    if (hasCrown && !isKing) {
        // The crown entered their inventory
        player.tags.add('is_king');
        server.runCommandSilent(`team join king ${player.username}`);
        player.tell(Text.gold('You now hold the crown. You are the King!'));

    } else if (!hasCrown && isKing) {
        // The crown left their inventory
        player.tags.remove('is_king');
        server.runCommandSilent(`team leave ${player.username}`);
        player.tell(Text.red('You have lost the crown. You are no longer King.'));
    }
});
