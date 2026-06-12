// ============================================================================
//                      GLOBAL UTILITIES & FORMATTING
// ============================================================================

/**
 * Safely parses numbers, filtering out strings and KubeJS NBT formatting issues.
 * Probably overkill
 */
function safeNum(val, fallback) {
    if (val == null) return fallback;
    let str = String(val).split('.')[0].replace(/[^0-9-]/g, '');
    let num = parseInt(str, 10);
    return isNaN(num) ? fallback : num;
}

/**
 * Standardized Pagination Engine for Chat Menus
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

/**
 * Safely updates a player's honor balance globally.
 */
function updateHonorLedger(server, username, balance) {
    let balances = readJSON(server, 'honor_balances', {});
    balances[username] = balance;
    writeJSON(server, 'honor_balances', balances);
}
