import { ApplicationCommandOptionType } from 'discord-api-types'

import { CommandOptions } from 'discord-rose'

export default <CommandOptions>{
  name: 'Level Role',
  command: 'levelrole',
  category: 'Leveling',
  usage: '<subcommand: Valid subcommand>',
  interaction: {
    name: 'levelrole',
    description: 'Change the level-up reward roles',
    options: [
      {
        name: 'add',
        description: 'Add a level-up reward role',
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: 'role',
            description: 'The role to be rewarded',
            type: ApplicationCommandOptionType.Role,
            required: true
          },
          {
            name: 'level',
            description: 'The level when it will be given',
            type: ApplicationCommandOptionType.Integer,
            required: true
          }
        ]
      },
      {
        name: 'remove',
        description: 'Remove a level-up reward role',
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: 'role',
            description: 'The role that is rewarded',
            type: ApplicationCommandOptionType.Role,
            required: true
          },
          {
            name: 'level',
            description: 'The level when it is given',
            type: ApplicationCommandOptionType.Integer,
            required: true
          }
        ]
      },
      {
        name: 'list',
        description: 'List the level-up reward roles',
        type: ApplicationCommandOptionType.Subcommand
      }
    ]
  },
  myPerms: ['embed'],
  userPerms: ['manageMessages'],
  guildOnly: true,
  interactionOnly: true,
  exec: async (ctx) => {
    const subCommand = Object.keys(ctx.options)[0]

    switch (subCommand) {
      case 'add': {
        const { role: roleId, level } = ctx.options.add

        const guildData = await ctx.worker.db.guilds.getGuild(ctx.guild!.id)
        const levelRoles = guildData.level.level_roles

        const exists = levelRoles.find(e => e.id === roleId && e.level === level)
        if (exists) {
          await ctx.respond({
            color: ctx.worker.config.colors.RED,
            text: 'That role is already rewarded at that level'
          })
          break
        }

        await ctx.worker.db.guilds.addLevelRole(ctx.guild!.id, roleId, level)

        await ctx.respond({
          color: ctx.worker.config.colors.GREEN,
          text: 'Added role to level-up rewards'
        })
        break
      }
      case 'remove': {
        const { role: roleId, level } = ctx.options.remove

        const guildData = await ctx.worker.db.guilds.getGuild(ctx.guild!.id)
        const levelRoles = guildData.level.level_roles

        const exists = levelRoles.find(e => e.id === roleId && e.level === level)
        if (!exists) {
          await ctx.respond({
            color: ctx.worker.config.colors.RED,
            text: 'That role is already rewarded at that level'
          })
          break
        }

        guildData.level.level_roles = levelRoles.filter(e => !(e.id === roleId && e.level === level))
        await ctx.worker.db.guilds.updateGuild(guildData)

        await ctx.respond({
          color: ctx.worker.config.colors.GREEN,
          text: 'Removed role from level-up rewards'
        })
        break
      }
      case 'list': {
        const guildData = await ctx.worker.db.guilds.getGuild(ctx.guild!.id)
        const levelRoles = guildData.level.level_roles.sort((a, b) => a.level - b.level)

        await ctx.embed
          .author(
            'Level-Up Role Rewards',
            ctx.worker.utils.getGuildAvatar(ctx.me, ctx.guild!.id)
          )
          .description(
            levelRoles.map(e => `\`${e.level}\`: <@&${e.id}>`).join('\n')
          )
          .color(ctx.worker.config.colors.PURPLE)
          .send()
        break
      }
      default: break
    }
  }
}
