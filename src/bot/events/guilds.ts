import TeranoWorker from '../lib/TeranoWorker';

export default (worker: TeranoWorker) => {
  worker.on('GUILD_CREATE', (guild) => {
    worker.logger.log(`Joined Guild ${guild.name} (${guild.id})`);

    // Database shit
    worker.db.guildDB.createGuild(guild.id);

    // Send the Webhook
    worker.webhooks.guildJoin(guild);
  });

  worker.on('GUILD_DELETE', (guild) => {
    worker.logger.log(`Left Guild ${guild.id}`);
    worker.webhooks.guildLeave(guild);
  });
};