// ============================================================================
//                          COMMAND REGISTRY
// ============================================================================
ServerEvents.commandRegistry(event => {
    const { commands: C, arguments: A } = event;

    event.register(
        C.literal('consecrate')

        // 1. ADD A BUILDING (King Only)
        .then(C.literal('add')
        .then(C.argument('name', A.STRING.create(event))
        .executes(ctx => handleAdd(ctx, A.STRING.getResult(ctx, 'name')))
        )
        )

        // 2. REMOVE A BUILDING (King Only)
        .then(C.literal('remove')
        .then(C.argument('name', A.STRING.create(event))
        .executes(ctx => handleRemove(ctx, A.STRING.getResult(ctx, 'name')))
        )
        )

        // 3. LIST BUILDINGS (Pagination)
        .then(C.literal('list')
        .executes(ctx => handleList(ctx, 1))
        .then(C.argument('page', A.INTEGER.create(event))
        .executes(ctx => handleList(ctx, A.INTEGER.getResult(ctx, 'page')))
        )
        )

        // 4. FIND BUILDINGS (No args = List Page 1, String Arg = Tune Compass)
        .then(C.literal('find')
        .executes(ctx => handleList(ctx, 1))
        .then(C.argument('name', A.STRING.create(event))
        .executes(ctx => handleFind(ctx, A.STRING.getResult(ctx, 'name')))
        )
        )
    );
});

// ============================================================================
//                          COMMAND HANDLERS
// ============================================================================
function handleAdd(ctx, rawName) {
    let player = ctx.source.player;
    let server = ctx.source.server;
    if (!player) return 0;

    // Force the Java String into a native JavaScript string
    let name = String(rawName).trim();

    // Sanity checks for the name
    if (!name || name === '') {
        player.tell(Text.red('The site name cannot be empty.'));
        return 0;
    }

    if (name.length > 16) {
        player.tell(Text.red('The site name cannot be longer than 16 characters.'));
        return 0;
    }

    let currentKing = server.persistentData.current_king;
    if (player.username !== currentKing) {
        player.tell(Text.red('Only the King may consecrate a building.'));
        return 0;
    }

    let item = player.mainHandItem;
    if (item.id !== 'minecraft:compass') {
        player.tell(Text.red('You must be holding a Compass tuned to a Lodestone to consecrate a location.'));
        return 0;
    }

    // Safely check if the component exists
    if (!item.has('minecraft:lodestone_tracker')) {
        player.tell(Text.red('The compass must be actively tuned to a Lodestone.'));
        return 0;
    }

    let tracker = item.get('minecraft:lodestone_tracker');

    // KubeJS maps the Java Optional to a method in 1.20.5+
    let targetOpt = tracker.target();

    // Check if the Optional is empty
    if (!targetOpt || targetOpt.isEmpty()) {
        player.tell(Text.red('The compass must be actively tuned to a Lodestone.'));
        return 0;
    }

    // Safely UNWRAP the Optional to get the actual GlobalPos data
    let globalPos = targetOpt.get();

    // Use Java's getter methods to grab the coordinates instead of arrays
    let dim = globalPos.dimension().location().toString();
    let x = globalPos.pos().getX();
    let y = globalPos.pos().getY();
    let z = globalPos.pos().getZ();

    // UPDATED: Using global JSON handler
    let sites = readJSON(server, 'tres_consecrated', {});
    let keys = Object.keys(sites);

    if (keys.length >= 50 && !sites[name]) {
        player.tell(Text.red('The maximum number of consecrated buildings has been reached (50). Remove one first.'));
        return 0;
    }

    sites[name] = { dim: dim, x: x, y: y, z: z };

    // UPDATED: Using global JSON handler
    writeJSON(server, 'tres_consecrated', sites);

    player.tell(Text.green(`Successfully consecrated '`).append(Text.gold(name)).append(Text.green(`'. Players can now find it.`)));
    return 1;
}

function handleRemove(ctx, name) {
    let player = ctx.source.player;
    let server = ctx.source.server;
    if (!player) return 0;

    let currentKing = server.persistentData.current_king;
    if (player.username !== currentKing) {
        player.tell(Text.red('Only the King may revoke a consecration.'));
        return 0;
    }

    // UPDATED: Using global JSON handler
    let sites = readJSON(server, 'tres_consecrated', {});
    if (!sites[name]) {
        player.tell(Text.red(`No consecrated site found with the name '${name}'.`));
        return 0;
    }

    delete sites[name];

    // UPDATED: Using global JSON handler
    writeJSON(server, 'tres_consecrated', sites);

    player.tell(Text.green(`Revoked consecration for '${name}'.`));
    return 1;
}

function handleList(ctx, page) {
    let player = ctx.source.player;
    let server = ctx.source.server;
    if (!player) return 0;

    let sites = readJSON(server, 'tres_consecrated', {});
    let keys = Object.keys(sites);

    // Map raw data into standardized KubeJS text components
    let textItems = keys.map(key => {
        let data = sites[key];
        let dimName = data.dim.replace('minecraft:', '');
        return Text.yellow(`- ${key}`).append(Text.gray(` [${dimName} | X: ${data.x}, Z: ${data.z}]`));
    });

    // Fire it to the global pagination engine
    displayPaginatedMenu(player, "Consecrated Sites", textItems, page, 10, "/consecrate list %s");

    return 1;
}

function handleFind(ctx, rawName) {
    let player = ctx.source.player;
    let server = ctx.source.server;
    if (!player) return 0;

    // Force the Java String into a native JavaScript string for safe lookups
    let name = String(rawName).trim();

    // UPDATED: Using global JSON handler
    let sites = readJSON(server, 'tres_consecrated', {});
    if (!sites[name]) {
        player.tell(Text.red(`No consecrated site found with the name '${name}'. Type /consecrate list to see the available options.`));
        return 0;
    }

    let item = player.mainHandItem;
    if (item.id !== 'minecraft:compass') {
        player.tell(Text.red(`You must be holding a standard compass in your main hand to tune it to '${name}'.`));
        return 0;
    }

    let data = sites[name];

    // Inject the lodestone component properly formatted for the 1.20.5+ system
    item.set('minecraft:lodestone_tracker', {
        target: {
            pos: [data.x, data.y, data.z],
            dimension: data.dim
        },
        tracked: true
    });

    // Inject the lore component instead of custom_name
    item.set('minecraft:lore', [Text.gold(name)]);

    player.tell(Text.green(`Your compass is now magically tuned to '`).append(Text.gold(name)).append(Text.green(`'.`)));
    return 1;
}
