import { CommandContext } from 'discord-rose/dist/typings/lib'

export default () => {
  return async (ctx: CommandContext) => {
    ctx.worker.log(ctx.message.author.username + '#' + ctx.message.author.discriminator, 'ran command', ctx.command.command)
    return true
  }
}
