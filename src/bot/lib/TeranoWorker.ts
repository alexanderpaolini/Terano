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
import VoteDB from '../../database/vote';
import mongoose from 'mongoose';

// Types
import TeranoOptions from './types/TeranoOptions';

// Lib
import Monitor from './Monitor';
import colors from './colors';
import Responses from './Responses';
import Webhooks from './Webhooks';

export default class TeranoWorker extends Worker {
  prod: boolean;
  topgg: Api | null = null;
  colors = colors;
  devmode = false;
  webhooks = new Webhooks(this);
  monitors: Monitor[] = [];
  responses = Responses;
  statsInterval: NodeJS.Timeout | null = null;
  commandCooldowns = {} as { [key: string]: number; };
  db = { guildDB: new GuildDB(), userDB: new UserDB(), voteDB: new VoteDB() }

  /**
   * Create the bot
   * @param opts The options lol
   */
  constructor(public opts: TeranoOptions) {
    super();

    this.prod = opts.prod;

    // Connect to mongoose
    mongoose.connect(opts.mongodb.connectURI, opts.mongodb.connectOptions).then(() => { this.log('Connected to MongoDB'); });

    this.db = {
      guildDB: new GuildDB(),
      userDB: new UserDB()
    };

    this.loadInit();
    this.commands.middleware(flagsMiddleware());
    this.commands.options({
      bots: false,
      caseInsensitiveCommand: true,
      caseInsensitivePrefix: true,
      mentionPrefix: true
    });
    if (this.prod) this.loadTOPGG();
  }

  /**
   * Load init function
   */
  loadInit() {
    const dir = path.resolve(__dirname, '../', './init/');
    fs.readdir(dir, { withFileTypes: true }, (err, files) => {
      if (err) return this.log(err.toString());
      else {
        for (const file of files) {
          if (!file.isFile()) continue;
          if (!file.name.endsWith('.js')) continue;
          const f = require(`${dir}/${file.name}`).default;
          f(this);
        }
      }
    });
  }

  /**
   * Load the top.gg API stats
   */
  loadTOPGG() {
    this.log('Posting stats to top.gg every 20 minutes');
    this.topgg = new Api(this.opts.topgg.token);
    this.statsInterval = setInterval(this.postTOPGG.bind(this), 20 * 60 * 1000);
  }

  /**
   * Post top.gg stats
   */
  async postTOPGG() {
    if (!this.comms) return false;
    const clusterStats = await this.comms.getStats();

    const serverCount = clusterStats.reduce((a, c) => a + c.shards.reduce((b, s) => b + s.guilds, 0), 0);
    const shardCount = clusterStats.reduce((a, c) => a + c.shards.length, 0);

    this.log('Posting stats to top.gg', `Servers ${serverCount}`, `Shards ${shardCount}`);
    if (this.topgg) await this.topgg.postStats({ serverCount, shardCount });
    else {
      this.log('Posting to top.gg but not loaded.');
      return false;
    }
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
