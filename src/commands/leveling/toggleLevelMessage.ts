import { CommandOptions } from 'discord-rose'

export default <CommandOptions>{
  name: 'Toggle Level Message',
  command: 'levelmessage',
  category: 'Leveling',
  usage: '',
  interaction: {
    name: 'togglelevelmessage',
    description: 'Toggle the level-up message'
  },
  userPerms: ['manageMessages'],
  guildOnly: true,
  interactionOnly: true,
  exec: async (ctx) => {
    const sendMesasge = !(await ctx.worker.db.guilds.getSendLevelMessage(ctx.guild!.id))
    await ctx.worker.db.guilds.setSendLevelMessage(ctx.guild!.id, sendMesasge)

    await ctx.respond({
      color: ctx.worker.config.colors.GREEN,
      text: `Level-Up messages \`${sendMesasge ? 'enabled' : 'disabled'}\``
    })
  }
}
