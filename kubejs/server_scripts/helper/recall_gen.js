// kubejs/server_scripts/recall_cmd.js
ServerEvents.commandRegistry(event => {
  const { commands: Commands, arguments: Arguments } = event

  const roundHalf = v => Math.round(v * 2) / 2

  function build(ctx, round) {
    const player = ctx.source.player
    if (!player) {
      ctx.source.sendFailure(Component.of('Must be run by a player.'))
      return 0
    }

    const name = String(Arguments.STRING.getResult(ctx, 'name'))
    const f = v => (round ? roundHalf(v) : v).toFixed(round ? 1 : 3) + 'd'
    const dim = String(player.level.getDimension())

    const cmd =
      `/give @s utopia:recall_potion[custom_data={name:${JSON.stringify(name)},` +
      `dim:"${dim}",x:${f(player.x)},y:${f(player.y)},z:${f(player.z)}}]`

    player.tell(
      Component.gray('Click to copy: ').append(
        Component.yellow(cmd).clickCopy(cmd)
      )
    )
    return 1
  }

  event.register(
    Commands.literal('recallcmd')
      .requires(src => src.hasPermission(2))
      .then(Commands.argument('name', Arguments.STRING.create(event))
        .executes(ctx => build(ctx, true))
        .then(Commands.literal('exact')
          .executes(ctx => build(ctx, false))))
  )
})
