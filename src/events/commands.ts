import TeranoWorker from '../structures/TeranoWorker'

export default (worker: TeranoWorker): void => {
  worker.commands.on('NO_COMMAND', (m) => {
    if (!worker.prod) worker.log(m.author.username + '#' + m.author.discriminator, 'ran a non-existant command')
  })

  worker.commands.on('COMMAND_RAN', (ctx, r) => {
    if (r === true && !ctx.command.cooldown?.before) ctx.invokeCooldown()

    worker.log(ctx.message.author.username + '#' + ctx.message.author.discriminator, 'ran command', ctx.command.command)
  })
}
