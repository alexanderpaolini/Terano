import { Snowflake } from 'discord-api-types'
import { CommandOptions } from '../../structures/CommandHandler'

export default {
  command: 'levelrole',
  category: 'leveling',
  aliases: ['lr'],
  userPerms: ['manageRoles'],
  locale: 'LEVELROLE',
  exec: async (ctx) => {
    // Get the level and do some good checks
    const level = parseInt(ctx.args[0])
    if (!level) {
      await ctx.respond('CMD_LEVELROLE_NOLEVEL', { error: true })
      return false
    }
    if (isNaN(level)) {
      await ctx.respond('CMD_LEVELROLE_NOTNUM', { error: true })
      return false
    }
    if (level < 1) {
      await ctx.respond('CMD_LEVELROLE_TOOLOW', { error: true })
      return false
    }

    // Get the role
    if (!ctx.args[1]) {
      await ctx.respond('CMD_LEVELROLE_NOROLE', { error: true })
      return false
    }
    const roleID = ctx.args[1].replace(/<@&>/g, '')
    if (!roleID) {
      await ctx.respond('CMD_LEVELROLE_NOROLE', { error: true })
      return false
    }

    // Check if it exists
    const role = ctx.worker.guildRoles.get(ctx.id)?.get(roleID as Snowflake)
    if (!role) {
      await ctx.respond('CMD_LEVELROLE_NOTFOUND', { error: true })
      return false
    }

    // This shit sucks ngl
    const botHighest = ctx.worker.guildRoles.get(ctx.id)?.reduce((a, r) => {
      if (!a) return r.position
      if (a > r.position) return a
      else return r.position
    }, 0) ?? 0
    if (role.position >= botHighest) {
      await ctx.respond('CMD_LEVELROLE_NOPERMS', { error: true })
      return false
    }

    // Actually do the shit, ya know
    await ctx.worker.db.guildDB.addLevelRole(ctx.id, role.id, level)

    // Respond with success
    await ctx.respond('CMD_LEVELROLE_SET', {}, role.id, String(level))
    return true
  }
} as CommandOptions<boolean>
