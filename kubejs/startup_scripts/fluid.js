const $SoundEvents = Java.loadClass('net.minecraft.sounds.SoundEvents')
const $ParticleTypes = Java.loadClass('net.minecraft.core.particles.ParticleTypes')

StartupEvents.registry('fluid', event => {
  const textures = {
    gas:    ['gas/gas_still',    'gas/gas_flow'],
    watery: ['watery/watery_still', 'watery/watery_flow'],
    soupy:  ['soupy/soupy_still',  'soupy/soupy_flow'],
    glue:   ['glue/glue_still',   'glue/glue_flow']
  }

  // opt keys: density, viscosity, fall, slope, decrease, tick, overlay, block (true = keep block + bucket), bucketTexture
  const chemicals = [
    // id,                name,               tint,     kind,     options
    ['oxygen',           'Oxygen',           0xAFEEEE, 'gas',    {}],
    ['hydrogen',         'Hydrogen',         0xFFFFFF, 'gas',    {}],
    ['nitrogen',         'Nitrogen',         0xE0F7FA, 'gas',    {}],
    ['ammonia',          'Ammonia',          0x9D4EDD, 'gas',    { density: 2000, viscosity: 3000, slope: 3, overlay: true }],
    ['nitric_acid',      'Nitric Acid',      0x8B4513, 'watery', { density: 2000, viscosity: 2500, slope: 3, overlay: true }],
    ['propylene_glycol', 'Propylene Glycol', 0x36454F, 'soupy',  { density: 2500, viscosity: 5000, slope: 2, overlay: true }],
    ['bleach',           'Bleach',           0xa5dacc, 'watery', { density: 1500, viscosity: 3000, slope: 2, decrease: 2, tick: 10, overlay: true, block: true }],
    ['glue',             'Glue',             0x61f238, 'glue',   { fall: 0.5, slope: 2, decrease: 4, tick: 30, overlay: true, block: true, bucketTexture: 'utopia:item/glue_bucket' }]
  ]

  chemicals.forEach(c => {
    const id = c[0], name = c[1], tint = c[2], kind = c[3], o = c[4]
    const tex = textures[kind]

    const fluid = event.create('utopia:' + id)
      .displayName(name)
      .tint(tint)
      .stillTexture('kubejs:block/' + tex[0])
      .flowingTexture('kubejs:block/' + tex[1])
      .translucent()
      .type(type => {
        type.renderType(3).fallDistanceModifier(o.fall || 0)
        if (o.density)   type.density(o.density)
        if (o.viscosity) type.viscosity(o.viscosity)
        if (o.overlay)   type.screenOverlayTexture('kubejs:textures/block/soupy_overlay.png')
      })

    if (o.slope)    fluid.slopeFindDistance(o.slope)
    if (o.decrease) fluid.levelDecreasePerBlock(o.decrease)
    if (o.tick)     fluid.tickRate(o.tick)

    if (!o.block) fluid.noBlock().noBucket()
    if (o.bucketTexture) fluid.bucketItem.texture(o.bucketTexture)

    if (kind === 'gas') fluid.tag('utopia:gas')
  })

  // [id, display name, light level]
  const molten = [
    ['slag',   'Molten Slag',    3],
    ['copper',   'Molten Copper',    12],
    ['zinc',     'Molten Zinc',      10],
    ['iron',     'Molten Iron',      14],
    ['gold',     'Molten Gold',      13],
    ['platinum', 'Molten Platinum',  15],
    ['brass',    'Molten Brass',     12],
    ['silver',   'Molten Silver',    13],
    ['debrinium', 'Molten Debrinium',  9],
    ['netherite', 'Molten Netherite',  13],
    ['electrum', 'Molten Electrum',  14]
  ]

  molten.forEach(m => {
    event.create('utopia:molten_' + m[0])
      .displayName(m[1])
      .slopeFindDistance(2)
      .levelDecreasePerBlock(4)
      .tickRate(30)
      .type(type => type
        .density(3000)
        .viscosity(6000)
        .lightLevel(m[2])
        .renderType(3)
        .fallDistanceModifier(0.5)
      )
      .stillTexture('kubejs:block/molten_' + m[0] + '/' + m[0] + '_still')
      .flowingTexture('kubejs:block/molten_' + m[0] + '/' + m[0] + '_flowing')
      .tag('utopia:molten')
  })
})