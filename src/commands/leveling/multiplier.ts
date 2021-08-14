import { ApplicationCommandOptionType } from 'discord-api-types'

import { CommandOptions } from 'discord-rose'

export default <CommandOptions>{
  name: 'Multiplier',
  command: 'multiplier',
  category: 'Leveling',
  usage: '<multiplier: Integer>',
  interaction: {
    name: 'multiplier',
    description: 'Change the XP multiplier',
    options: [
      {
        name: 'multiplier',
        description: 'Set the XP multiplier',
        type: ApplicationCommandOptionType.Integer,
        required: true
      }
    ]
  },
  userPerms: ['manageMessages'],
  interactionOnly: true,
  exec: async (ctx) => {
    const mult: number = ctx.options.multiplier

    if (mult <= 0) {
      await ctx.respond({
        color: ctx.worker.config.colors.RED,
        text: 'The XP multiplier must be greater than 0'
      })
      return
    }

    if (mult > 100) {
      await ctx.respond({
        color: ctx.worker.config.colors.RED,
        text: 'The XP-Multiplier must be no greater than 100'
      })
      return
    }

    await ctx.worker.db.guilds.setXPMultiplier(ctx.guild!.id, mult)

    await ctx.respond({
      color: ctx.worker.config.colors.GREEN,
      text: `XP multiplier set to \`${mult}x\``
    })
  }
}
