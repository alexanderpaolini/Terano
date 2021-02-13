import config from './config.json';
import TeranoWorker from './lib/Worker';
import { CommandContext } from 'discord-rose/dist/typings/lib';

const worker: TeranoWorker = new TeranoWorker(config);

worker.commands.middleware(async (ctx: CommandContext) => {
  const perms = ctx.command.permissions;
  if (perms.length) {
    const hasPerms = perms.every((perm: any) => ctx.hasPerms(perm));
    const guildData = await worker.db.guildDB.getGuild(ctx.guild.id);
    if (!hasPerms) {
      if (guildData.options.noPermissions) ctx.worker.responses.tiny(ctx, ctx.worker.colors.RED, `Missing Permissions. Required Permissions: ${perms.join(', ')}`);
      return false;
    }
    return true;
  } else return true;
});

worker.commands.middleware(async (ctx: CommandContext) => {
  if (ctx.worker.devMode) {
    const isOwner = !!await ctx.worker.db.userDB.getOwner(ctx.message.author.id);
    if (isOwner) return true;
    ctx.worker.responses.tiny(ctx, ctx.worker.colors.RED, 'Commands are currently disabled.');
    return false;
  }
  else return true;
});

worker.commands.middleware(async (ctx: CommandContext) => {
  if (ctx.command.disabled) {
    const isOwner = !!await ctx.worker.db.userDB.getOwner(ctx.message.author.id);
    if (isOwner) return true;
    ctx.worker.responses.tiny(ctx, ctx.worker.colors.ORANGE, 'This command is currently disabled.');
    return false;
  }
  return true;
});

worker.commands.middleware(async (ctx: CommandContext) => {
  if (ctx.command.owner) {
    const isOwner = !!await ctx.worker.db.userDB.getOwner(ctx.message.author.id);
    if (!isOwner) {
      ctx.worker.responses.tiny(ctx, ctx.worker.colors.RED, 'You can\'t do this, silly.');
      return false;
    }
    return true;
  } else return true;
});

worker.commands.middleware(async (ctx: CommandContext) => {
  return !await ctx.worker.db.userDB.getBlacklist(ctx.message.author.id);
});

worker.commands.middleware(async (ctx: CommandContext) => {
  const perms = ctx.command.botPermissions;
  const hasPerms = perms.every((perm: any) => ctx.myPerms(perm));
  worker.responses.tiny(ctx, worker.colors.RED, `I am missing one or more of the following permissions:\n  ${perms.join('\n  ')}`);
  return !hasPerms;
});

worker.commands.setPrefix(async (msg) => {
  return 't!';
  // return (await worker.db.guildDB.getPrefix(msg.guild_id)) || 't!';
});
