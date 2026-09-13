// server_scripts/animal_growth.js

const allowedMobs = [
    'minecraft:cow',
    'minecraft:sheep',
    'minecraft:pig',
    'minecraft:chicken'
]

EntityEvents.spawned(event => {
    let entity = event.entity
    
    // Ensure entity exists and is in our list
    if (entity && allowedMobs.includes(entity.type)) {
        // Schedule 1 tick later so vanilla spawn logic completes
        event.server.scheduleInTicks(1, () => {
            if (entity.isAlive() && entity.isBaby()) {
                // Merges the new Age NBT (-6000 ticks = 5 minutes)
                entity.mergeNbt({ Age: -72000 })
            }
        })
    }
})