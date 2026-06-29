const $SoundEvents = Java.loadClass('net.minecraft.sounds.SoundEvents')
const $ParticleTypes = Java.loadClass('net.minecraft.core.particles.ParticleTypes')

StartupEvents.registry('fluid', event => {
  event.create('utopia:oxygen')
    .displayName('Oxygen')
    .tint(0xAFEEEE)
    .renderType(3)
    // The path here must match the folder structure inside /textures/
    .stillTexture('kubejs:block/gas_still') 
    .flowingTexture('kubejs:block/gas_flow')
    //.addDripstoneDripping(1, $ParticleTypes.DRIPPING_DRIPSTONE_WATER, 'minecraft:water_cauldron', $SoundEvents.POINTED_DRIPSTONE_DRIP_WATER)
    .noBlock()
})