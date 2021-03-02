import { APIGuild } from 'discord-api-types';
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
    // Get the guild from cache
    const fromCache = worker.guilds.get(guild.id);

    if (fromCache) {
      worker.logger.log(`Left Guild ${fromCache.name} ${fromCache.id}`);

      // Send the webhook
      worker.webhooks.guildLeave(fromCache as APIGuild);
    }
  });
};
