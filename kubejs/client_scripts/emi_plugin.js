RecipeViewerEvents.addInformation('fluid', event => {
    // fluid.json
    event.add(['minecraft:water', 'minecraft:lava'], [Text.translate('utopia.info.fluid')])

    // gas.json
    event.add(['utopia:oxygen', 'utopia:hydrogen', 'utopia:nitrogen', 'utopia:ammonia'], [Text.translate('utopia.info.gas')])
})

RecipeViewerEvents.addInformation('item', event => {
    // fluid.json
    event.add(['minecraft:water_bucket', 'minecraft:lava_bucket'], [Text.translate('utopia.info.fluid')])

    // platinum.json
    event.add(['utopia:platinum_ingot', 'utopia:platinum_nugget', 'create:crushed_raw_gold'], [Text.translate('utopia.info.platinum')])

    // spices.json
    event.add(['utopia:pepper', 'utopia:sea_salt'], [Text.translate('utopia.info.spices')])

    // mimic.json
    event.add(['artifacts:mimic_spawn_egg'], [Text.translate('utopia.info.mimic')])

    // nether.json
    event.add(['quark:blaze_lantern', 'minecraft:glowstone', 'minecraft:flint_and_steel', 'minecraft:fire_charge'], [Text.translate('utopia.info.the_nether')])
})