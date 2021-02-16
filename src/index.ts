import * as config from './config.json';
import stinky from 'discord-rose';
import path from 'path';
import createLogger from './utils/createLogger';

const logger = createLogger('Master', console as any, 'magenta');

// API
import api from './api/index';

api.listen(config.port, () => {
  logger.log('Webserver started on port', config.port);

  const SHARDS = 1;

  const master = new stinky.Master(path.resolve(__dirname, './bot/worker.js'), {
    token: config.discord.token,
    log: (...args: any) => { logger.debug(...args); },
    shards: SHARDS,
    intents: ['GUILDS', 'GUILD_MESSAGES'],
    cacheControl: {
      guilds: ['name', 'description', 'preferred_locale', 'unavailable', 'icon'],
      members: ['guild_id', 'nick', 'user'],
      channels: ['guild_id', 'nsfw', 'id', 'permission_overwrites']
    }
  });

  master.start();
});

