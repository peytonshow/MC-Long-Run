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
    // Less repeated text
    function simpleFood(id, eatSeconds, saturation, nutrition, canAlwaysEat = false) {
        event.modify(id, item => {
            item.setFood({
                eatSeconds: eatSeconds,
                saturation: saturation,
                nutrition: nutrition,
                canAlwaysEat: canAlwaysEat
            })
        })
    }


    simpleFood('minecraft:melon_slice', 0.8, 1, 1)
    simpleFood('minecraft:sweet_berries', 0.8, 1, 3)
    simpleFood('minecraft:glow_berries', 1.6, 2, 2)

    // Decrease saturation
    simpleFood('create:chocolate_glazed_berries', 0.8, 5, 3)

    simpleFood('utopia:sea_salt', 6.4, 5, 1)
    simpleFood('utopia:pepper', 6.4, 4, 2)
    simpleFood('minecraft:cooked_beef', 1.6, 3, 8)
    simpleFood('utopia:seasoned_cooked_beef', 1.6, 9, 8)
    simpleFood('minecraft:cooked_porkchop', 1.6, 4, 8)
    simpleFood('utopia:seasoned_cooked_porkchop', 1.6, 10, 7)
    simpleFood('minecraft:cooked_chicken', 1.6, 5, 5)
    simpleFood('utopia:seasoned_cooked_chicken', 1.6, 8, 5)
    simpleFood('minecraft:cooked_mutton', 1.6, 4, 5)
    simpleFood('utopia:seasoned_cooked_mutton', 1.6, 6, 6)
    simpleFood('minecraft:cooked_rabbit', 1.6, 5, 5)
    simpleFood('utopia:seasoned_cooked_rabbit', 1.6, 8, 5)



    // Chemicals
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
    event.modify('utopia:beaker_nitric_acid', item => {
        item.setFood({
            usingConvertsTo: 'utopia:beaker',
            eatSeconds: 1.6,
            saturation: 0,
            nutrition: 1,
            canAlwaysEat: true,
            effects: [
                {
                    probability: 1.0, // Any real number between 0 and 1
                    effectSupplier: () =>
                    new $MobEffectInstance(
                        'minecraft:poison', 200, 5,false,false
                    ),
                },
                {
                    probability: 1.0, // Any real number between 0 and 1
                    effectSupplier: () =>
                    new $MobEffectInstance(
                        'minecraft:wither', 800, 2,false,true
                    ),
                }
            ]
        })
    })
    event.modify('utopia:beaker_oxygen', item => {
        item.setFood({
            usingConvertsTo: 'utopia:beaker',
            eatSeconds: 1.6,
            saturation: 0,
            nutrition: 1,
            canAlwaysEat: true,
            effects: [
                {
                    probability: 1.0, // Any real number between 0 and 1
                    effectSupplier: () =>
                    new $MobEffectInstance(
                        'supplementaries:flammable', 1200, 0,false,true
                    ),
                },
                {
                    probability: 1.0, // Any real number between 0 and 1
                    effectSupplier: () =>
                    new $MobEffectInstance(
                        'minecraft:water_breathing', 300, 0,false,true
                    ),
                }
            ]
        })
    })
    event.modify('utopia:beaker_ammonia', item => {
        item.setFood({
            usingConvertsTo: 'utopia:beaker',
            eatSeconds: 1.6,
            saturation: 0,
            nutrition: 1,
            canAlwaysEat: true,
            effects: [
                {
                    probability: 1.0, // Any real number between 0 and 1
                    effectSupplier: () =>
                    new $MobEffectInstance(
                        'minecraft:weakness', 1200, 0,false,true
                    ),
                }
            ]
        })
    })
    event.modify('utopia:beaker_nitrogen', item => {
        item.setFood({
            usingConvertsTo: 'utopia:beaker',
            eatSeconds: 1.6,
            saturation: 0,
            nutrition: 1,
            canAlwaysEat: true,
            effects: [
                {
                    probability: 1.0, // Any real number between 0 and 1
                    effectSupplier: () =>
                    new $MobEffectInstance(
                        'oreganized:lung_damage', 600, 0,false,true
                    ),
                }
            ]
        })
    })
    event.modify('utopia:beaker_ammonia', item => {
        item.setFood({
            usingConvertsTo: 'utopia:beaker',
            eatSeconds: 1.6,
            saturation: 0,
            nutrition: 1,
            canAlwaysEat: true,
            effects: [
                {
                    probability: 1.0, // Any real number between 0 and 1
                    effectSupplier: () =>
                    new $MobEffectInstance(
                        'oreganized:lung_damage', 1200, 0,false,true
                    ),
                }
            ]
        })
    })
    event.modify('utopia:beaker_bleach', item => {
        item.setFood({
            usingConvertsTo: 'utopia:beaker',
            eatSeconds: 1.6,
            saturation: 0,
            nutrition: 1,
            canAlwaysEat: true,
            effects: [
                {
                    probability: 1.0,
                    effectSupplier: () =>
                    new $MobEffectInstance(
                        'minecraft:poison', 1200, 1,false,false
                    ),
                },
                {
                    probability: 1.0,
                    effectSupplier: () =>
                    new $MobEffectInstance(
                        'minecraft:wither', 1800, 0,false,true
                    ),
                },
                {
                    probability: 1.0, 
                    effectSupplier: () =>
                    new $MobEffectInstance(
                        'minecraft:weakness', 1200, 0,false,true
                    ),
                },
                {
                    probability: 1.0,
                    effectSupplier: () =>
                    new $MobEffectInstance(
                        'oreganized:lung_damage', 1200, 0,false,true
                    ),
                }
            ]
        })
    })
    event.modify('utopia:beaker_propylene_glycol', item => {
        item.setFood({
            usingConvertsTo: 'utopia:beaker',
            eatSeconds: 1.6,
            saturation: 3,
            nutrition: 2,
            canAlwaysEat: true
        })
    })
})