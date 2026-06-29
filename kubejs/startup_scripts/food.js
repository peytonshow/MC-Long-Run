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
            saturation: 5,
            canAlwaysEat: false
        })
    })
    event.modify('utopia:pepper', item => {
        item.setFood({
            eatSeconds: 3.2,
            nutrition: 2,
            saturation: 4,
            canAlwaysEat: false
        })
    })
    event.modify('utopia:cinnamon', item => {
        item.setFood({
            eatSeconds: 1.6,
            nutrition: 1,
            saturation: 7,
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
            nutrition: 5,
            saturation: 6,
            canAlwaysEat: false
        })
    })
    event.modify('minecraft:cooked_rabbit', item => {
        item.setFood({
            eatSeconds: 1.6,
            nutrition: 5,
            saturation: 5,
            canAlwaysEat: false
        })
    })
    event.modify('utopia:seasoned_cooked_rabbit', item => {
        item.setFood({
            eatSeconds: 1.6,
            nutrition: 5,
            saturation: 7,
            canAlwaysEat: false
        })
    })
    event.modify('naturalist:cooked_bushmeat', item => {
        item.setFood({
            eatSeconds: 1.6,
            nutrition: 8,
            saturation: 3,
            canAlwaysEat: false
        })
    })
    event.modify('utopia:seasoned_cooked_bushmeat', item => {
        item.setFood({
            eatSeconds: 1.6,
            nutrition: 8,
            saturation: 8,
            canAlwaysEat: false
        })
    })



    // Chemicals
    event.modify('utopia:beaker_nitric_acid', item => {
        item.setFood({
            eatSeconds: 1.6,
            saturation: 0,
            nutrition: 1,
            canAlwaysEat: true,
            effects: [
                {
                    probability: 1.0, // Any real number between 0 and 1
                    effectSupplier: () =>
                    new $MobEffectInstance(
                        'minecraft:poison', 20, 5,false,false
                    ),
                },
                {
                    probability: 1.0, // Any real number between 0 and 1
                    effectSupplier: () =>
                    new $MobEffectInstance(
                        'minecraft:wither', 80, 2,false,true
                    ),
                }
            ]
        })
    })
    event.modify('utopia:beaker_oxygen', item => {
        item.setFood({
            eatSeconds: 1.6,
            saturation: 0,
            nutrition: 1,
            canAlwaysEat: true,
            effects: [
                {
                    probability: 1.0, // Any real number between 0 and 1
                    effectSupplier: () =>
                    new $MobEffectInstance(
                        'supplementaries:flammable', 60, 0,false,true
                    ),
                }
            ]
        })
    })
    event.modify('utopia:beaker_ammonia', item => {
        item.setFood({
            eatSeconds: 1.6,
            saturation: 0,
            nutrition: 1,
            canAlwaysEat: true,
            effects: [
                {
                    probability: 1.0, // Any real number between 0 and 1
                    effectSupplier: () =>
                    new $MobEffectInstance(
                        'minecraft:weakness', 120, 0,false,true
                    ),
                }
            ]
        })
    })
    event.modify('utopia:beaker_nitrogen', item => {
        item.setFood({
            eatSeconds: 1.6,
            saturation: 0,
            nutrition: 1,
            canAlwaysEat: true,
            effects: [
                {
                    probability: 1.0, // Any real number between 0 and 1
                    effectSupplier: () =>
                    new $MobEffectInstance(
                        'oreganized:lung_damage', 60, 0,false,true
                    ),
                }
            ]
        })
    })
    event.modify('utopia:beaker_ammonia', item => {
        item.setFood({
            eatSeconds: 1.6,
            saturation: 0,
            nutrition: 1,
            canAlwaysEat: true,
            effects: [
                {
                    probability: 1.0, // Any real number between 0 and 1
                    effectSupplier: () =>
                    new $MobEffectInstance(
                        'oreganized:lung_damage', 120, 0,false,true
                    ),
                }
            ]
        })
    })
    event.modify('utopia:beaker_bleach', item => {
        item.setFood({
            eatSeconds: 1.6,
            saturation: 0,
            nutrition: 1,
            canAlwaysEat: true,
            effects: [
                {
                    probability: 1.0, // Any real number between 0 and 1
                    effectSupplier: () =>
                    new $MobEffectInstance(
                        'minecraft:poison', 120, 1,false,false
                    ),
                },
                {
                    probability: 1.0, // Any real number between 0 and 1
                    effectSupplier: () =>
                    new $MobEffectInstance(
                        'minecraft:wither', 180, 0,false,true
                    ),
                },
                {
                    probability: 1.0, // Any real number between 0 and 1
                    effectSupplier: () =>
                    new $MobEffectInstance(
                        'minecraft:weakness', 120, 0,false,true
                    ),
                },
                {
                    probability: 1.0, // Any real number between 0 and 1
                    effectSupplier: () =>
                    new $MobEffectInstance(
                        'oreganized:lung_damage', 120, 0,false,true
                    ),
                }
            ]
        })
    })
})



