import { Snowflake } from 'discord-api-types'
import { CommandOptions } from 'discord-rose'

export default {
  name: 'Level Role',
  usage: 'levelrole <level> <ID | Role Mention>',
  description: 'Add a level to the autorole',
  category: 'leveling',
  command: 'levelrole',
  aliases: ['lr'],
  userPerms: ['manageRoles'],
  myPerms: [],
  exec: async (ctx) => {
    // Get the level and do some good checks
    const level = parseInt(ctx.args[0])
    if (!level) return await ctx.respond('CMD_LEVELROLE_NOLEVEL', { error: true })
    if (isNaN(level)) return await ctx.respond('CMD_LEVELROLE_NOTNUM', { error: true })
    if (level < 1) return await ctx.respond('CMD_LEVELROLE_TOOLOW', { error: true })

    // Get the role
    if (!ctx.args[1]) return await ctx.respond('CMD_LEVELROLE_NOROLE', { error: true })
    const roleID = ctx.args[1].replace(/<@&>/g, '')
    if (!roleID) return await ctx.respond('CMD_LEVELROLE_NOROLE', { error: true })

    // Check if it exists
    const role = ctx.worker.guildRoles.get(ctx.getID)?.get(roleID as Snowflake)
    if (!role) return await ctx.respond('CMD_LEVELROLE_NOTFOUND', { error: true })

    // This shit sucks ngl
    const botHighest = ctx.worker.guildRoles.get(ctx.getID)?.reduce((a, r) => {
      if (!a) return r.position
      if (a > r.position) return a
      else return r.position
    }, 0) ?? 0
    if (role.position >= botHighest) return await ctx.respond('CMD_LEVELROLE_NOPERMS', { error: true })

    // Actually do the shit, ya know
    await ctx.worker.db.guildDB.addLevelRole(ctx.getID, role.id, level)

    // Respond with success
    await ctx.respond('CMD_LEVELROLE_SET', {}, role.id, String(level))
  }
} as CommandOptions
