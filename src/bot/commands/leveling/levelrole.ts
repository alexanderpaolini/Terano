import { Snowflake } from 'discord-api-types'
import { CommandOptions } from 'discord-rose'

export default {
  name: 'Level Role',
  usage: 'levelrole <level> <ID | Role Mention>',
  description: 'Add a level to the autorole',
  category: 'leveling',
  command: 'levelrole',
  aliases: ['lr'],
  permissions: ['manageRoles'],
  botPermissions: [],
  exec: async (ctx) => {
    // Get the level and do some good checks
    const level = parseInt(ctx.args[0])
    if (!level) return ctx.error(await ctx.lang('CMD_LEVELROLE_NOLEVEL'))
    if (isNaN(level)) return ctx.error(await ctx.lang('CMD_LEVELROLE_NOTNUM'))
    if (level < 1) return ctx.error(await ctx.lang('CMD_LEVELROLE_TOOLOW'))

    // Get the role
    if (!ctx.args[1]) return ctx.error(await ctx.lang('CMD_LEVELROLE_NOROLE'))
    const roleID = ctx.args[1].replace(/<@&>/g, '')
    if (!roleID) return ctx.error(await ctx.lang('CMD_LEVELROLE_NOROLE'))

    // Check if it exists
    const role = ctx.worker.guildRoles.get(ctx.getID)?.get(roleID as Snowflake)
    if (!role) return ctx.error(await ctx.lang('CMD_LEVELROLE_NOTFOUND'))

    // This shit sucks ngl
    const botHighest = ctx.worker.guildRoles.get(ctx.getID)?.reduce((a, r) => {
      if (!a) return r.position
      if (a > r.position) return a
      else return r.position
    }, 0) ?? 0
    if (role.position >= botHighest) return ctx.error(await ctx.lang('CMD_LEVELROLE_NOPERMS'))

    // Actually do the shit, ya know
    await ctx.worker.db.guildDB.addLevelRole(ctx.getID, role.id, level)

    // Respond with success
    await ctx.normalResponse(ctx.worker.colors.GREEN, await ctx.lang('CMD_LEVELROLE_SET', role.id, String(level)))
  }
} as CommandOptions
