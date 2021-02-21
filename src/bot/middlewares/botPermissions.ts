import { CommandContext } from "discord-rose/dist/typings/lib";

export default async (ctx: CommandContext) => {
  const isOwner = !!await ctx.worker.db.userDB.getOwner(ctx.message.author.id);
  if (isOwner && ctx.flags.idc) return true;

  const perms = ctx.command.botPermissions;
  if(!perms) return;

  const hasPerms = perms.every((perm: any) => ctx.myPerms(perm));
  if (!hasPerms) {
    ctx.worker.responses.tiny(ctx, ctx.worker.colors.RED, `I am missing one or more of the following permissions:\n  ${perms.join('\n  ')}`);
    return false;
  }
  return true;
}; 