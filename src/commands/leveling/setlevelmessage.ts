import { ApplicationCommandOptionType } from 'discord-api-types'

import { CommandOptions } from 'discord-rose'

export default <CommandOptions>{
  name: 'Set Level Message',
  command: 'setlevelmessage',
  category: 'Leveling',
  usage: '<string: Level-Up Message>',
  interaction: {
    name: 'setlevelmessage',
    description: 'Set the level-up message',
    options: [
      {
        name: 'message',
        description: 'The level-up message',
        type: ApplicationCommandOptionType.String
      }
    ]
  },
  userPerms: ['manageMessages'],
  guildOnly: true,
  interactionOnly: true,
  exec: async (ctx) => {
    const message: string = ctx.options.message

    await ctx.worker.db.guilds.setLevelMessage(ctx.guild!.id, message)

    await ctx.respond({
      color: ctx.worker.config.colors.GREEN,
      text: `Level-up message set to \`${message}\``
    })
  }
}
