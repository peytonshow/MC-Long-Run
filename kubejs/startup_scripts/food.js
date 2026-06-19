/* const $MobEffectInstance = Java.loadClass('net.minecraft.world.effect.MobEffectInstance')



ItemEvents.modification(event => {
    event.modify('minecraft:chorus_fruit', item => {
        item.setFood({
            saturation: 2,
            canAlwaysEat: true,
            eatSeconds: 1.6, // 0.8 is fast, 1.6 is normal
            effects: [
                {
                    probability: 1, // Any real number between 0 and 1
                    effectSupplier: () =>
}) */
                    //new $MobEffectInstance(
                        ///* Effect:         */ 'minecraft:strength',
                        ///* Duration:       */ 900,
                        ///* Level:          */ 1,
                        ///* Is ambient:     */ false,
                        ///* Hide particles: */ true
                        /*
                    ),
                },
            ],
            nutrition: 4,
            usingConvertsTo: 'minecraft:bowl',
        })
    })
*/





const $MobEffectInstance = Java.loadClass('net.minecraft.world.effect.MobEffectInstance')
ItemEvents.modification(event => {
    event.modify('create:super_glue', item => {
        item.setFood({
            eatSeconds: 3.2,
            saturation: 0,
            nutrition: 1,
            canAlwaysEat: true,
            effects: [
                {
                    probability: 0.9, // Any real number between 0 and 1
                    effectSupplier: () =>
                    new $MobEffectInstance(
                        /* Effect:         */ 'oreganized:stunning',
                        /* Duration:       */ 3000,
                        /* Level:          */ 0,
                        /* Is ambient:     */ false,
                        /* Hide particles: */ true
                    ),
                },
                {
                    probability: 1, // Any real number between 0 and 1
                    effectSupplier: () =>
                    new $MobEffectInstance(
                        /* Effect:         */ 'oreganized:lung_damage',
                        /* Duration:       */ 600,
                        /* Level:          */ 0,
                        /* Is ambient:     */ false,
                        /* Hide particles: */ true
                    ),
                }
            ]
        })
        item.useAnimation
    })
    event.modify('minecraft:sweet_berries', item => {
        item.setFood({
            eatSeconds: 0.8,
            saturation: 1,
            nutrition: 3,
            canAlwaysEat: false
        })
    })
    event.modify('minecraft:glow_berries', item => {
        item.setFood({
            eatSeconds: 1.6,
            saturation: 2,
            nutrition: 2,
            canAlwaysEat: false
        })
    })


    // Decrease saturation
    event.modify('create:chocolate_glazed_berries', item => {
        item.setFood({
            eatSeconds: 0.8,
            nutrition: 3,
            saturation: 5,
            canAlwaysEat: false
        })
    })

    event.modify('utopia:sea_salt', item => {
        item.setFood({
            eatSeconds: 3.2,
            nutrition: 1,
            saturation: 4,
            canAlwaysEat: false
        })
    })
    event.modify('utopia:pepper', item => {
        item.setFood({
            eatSeconds: 3.2,
            nutrition: 1,
            saturation: 5,
            canAlwaysEat: false
        })
    })
    event.modify('utopia:cinnamon', item => {
        item.setFood({
            eatSeconds: 1.6,
            nutrition: 0,
            saturation: 6,
            canAlwaysEat: false
        })
    })
    event.modify('minecraft:cooked_beef', item => {
        item.setFood({
            eatSeconds: 1.6,
            nutrition: 8,
            saturation: 3,
            canAlwaysEat: false
        })
    })
    event.modify('utopia:seasoned_cooked_beef', item => {
        item.setFood({
            eatSeconds: 1.6,
            nutrition: 8,
            saturation: 8,
            canAlwaysEat: false
        })
    })
    event.modify('minecraft:cooked_porkchop', item => {
        item.setFood({
            eatSeconds: 1.6,
            nutrition: 8,
            saturation: 3,
            canAlwaysEat: false
        })
    })
    event.modify('utopia:seasoned_cooked_porkchop', item => {
        item.setFood({
            eatSeconds: 1.6,
            nutrition: 8,
            saturation: 8,
            canAlwaysEat: false
        })
    })
    event.modify('minecraft:cooked_chicken', item => {
        item.setFood({
            eatSeconds: 1.6,
            nutrition: 5,
            saturation: 5,
            canAlwaysEat: false
        })
    })
    event.modify('utopia:seasoned_cooked_chicken', item => {
        item.setFood({
            eatSeconds: 1.6,
            nutrition: 5,
            saturation: 8,
            canAlwaysEat: false
        })
    })
    event.modify('minecraft:cooked_mutton', item => {
        item.setFood({
            eatSeconds: 1.6,
            nutrition: 5,
            saturation: 4,
            canAlwaysEat: false
        })
    })
    event.modify('utopia:seasoned_cooked_mutton', item => {
        item.setFood({
            eatSeconds: 1.6,
            saturation: 6,
            nutrition: 5,
            canAlwaysEat: false
        })
    })
    event.modify('minecraft:cooked_rabbit', item => {
        item.setFood({
            eatSeconds: 1.6,
            saturation: 5,
            nutrition: 5,
            canAlwaysEat: false
        })
    })
    event.modify('utopia:seasoned_cooked_rabbit', item => {
        item.setFood({
            eatSeconds: 1.6,
            saturation: 7,
            nutrition: 5,
            canAlwaysEat: false
        })
    })
    event.modify('naturalist:cooked_bushmeat', item => {
        item.setFood({
            eatSeconds: 1.6,
            saturation: 3,
            nutrition: 8,
            canAlwaysEat: false
        })
    })
    event.modify('utopia:seasoned_cooked_bushmeat', item => {
        item.setFood({
            eatSeconds: 1.6,
            saturation: 8,
            nutrition: 8,
            canAlwaysEat: false
        })
    })

})



