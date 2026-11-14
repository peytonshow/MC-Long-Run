// [Click to copy] box (like vanilla /seed).

// low -> high; colored emoji squares always draw as equal-size square cells, whatever font is in use.
// Heat-map order: blue, green, yellow, orange, red.
const PERLIN_RAMP = ['🟦', '🟩', '🟨', '🟧', '🟥']

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

// steps:  number of distinct shades, 2-5. The shades are spread evenly across the ramp,
//         so 2 = '🟦' and '🟥', 5 = all of them.
// offset: bends the value curve without moving its ends, so the lowest and highest values
//         still reach the lowest and highest shades. Positive makes the climb toward the top
//         shade steeper (more '🟦', peaks stay possible), negative makes it gentler (more '🟥').
//         Range -1..1 (0 = unchanged, +-1 = a 4x stronger bend).
// peak:   how quickly values rise to the top shade. 1 = unchanged, above 1 reaches the high
//         shades sooner (more '🟥'), below 1 stays low for longer (peaks are rarer and sharper).
//         Applied after the offset.
function generatePerlinText(width, height, scale, steps, offset, peak, seed) {
  const noise = makePerlin(seed)
  const lines = []
  let chars, n, level
  for (let row = 0; row < height; row++) {
    chars = []
    for (let col = 0; col < width; col++) {
      n = (noise(col * scale, row * scale) * 1.3 + 1) / 2
      n = Math.min(1, Math.max(0, n))
      n = Math.pow(n, Math.pow(4, offset))
      n = Math.pow(n, 1 / peak)
      level = Math.min(steps - 1, Math.floor(n * steps))
      chars.push(PERLIN_RAMP[Math.round(level / (steps - 1) * (PERLIN_RAMP.length - 1))])
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

  // Optional arguments throw if they were not typed, so fall back to a default
  const opt = (getter, dflt) => {
    try { return getter() } catch (e) { return dflt }
  }

  const say = (text, color) => {
    let c = Component.literal(text)
    if (color) c = c.setStyle(Style.EMPTY.applyFormat(color)) // applyFormat avoids the withColor overload ambiguity in Rhino
    Client.player.displayClientMessage(c, false)
  }

  const run = (ctx, autoCopy) => {
    const width = IntArg.getInteger(ctx, 'x')
    const height = IntArg.getInteger(ctx, 'y')
    const scale = opt(() => FloatArg.getFloat(ctx, 'scale'), 0.15)
    const steps = opt(() => IntArg.getInteger(ctx, 'steps'), 5)
    const offset = opt(() => FloatArg.getFloat(ctx, 'offset'), 0)
    const peak = opt(() => FloatArg.getFloat(ctx, 'peak'), 1)
    const seed = opt(() => IntArg.getInteger(ctx, 'seed'), Math.floor(Math.random() * 2147483647))

    lastPerlin = generatePerlinText(width, height, scale, steps, offset, peak, seed)

    const summary = `Perlin ${width}x${height} (scale ${scale}, steps ${steps}, offset ${offset}, peak ${peak}, seed ${seed}) `

    if (autoCopy) {
      Minecraft.getInstance().keyboardHandler.setClipboard(lastPerlin)
      Client.player.displayClientMessage(
        Component.literal(summary).append(
          Component.literal('[Copied]').setStyle(Style.EMPTY.applyFormat(ChatFormatting.GREEN))),
        false)
      return 1
    }

    // COPY_TO_CLIPBOARD copies the text directly when clicked, no extra command needed
    Client.player.displayClientMessage(
      Component.literal(summary).append(
        Component.literal('[Click to copy]').setStyle(
          Style.EMPTY
            .applyFormat(ChatFormatting.GREEN)
            .withClickEvent(new ClickEvent(ClickAction.COPY_TO_CLIPBOARD, lastPerlin))
            .withHoverEvent(new HoverEvent(HoverAction.SHOW_TEXT, Component.literal('Click to Copy to Clipboard'))))),
      false)
    return 1
  }

  // Builds <x> <y> [scale] [steps] [offset] [peak] [seed], ending in the given executor
  const buildArgs = exec =>
    Commands.argument('x', IntArg.integer(1, 1000))
      .then(Commands.argument('y', IntArg.integer(1, 1000))
        .executes(exec)
        .then(Commands.argument('scale', FloatArg.floatArg(0.001, 5))
          .executes(exec)
          .then(Commands.argument('steps', IntArg.integer(2, 5))
            .executes(exec)
            .then(Commands.argument('offset', FloatArg.floatArg(-1, 1))
              .executes(exec)
              .then(Commands.argument('peak', FloatArg.floatArg(0.1, 10))
                .executes(exec)
                .then(Commands.argument('seed', IntArg.integer())
                  .executes(exec)))))))

  const dispatcher = event.getDispatcher()

  // /perlin <x> <y> [scale] [steps] [offset] [peak] [seed]   -> shows a [Click to copy] button
  // /perlin copy <same args> and /perlincopy <same args>     -> copies straight away
  dispatcher.register(Commands.literal('perlin')
    .then(Commands.literal('copy').then(buildArgs(ctx => run(ctx, true))))
    .then(buildArgs(ctx => run(ctx, false))))
  dispatcher.register(Commands.literal('perlincopy').then(buildArgs(ctx => run(ctx, true))))

  dispatcher.register(Commands.literal('perlinhelp').executes(ctx => {
    say('--- /perlin help ---', ChatFormatting.GOLD)
    say('/perlin <x> <y> [scale] [steps] [offset] [peak] [seed]', ChatFormatting.YELLOW)
    say('/perlin copy <same arguments>  (or /perlincopy) - same thing, but copies to the clipboard immediately')
    say('x, y   Width and height in characters (1-1000).')
    say('scale  Noise zoom (0.001-5, default 0.15). Small = big smooth blobs, large = busy noise.')
    say('steps  Number of shades used (2-5, default 5). Ramp: 🟦 🟩 🟨 🟧 🟥, spread evenly.')
    say('offset Bends the value curve (-1 to 1, default 0). Positive = more 🟦 with steeper climbs, negative = more 🟥. Peaks still reach 🟥 either way.')
    say('peak   How quickly values rise to the top shade (0.1-10, default 1). Above 1 = more 🟥 sooner, below 1 = rare sharp peaks.')
    say('seed   Any integer for a repeatable result. Leave out for a random one.')
    say('Example: /perlincopy 40 12 0.1 4 0.1 1.5', ChatFormatting.GRAY)
    return 1
  }))
})
