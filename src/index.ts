// Config
import config from './config.json';

// Required shit
import { Master } from 'discord-rose';
import path from 'path';

const master = new Master(path.resolve(__dirname, './bot/worker.js'), {
  token: config.discord.token,
  shards: 'auto',
  intents: ['GUILDS', 'GUILD_MESSAGES'],
  cacheControl: {
    guilds: ['name', 'description', 'preferred_locale', 'unavailable', 'icon', 'owner_id'],
    members: ['nick', 'user'],
    channels: ['nsfw', 'permission_overwrites'],
    roles: ['permissions']
  }
});

// Spawn the API
master.spawnProcess('API', path.resolve(__dirname, './api/index.js'));

// Add the fetch user for custom threads
master.handlers.on('FETCH_USER', async (cluster, data, resolve) => {
  resolve(await master.rest.users.get(data).catch(x => false as any));
});

master.start();
