import { ApplicationCommandOptionType } from 'discord-api-types'

import { CommandOptions } from 'discord-rose'

export default <CommandOptions>{
  name: 'Cooldown',
  command: 'cooldown',
  category: 'Leveling',
  usage: '<time: Time in seconds>',
  interaction: {
    name: 'cooldown',
    description: 'Set the XP cooldown',
    options: [
      {
        name: 'seconds',
        description: 'The delay in seconds',
        type: ApplicationCommandOptionType.Integer,
        required: true
      }
    ]
  },
  userPerms: ['manageMessages'],
  interactionOnly: true,
  exec: async (ctx) => {
    const time: number = ctx.options.seconds

    await ctx.worker.db.guilds.setXPCooldown(ctx.guild!.id, time)

    await ctx.respond({
      color: ctx.worker.config.colors.GREEN,
      text: `XP cooldown set to \`${time}s\``
    })
  }
}
