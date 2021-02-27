import { CommandContext } from "discord-rose/dist/typings/lib";

export default async (ctx: any) => {
  if (ctx.command.cooldown) {
    // const isOwner = !!await ctx.worker.db.userDB.getOwner(ctx.message.author.id);
    // if (isOwner) return true;
    return true;
  }
};
