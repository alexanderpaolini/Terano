import { CommandContext } from "discord-rose/dist/typings/lib";

export default async (ctx: CommandContext) => {
  if (ctx.worker.devMode) {
    const isOwner = !!await ctx.worker.db.userDB.getOwner(ctx.message.author.id);
    if (isOwner) return true;
    ctx.worker.responses.tiny(ctx, ctx.worker.colors.RED, 'Commands are currently disabled.');
    return false;
  }
  else return true;
};
