import CommandContext from '../lib/CommandContext'

export default () => {
  return async (ctx: CommandContext) => {
    const isOwner = !!await ctx.worker.db.userDB.getOwner(ctx.message.author.id)
    if (isOwner && ctx.flags.idc) return true

    const perms = ctx.command.permissions
    if ((perms == null) || perms.length === 0) return true

    const hasPerms = perms.every((perm: any) => ctx.hasPerms(perm))
    if (hasPerms) return true

    const noPermissions = await ctx.worker.db.guildDB.getSendPermsMessage(ctx.getID)
    if (noPermissions) await ctx.tinyResponse(ctx.worker.colors.RED, `Missing Permissions. Required Permissions: ${(perms as string[]).join(', ')}`)
    return false
  }
}
