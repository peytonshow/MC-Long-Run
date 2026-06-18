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
            nutrition: 0.5,
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
            nutrition: 1,
            canAlwaysEat: false
        })
    })
    event.modify('minecraft:glow_berries', item => {
        item.setFood({
            eatSeconds: 1.6,
            saturation: 2,
            nutrition: 1,
            canAlwaysEat: false
        })
    })
    event.modify('create:chocolate_glazed_berries', item => {
        item.setFood({
            eatSeconds: 0.8,
            saturation: 4,
            nutrition: 3,
            canAlwaysEat: false
        })
    })

})



