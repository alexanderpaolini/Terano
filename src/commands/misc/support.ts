import { CommandOptions } from 'discord-rose'

export default <CommandOptions>{
  name: 'Support',
  command: 'support',
  description: 'Get the bot\'s support server link',
  category: 'Misc',
  usage: '',
  interaction: {
    name: 'support',
    description: 'Get the bot\'s support server link'
  },
  exec: async (ctx) => {
    await ctx.respond(
      {
        text: (
          'My Support Server:\n' +
          `https://discord.gg/${ctx.worker.config.discord.invite}`
        ),
        color: ctx.worker.config.colors.PURPLE,
        removeEmbed: true
      }
    )
  }
}
