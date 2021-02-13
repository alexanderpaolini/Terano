// Other shit
import Worker from 'discord-rose/dist/clustering/worker/Worker';
import { promisify } from 'util';
import { Api } from '@top-gg/sdk';
import path from 'path';
import fs from 'fs';

// Redis?
import redis from 'redis';

// Database
import mongoose from 'mongoose';
import GuildDB from '../database/guilds';
import UserDB from '../database/users';

// Database Models
import userModel from '../database/models/users/users';
import userLevelModel from '../database/models/users/levels';
import userSettingsModel from '../database/models/users/settings';
import guildModel from '../database/models/guilds/guilds';
import guildModerationModel from '../database/models/guilds/moderation';

// Monitors
import LevelMonitor from '../monitors/level';
import PrefixMonitor from '../monitors/prefix';

// Structures
import colors from '../structures/colors';
import TeranoOptions from '../structures/TeranoOptions';

// Lib
import Responses from './Responses';
// import Embed from './Embed';

// Utils
import createLogger from '../utils/createLogger';

export default class TeranoWorker extends Worker {
  redis: redis.RedisClient;
  logger: any;
  dbModels: any;
  responses: typeof Responses;
  db: {
    guildDB: GuildDB,
    userDB: UserDB,
    connection: typeof mongoose;
  };
  colors: typeof colors;
  devMode: boolean;
  topgg: Api;
  statsInterval: NodeJS.Timeout;
  constructor(public opts: TeranoOptions) {
    super();
    this.logger = createLogger(`Cluster ${this.comms.id}`, console as any, 'yellow');
    this.responses = Responses;

    this.colors = colors;

    this.loadMonitors();
    this.initMongo();
    this.initRedis();
    this.loadInit();
    // this.loadTOPGG();
  }

  loadInit() {
    const dir = path.resolve(__dirname, '../', './init/');
    fs.readdir(dir, (err, files) => {
      if (err) return console.error(err.toString());
      else {
        files.forEach(file => {
          try {
            fs.stat(path.resolve(__dirname, dir, file), (e, stats) => {
              if (e) return console.error(err.toString());
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

  loadMonitors() {
    new LevelMonitor(this);
    new PrefixMonitor(this);
  }

  async initMongo() {
    const connection = await mongoose.connect(this.opts.mongodb.connectURI, this.opts.mongodb.connectOptions);
    this.db = {
      guildDB: new GuildDB(),
      userDB: new UserDB(),
      connection: connection
    };
    this.logger.log('Connected to MongoDB');

    this.dbModels = { userLevelModel, guildModel, guildModerationModel, userModel, userSettingsModel };
  }

  // Redis is required to run the bot even when NOTHING uses it.
  initRedis() {
    const client = redis.createClient(this.opts.redis);
    ['get', 'set', 'del', 'ttl', 'hget'].forEach(command => {
      client[command] = promisify(client[command]).bind(client);
    });
    this.logger.log('Connected to Redis at:', this.opts.redis.host + ':' + this.opts.redis.port);
    return client;
  }

  get shardGuildCounts() {
    return this.guilds.reduce((a, b) => {
      const shard = Number((BigInt(b.id) >> BigInt(22)) % BigInt(this.options.shards));
      if (!a[shard]) a[shard] = 0;
      a[shard]++;
      return a;
    }, {});
  }

  loadTOPGG() {
    this.topgg = new Api(this.opts.topdotgeegee);
    this.statsInterval = setInterval(() => {
      const shardGuildCounts = this.shardGuildCounts;
      for (const [K, V] of Object.entries(shardGuildCounts)) {
        this.topgg.postStats({
          serverCount: V as number,
          shardId: Number(K),
          shardCount: this.options.shards as number
        });
      }
    }, 20 * 60 * 1000);
  }
}
