// @ts-ignore
import * as config from './config.json'
import { Logger } from 'loggers';
import stinky from '../../discord-rose/';
import path from 'path';
import createLogger from './utils/createLogger';

const SHARDS = 1
const loggers = createLogger('Master', console as any, 'magenta')

const master = new stinky.Master(path.resolve(__dirname, './worker.js'), {
  token: config.discord.token,
  log: (...args: any) => { loggers.log(...args); },
  shards: SHARDS,
  shardsPerCluster: 1,
  intents: 32509
});

master.start();

// process.on('unhandledRejection', console.log)
