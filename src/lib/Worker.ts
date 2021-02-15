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

// Monitors
import LevelMonitor from '../monitors/level';
import PrefixMonitor from '../monitors/prefix';

// Structures
import colors from '../structures/colors';
import TeranoOptions from '../structures/TeranoOptions';

// Lib
import Responses from './Responses';
// import Embed from './Embed';


// middlewares
import flagsMiddleware from '@discord-rose/flags-middleware';

// Utils
import createLogger from '../utils/createLogger';
import Moderation from './Moderation';

export default class TeranoWorker extends Worker {
  redis: redis.RedisClient;
  logger: any;
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
  moderation: Moderation;
  constructor(public opts: TeranoOptions) {
    super();
    this.commands.middleware(flagsMiddleware());
    this.logger = createLogger(`Cluster ${this.comms.id}`, console as any, 'yellow');
    this.moderation = new Moderation(this);
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

  get shardStats(): any {
    return this.shards.reduce((a, shard) => {
      a[shard.id] = this.guilds.reduce((b, guild) => {
        if (Number((BigInt(guild.id) >> BigInt(22)) % BigInt(this.options.shards)) !== shard.id) return b;
        return {
          ping: (this.shards.get(shard.id).ping || '?').toString(),
          guilds: b.guilds + 1,
          channels: b.channels + this.channels.filter(ch => ch.guild_id === guild.id).size,
          roles: b.roles + this.guildRoles.get(guild.id).size
        };
      }, { guilds: 0, channels: 0, roles: 0, ping: '' });
      return a;
    }, {});
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

  get mem(): any {
    return Object.entries(process.memoryUsage()).reduce((T, [K, V]) => (T[K] = (V / (1024 ** 2)).toFixed(1) + 'MB', T), {});
  }
}
