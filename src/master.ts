import * as config from './config.json';
import stinky from 'discord-rose';
import path from 'path';
import createLogger from './utils/createLogger';

const SHARDS = 1;
const loggers = createLogger('Master', console as any, 'magenta');

const master = new stinky.Master(path.resolve(__dirname, './worker.js'), {
  token: config.discord.token,
  log: (...args: any) => { loggers.log(...args); },
  shards: SHARDS,
  shardsPerCluster: Number.MAX_SAFE_INTEGER,
});

master.start();
