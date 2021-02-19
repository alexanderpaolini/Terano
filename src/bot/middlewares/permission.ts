import { CommandContext } from "discord-rose/dist/typings/lib";

export default async (ctx: CommandContext) => {
  const isOwner = !!await ctx.worker.db.userDB.getOwner(ctx.message.author.id);
  if (isOwner && ctx.flags.idc) return true;

  const perms = ctx.command.permissions;
  if (perms) {
    const hasPerms = perms.every((perm: any) => ctx.hasPerms(perm));
    if (hasPerms) return true;

    const noPermissions = await ctx.worker.db.guildDB.getSendPermsMessage(ctx.guild.id);
    if (noPermissions) ctx.worker.responses.tiny(ctx, ctx.worker.colors.RED, `Missing Permissions. Required Permissions: ${perms.join(', ')}`);
    return false;
  } else return true;
};
