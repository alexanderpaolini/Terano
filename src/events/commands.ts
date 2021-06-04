import TeranoWorker from '../structures/TeranoWorker'

export default (worker: TeranoWorker): void => {
  worker.commands.on('COMMAND_RAN', (ctx, r) => {
    if (r === true && !ctx.command.cooldown?.before) ctx.invokeCooldown()

    worker.log(ctx.message.author.username + '#' + ctx.message.author.discriminator, 'ran command', ctx.command.command)
  })
}
