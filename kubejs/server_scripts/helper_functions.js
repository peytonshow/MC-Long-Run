// ============================================================================
//                      GLOBAL PLAYER UTILITY: UUID RESOLVER
// ============================================================================

/**
 * Safely resolves a Minecraft username into its corresponding string UUID.
 * Checks online players first, then falls back to the server's GameProfile cache.
 * * @param {Internal.MinecraftServer} server The KubeJS server instance
 * @param {string} username The username to look up
 * @returns {string|null} The UUID string, or null if not found
 */
function parseUsernameToUUID(server, username) {
    let targetName = String(username).trim();
    if (!targetName) return null;

    // 1. Check online players first (Fastest and covers 99% of live interactions)
    for (let p of server.players) {
        if (String(p.username).toLowerCase() === targetName.toLowerCase()) {
            return String(p.uuid);
        }
    }

    // 2. Check the server's GameProfile cache (Safely fetches offline players)
    try {
        let profileOptional = server.server.getProfileCache().get(targetName);
        if (profileOptional && profileOptional.isPresent()) {
            return String(profileOptional.get().getId());
        }
    } catch (e) {
        console.error(`[UUID Resolver] Could not parse offline UUID for ${targetName}: ${e}`);
    }

    return null; // Return null if the username has never joined the server or doesn't exist
}
