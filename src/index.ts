// Config
import config from './config.json';

// Required shit
import { Master } from 'discord-rose';
import path from 'path';

// Utils
import createLogger from './utils/logger';

// Create the logger for fancy logs
const logger = createLogger('Master', console as any, 'magenta');

const master = new Master(path.resolve(__dirname, './bot/worker.js'), {
  token: config.discord.token,
  log: (...args: any) => { logger.debug(...args); },
  shards: 'auto',
  intents: ['GUILDS', 'GUILD_MESSAGES'],
  cacheControl: {
    guilds: ['name', 'description', 'preferred_locale', 'unavailable', 'icon', 'owner_id'],
    members: ['nick', 'user'],
    channels: ['nsfw', 'permission_overwrites'],
    roles: ['permissions']
  }
});

master.spawnProcess('api', path.resolve(__dirname, './api/index.js'));

// Add the fetch user for custom threads
master.handlers.on('FETCH_USER', async (cluster, data, resolve) => {
  resolve(await master.rest.users.get(data).catch(x => false as any));
});

master.start();
