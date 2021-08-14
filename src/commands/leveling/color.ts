import { ApplicationCommandOptionType } from 'discord-api-types'

import { CommandOptions } from 'discord-rose'

export default <CommandOptions>{
  name: 'Color',
  command: 'color',
  aliases: ['colour'],
  category: 'Leveling',
  usage: '<color: String>',
  interaction: {
    name: 'color',
    description: 'Set your rank card color',
    options: [
      {
        name: 'color',
        description: 'The accent color',
        type: ApplicationCommandOptionType.String,
        required: true
      }
    ]
  },
  interactionOnly: true,
  exec: async (ctx) => {
    const color: string = ctx.args[0]

    await ctx.worker.db.users.setColor(ctx.author.id, color)

    await ctx.respond({
      color: ctx.worker.config.colors.GREEN,
      text: `Rank card color set to \`${color}\``
    })
  }
}
