import { CommandContext } from "discord-rose/dist/typings/lib";

export default () => {
  return async (ctx: CommandContext) => {
    if (ctx.command.owner) {
      const isOwner = !!await ctx.worker.db.userDB.getOwner(ctx.message.author.id);
      if (!isOwner) {
        ctx.worker.responses.tiny(ctx, ctx.worker.colors.RED, 'You can\'t do this, silly.');
        return false;
      }
      return true;
    } else return true;
  };
};