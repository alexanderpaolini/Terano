import { CommandContext } from "discord-rose/dist/typings/lib";

export default () => {
  return async (ctx: CommandContext) => {
    if (ctx.command.disabled || ctx.worker.devmode) {
      const isOwner = !!await ctx.worker.db.userDB.getOwner(ctx.message.author.id);
      if (isOwner) return true;
      ctx.worker.responses.tiny(ctx, ctx.worker.colors.ORANGE, 'This command is currently disabled.');
      return false;
    }
    return true;
  };
};
