// Basic shit
import fs from 'fs';
import path from 'path';
import { Api } from '@top-gg/sdk';

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
import Webhooks from './Webhooks';

export default class TeranoWorker extends Worker {
  prod: boolean;
  topgg: Api | null = null;
  colors = colors;
  logger: any;
  devmode = false;
  webhooks = new Webhooks(this);
  monitors: Monitor[] = [];
  responses = Responses;
  moderation = new Moderation(this);
  statsInterval: NodeJS.Timeout | null = null;
  commandCooldowns = {} as { [key: string]: number; };
  db = { guildDB: new GuildDB(), userDB: new UserDB() };
  constructor(public opts: TeranoOptions) {
    super();

    this.prod = opts.prod;
    this.logger = createLogger(`Cluster ${this.comms.id}`, console as any, 'yellow');

    // Connect to mongoose
    mongoose.connect(opts.mongodb.connectURI, opts.mongodb.connectOptions).then(() => { this.logger.log('Connected to MongoDB'); });

    this.db = {
      guildDB: new GuildDB(),
      userDB: new UserDB()
    };

    this.loadInit();
    this.commands.middleware(flagsMiddleware());
    if (this.prod) this.loadTOPGG();
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
   * Load the top.gg API stats
   */
  loadTOPGG() {
    this.logger.log('Posting stats to top.gg every 20 minutes');
    this.topgg = new Api(this.opts.topgg.token);
    this.statsInterval = setInterval(this.postTOPGG, 20 * 60 * 1000);
  }

  /**
   * Post top.gg stats
   */
  async postTOPGG() {
    if (!this.comms) return false;
    const clusterStats = await this.comms.getStats();
    const serverCount = clusterStats.reduce((a, c) => a + c.shards.reduce((b, s) => b + s.guilds, 0), 0);
    const shardCount = clusterStats.reduce((a, c) => a + c.shards.length, 0);
    this.logger.log('Posting stats to top.gg', `Servers ${serverCount}`, `Shards ${shardCount}`);
    if (this.topgg) this.topgg?.postStats({ serverCount, shardCount });
    else this.logger.error('Posting to top.gg but not loaded.');
    return true;
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
