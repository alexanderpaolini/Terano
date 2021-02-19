// Basic shit
import fs from 'fs';
import path from 'path';

// Worker
import { Worker } from 'discord-rose';

// Required middlewares
import flagsMiddleware from '@discord-rose/flags-middleware';

// Database
import GuildDB from '../../database/guild';
import UserDB from '../../database/user';
import mongoose from 'mongoose';

// Utils
import createLogger from '../../utils/logger';

// Types
import TeranoOptions from './types/TeranoOptions';

// Lib
import Monitor from './Monitor';
import colors from './Colors';
import Responses from './Responses';
import Moderation from './Moderation';

export default class TeranoWorker extends Worker {
  logger: any;
  db = {
    guildDB: new GuildDB(),
    userDB: new UserDB()
  }
  monitors: Monitor[] = [];
  colors: typeof colors = colors;
  responses: typeof Responses = Responses;
  moderation: Moderation = new Moderation(this);
  devmode: boolean = false;
  constructor(public opts: TeranoOptions) {
    super();
    this.logger = createLogger(`Cluster ${this.comms.id}`, console as any, 'yellow');

    // Connect to mongoose
    mongoose.connect(opts.mongodb.connectURI, opts.mongodb.connectOptions).then(() => { this.logger.log('Connected to MongoDB') })

    this.db = {
      guildDB: new GuildDB(),
      userDB: new UserDB()
    }

    this.loadInit();
    this.commands.middleware(flagsMiddleware())
  }

  /**
   * Load init function
   */
  loadInit() {
    const dir = path.resolve(__dirname, '../', './init/');
    fs.readdir(dir, (err, files) => {
      if (err) return console.error(err.toString());
      else {
        files.forEach(file => {
          try {
            fs.stat(path.resolve(__dirname, dir, file), (e, stats) => {
              if (e) return console.error(e.toString());
              if (stats.isFile() && file.endsWith('.js')) {
                this.logger.log('Loaded Init', `${file}`);
                const f = require(`${dir}/${file}`).default;
                f(this);
              }
            });
          } catch (e) { }
        });
      }
    });
  }

  /**
   * A nicely formatted stats
   */
  get shardStats() {
    return this.shards.reduce((a, shard) => {
      a[shard.id] = this.guilds.reduce((b, guild) => {
        if (Number((BigInt(guild.id) >> BigInt(22)) % BigInt(this.options.shards)) !== shard.id) return b;
        return {
          ping: (this.shards.get(shard.id)?.ping || '?').toString(),
          guilds: b.guilds + 1,
          channels: b.channels + this.channels.filter(ch => ch.guild_id === guild.id).size,
          roles: b.roles + (this.guildRoles.get(guild.id)?.size || 0)
        };
      }, { guilds: 0, channels: 0, roles: 0, ping: '' } as ShardStat);
      return a;
    }, {} as ShardObject);
  }

  /**
   * An object Key: shard number, Value: Guilds
   */
  get shardGuildCounts() {
    return this.guilds.reduce((a, b) => {
      const shard = Number((BigInt(b.id) >> BigInt(22)) % BigInt(this.options.shards));
      if (!a[shard]) a[shard] = 0;
      a[shard]++;
      return a;
    }, {} as ShardGuildObject);
  }

  /**
   * A nicely formatted memory stats
   */
  get mem() {
    return Object.entries(process.memoryUsage()).reduce((T, [K, V]) => (T[K] = (V / (1024 ** 2)).toFixed(1) + 'MB', T), {} as any);
  }
}
