import { CommandOptions } from 'discord-rose'

export default <CommandOptions>{
  name: 'Ping',
  command: 'ping',
  aliases: ['pong'],
  description: 'Gets the bot\'s ping.',
  category: 'Misc',
  usage: '',
  interaction: {
    name: 'ping',
    description: 'Gets the bot\'s ping.'
  },
  myPerms: ['embed'],
  exec: async (ctx) => {
    const time = Date.now()

    await ctx.typing()

    await ctx.embed
      .author(
        `Pong! (${(Date.now() - time).toFixed(2)}ms)`,
        ctx.worker.utils.getAvatar(ctx.worker.user)
      )
      .color(ctx.worker.config.colors.PURPLE)
      .send(true)
  }
}
