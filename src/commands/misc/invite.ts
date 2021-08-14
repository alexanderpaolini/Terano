import { CommandOptions } from 'discord-rose'

export default <CommandOptions>{
  name: 'Invite',
  command: 'invite',
  category: 'Misc',
  usage: '',
  interaction: {
    name: 'invite',
    description: 'Get the bot\' invite link'
  },
  exec: async (ctx) => {
    await ctx.respond(
      {
        text: (
          'My Invite Link:\n' +
          `https://discord.com/oauth2/authorize?client_id=${ctx.worker.user.id}&permissions=8&scope=bot%20applications.commands`
        ),
        color: ctx.worker.config.colors.PURPLE,
        removeEmbed: true
      }
    )
  }
}
