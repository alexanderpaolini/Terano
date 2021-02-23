// Config
import config from './config.json';

// Required shit
import { Master } from 'discord-rose';
import path from 'path';

// Utils
import createLogger from './utils/logger';
const logger = createLogger('Master', console as any, 'magenta');

// API
import api from './api/index';

api.listen(config.port, () => {
  logger.log('Webserver started on port', config.port);

  const SHARDS = 1;

  const master = new Master(path.resolve(__dirname, './bot/worker.js'), {
    token: config.discord.token,
    log: (...args: any) => { logger.debug(...args); },
    shards: SHARDS,
    intents: ['GUILDS', 'GUILD_MESSAGES'],
    cacheControl: {
      guilds: ['name', 'description', 'preferred_locale', 'unavailable', 'icon', 'owner_id'],
      members: ['nick', 'user'],
      channels: ['nsfw', 'permission_overwrites'],
      roles: ['permissions']
    }
  });

  master.start();
});
