
// [Click to copy] box (like vanilla /seed).

const PERLIN_RAMP = ['·', '░', '▒', '▓', '█'] // low -> high

function makePerlin(seed) {
  let s = (seed >>> 0) || 1
  const rand = () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }

  const p = []
  for (let i = 0; i < 256; i++) p[i] = i
  let j, t
  for (let i = 255; i > 0; i--) {
    j = Math.floor(rand() * (i + 1))
    t = p[i]; p[i] = p[j]; p[j] = t
  }
  const perm = p.concat(p)

  const fade = t => t * t * t * (t * (t * 6 - 15) + 10)
  const lerp = (a, b, t) => a + t * (b - a)
  const grad = (h, x, y) => ((h & 1) ? -x : x) + ((h & 2) ? -y : y)

  return (x, y) => {
    const xi = Math.floor(x) & 255
    const yi = Math.floor(y) & 255
    const xf = x - Math.floor(x)
    const yf = y - Math.floor(y)
    const u = fade(xf)
    const v = fade(yf)

    const aa = perm[perm[xi] + yi]
    const ab = perm[perm[xi] + yi + 1]
    const ba = perm[perm[xi + 1] + yi]
    const bb = perm[perm[xi + 1] + yi + 1]

    return lerp(
      lerp(grad(aa, xf, yf),     grad(ba, xf - 1, yf),     u),
      lerp(grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1), u),
      v
    )
  }
}

function generatePerlinText(width, height, scale, seed) {
  const noise = makePerlin(seed)
  const lines = []
  let chars, n
  for (let row = 0; row < height; row++) {
    chars = []
    for (let col = 0; col < width; col++) {
      n = Math.min(1, Math.max(0, (noise(col * scale, row * scale) * 1.3 + 1) / 2))
      chars.push(PERLIN_RAMP[Math.min(PERLIN_RAMP.length - 1, Math.floor(n * PERLIN_RAMP.length))])
    }
    lines.push(chars.join(''))
  }
  return lines.join('\n')
}

let lastPerlin = ''

NativeEvents.onEvent('net.neoforged.neoforge.client.event.RegisterClientCommandsEvent', event => {
  const Commands = Java.loadClass('net.minecraft.commands.Commands')
  const IntArg = Java.loadClass('com.mojang.brigadier.arguments.IntegerArgumentType')
  const FloatArg = Java.loadClass('com.mojang.brigadier.arguments.FloatArgumentType')
  const ClickEvent = Java.loadClass('net.minecraft.network.chat.ClickEvent')
  const ClickAction = Java.loadClass('net.minecraft.network.chat.ClickEvent$Action')
  const HoverEvent = Java.loadClass('net.minecraft.network.chat.HoverEvent')
  const HoverAction = Java.loadClass('net.minecraft.network.chat.HoverEvent$Action')
  const Style = Java.loadClass('net.minecraft.network.chat.Style')
  const Component = Java.loadClass('net.minecraft.network.chat.Component')
  const ChatFormatting = Java.loadClass('net.minecraft.ChatFormatting')
  const Minecraft = Java.loadClass('net.minecraft.client.Minecraft')

  const run = (ctx, scale, seed) => {
    const width = IntArg.getInteger(ctx, 'x')
    const height = IntArg.getInteger(ctx, 'y')
    if (seed === null) seed = Math.floor(Math.random() * 2147483647)

    lastPerlin = generatePerlinText(width, height, scale, seed)

    // The click runs /perlincopy, so the huge text never sits inside a chat component
    Client.player.displayClientMessage(
      Component.literal(`Perlin ${width}x${height} (scale ${scale}, seed ${seed}) `).append(
        Component.literal('[Click to copy]').setStyle(
          Style.EMPTY
            .withColor(ChatFormatting.GREEN)
            .withClickEvent(new ClickEvent(ClickAction.RUN_COMMAND, '/perlincopy'))
            .withHoverEvent(new HoverEvent(HoverAction.SHOW_TEXT, Component.literal('Click to Copy to Clipboard'))))),
      false)
    return 1
  }

  event.getDispatcher().register(Commands.literal('perlincopy').executes(ctx => {
    Minecraft.getInstance().keyboardHandler.setClipboard(lastPerlin)
    return 1
  }))

  event.getDispatcher().register(
    Commands.literal('perlin')
      .then(Commands.argument('x', IntArg.integer(1, 1000))
        .then(Commands.argument('y', IntArg.integer(1, 1000))
          .executes(ctx => run(ctx, 0.15, null))
          .then(Commands.argument('scale', FloatArg.floatArg(0.001, 5))
            .executes(ctx => run(ctx, FloatArg.getFloat(ctx, 'scale'), null))
            .then(Commands.argument('seed', IntArg.integer())
              .executes(ctx => run(ctx,
                FloatArg.getFloat(ctx, 'scale'),
                IntArg.getInteger(ctx, 'seed')))))))
  )
})