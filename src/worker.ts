import config from './config.json';
import TeranoWorker from './lib/Worker';
import CommandContext from './structures/CommandContext';

const worker: TeranoWorker = new TeranoWorker(config);

worker.commands.middleware(async (ctx: CommandContext) => {
  const perms = ctx.command.permissions
  const hasPerms = perms.every((perm: any) => ctx.hasPerms(perm));
  const guildData = await worker.db.guildDB.getGuild(ctx.guild.id);
  if(guildData.options.noPermissions) throw new Error(`Missing Permissions. Required Permissions: ${perms.join(', ')}`)
  return !hasPerms;
})

// worker.commands.middleware(async (ctx: CommandContext) => {
//   const perms = ctx.command.botPermissions
//   const hasPerms = perms.every((perm: any) => ctx.myPerms(perm));
//   worker.responses.tiny(ctx, worker.colors.RED, `I am missing one or more of the following permissions:\n  ${perms.join('\n  ')}`)
//   return !hasPerms;
// })

worker.commands.setPrefix(async (msg) => {
  const guildData = await worker.db.guildDB.getGuild(msg.guild_id);
  if (!guildData) return 't!'
  return guildData.prefix || ''
})
