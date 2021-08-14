import { ApplicationCommandOptionType } from 'discord-api-types'

import { CommandOptions } from 'discord-rose'

export default <CommandOptions>{
  name: 'Tag',
  command: 'tag',
  category: 'Leveling',
  usage: '<tag: String>',
  interaction: {
    name: 'tag',
    description: 'Set your rank card tag',
    options: [
      {
        name: 'tag',
        description: 'The display tag',
        type: ApplicationCommandOptionType.String,
        required: true
      }
    ]
  },
  interactionOnly: true,
  exec: async (ctx) => {
    const tag: string = ctx.options.tag

    if (tag.length > 30) {
      await ctx.respond({
        color: ctx.worker.config.colors.RED,
        text: 'Tag must be no longer than thirty (30) characters'
      })
      return
    }

    await ctx.worker.db.users.setTag(ctx.author.id, tag)

    await ctx.respond({
      color: ctx.worker.config.colors.GREEN,
      text: `Rank card tag set to \`${tag}\``
    })
  }
}
