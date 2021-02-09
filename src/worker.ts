import config from './config.json';
import TeranoWorker from './lib/Worker';
import CommandContext from './structures/CommandContext';

const worker: TeranoWorker = new TeranoWorker(config);

worker.commands.middleware(async (ctx: CommandContext) => {
  const perms = (ctx.command as any).userPerms
  const hasPerms = perms.every((perm: any) => ctx.hasPerms(perm));
  const guildData = await worker.db.guildDB.getGuild(ctx.guild.id);
  if(guildData.options.noPermissions) throw new Error(`Missing Permissions. Required Permissions: ${perms.join(', ')}`)
  return !hasPerms;
})

worker.commands.setPrefix(async (msg) => {
  const guildData = await worker.db.guildDB.getGuild(msg.guild_id);
  if (!guildData) return 't!'
  return guildData.prefix || ''
})

// "{{name}} {{owner}}".replace(/{{(.+?)}}/g, match => {
//   switch (match.slice(2, -2)) {
//       case "name": return "Name";
//       case "owner": return "Owner";
//   }
// });
// process.on('uncaughtException', worker.logger.log)
