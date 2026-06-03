// ============================================================================
//                      GLOBAL UTILITIES & FORMATTING
// ============================================================================

/**
 * Safely parses numbers, filtering out strings and KubeJS NBT formatting issues.
 */
function safeNum(val, fallback) {
    if (val == null) return fallback;
    let str = String(val).split('.')[0].replace(/[^0-9-]/g, '');
    let num = parseInt(str, 10);
    return isNaN(num) ? fallback : num;
}

/**
 * Standardized Pagination Engine for Chat Menus
 * @param {Internal.Player} player The player receiving the menu
 * @param {string} title The menu title
 * @param {Array} items Array of pre-formatted KubeJS Text components
 * @param {number} page The requested page
 * @param {number} itemsPerPage How many items per page
 * @param {string} nextCmdTemplate The command to run for the next page (use %s for the page number)
 */
function displayPaginatedMenu(player, title, items, page, itemsPerPage, nextCmdTemplate) {
    if (!items || items.length === 0) {
        player.tell(Text.gray('No entries found.'));
        return;
    }

    let maxPages = Math.ceil(items.length / itemsPerPage);
    let p = Math.max(1, Math.min(page, maxPages));
    let start = (p - 1) * itemsPerPage;
    let end = Math.min(start + itemsPerPage, items.length);

    player.tell(Text.gold(`\n=== ${title} (Page ${p}/${maxPages}) ===`));

    for (let i = start; i < end; i++) {
        player.tell(items[i]);
    }

    if (p < maxPages) {
        let cmd = nextCmdTemplate.replace('%s', p + 1);
        player.tell(Text.gray(`Use `).append(Text.aqua(cmd)).append(Text.gray(` to see the next page.`)));
    }
}

// ============================================================================
//                      GLOBAL DATA STORAGE HANDLERS
// ============================================================================

/**
 * Safely reads and parses JSON from persistent data.
 */
function readJSON(server, key, fallback) {
    if (server.persistentData.contains(key)) {
        try {
            return JSON.parse(server.persistentData.getString(key));
        } catch (e) {
            console.error(`[Data Handler] Corrupt JSON found at key '${key}'. Reverting to fallback.`);
            return fallback;
        }
    }
    return fallback;
}

/**
 * Safely stringifies and saves JSON to persistent data.
 */
function writeJSON(server, key, data) {
    server.persistentData.putString(key, JSON.stringify(data));
}

// ============================================================================
//                      GLOBAL PLAYER IDENTITY CACHE
// ============================================================================

/**
 * Safely resolves a Minecraft username into its corresponding string UUID.
 */
function parseUsernameToUUID(server, username) {
    let targetName = String(username).trim();
    if (!targetName) return null;

    // Check online players first
    for (let p of server.players) {
        if (String(p.username).toLowerCase() === targetName.toLowerCase()) {
            return String(p.uuid);
        }
    }

    // Fallback to offline GameProfile cache
    try {
        let profileOptional = server.server.getProfileCache().get(targetName);
        if (profileOptional && profileOptional.isPresent()) {
            return String(profileOptional.get().getId());
        }
    } catch (e) {
        console.error(`[UUID Resolver] Could not parse offline UUID for ${targetName}: ${e}`);
    }

    return null;
}

/**
 * Caches a player's latest known username against their UUID.
 */
function cachePlayerName(server, uuid, username) {
    let cache = readJSON(server, 'global_name_cache', {});
    let cleanName = String(username).replace(/['"]/g, '');
    cache[String(uuid)] = cleanName;
    writeJSON(server, 'global_name_cache', cache);
}

/**
 * Retrieves a player's readable username from their UUID.
 */
function getCachedName(server, uuid, fallback) {
    let cache = readJSON(server, 'global_name_cache', {});
    return cache[String(uuid)] || fallback;
}
