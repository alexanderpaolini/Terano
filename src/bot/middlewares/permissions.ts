import { CommandContext } from "discord-rose/dist/typings/lib";

export default async (ctx: CommandContext) => {
  // const isOwner = !!await ctx.worker.db.userDB.getOwner(ctx.message.author.id);
  // if (isOwner && ctx.flags.idc) return true;

  const perms = ctx.command.permissions;
  if (perms.length) {
    const hasPerms = perms.every((perm: any) => ctx.hasPerms(perm));
    const noPermissions = await ctx.worker.db.guildDB.getNoPermsMessage(ctx.guild.id);
    if (!hasPerms) {
      if (noPermissions) ctx.worker.responses.tiny(ctx, ctx.worker.colors.RED, `Missing Permissions. Required Permissions: ${perms.join(', ')}`);
      return false;
    }
    return true;
  } else return true;
};
