import path, { resolve } from 'path';
import fs, { readdir } from 'fs'

import { promisify } from 'util';
import redis from 'redis'

import Worker from "discord-rose/dist/clustering/worker/Worker";

import TeranoOptions from '../structures/TeranoOptions'

import { RedisClient } from "redis";

import userModel from '../database/models/users/users'
import userLevelModel from '../database/models/users/levels'
import userSettingsModel from '../database/models/users/settings'
import guildModel from '../database/models/guilds/guilds'
import guildModerationModel from '../database/models/guilds/moderation'

import LevelMonitor from '../monitors/level'

import mongoose from 'mongoose';
import GuildDB from '../database/models/guilds';
import UserDB from '../database/models/users';

import { colors } from '../structures/colors';
import createLogger from '../utils/createLogger';
import Responses from './Responses';
import PrefixMonitor from '../monitors/prefix';

export default class TeranoWorker extends Worker {
  redis: RedisClient;
  // logger: Logger;
  logger: any;
  dbModels: any;
  responses: typeof Responses
  db: {
    guildDB: GuildDB,
    userDB: UserDB,
    connection?: typeof mongoose
  };
  colors: typeof colors;
  constructor(public opts: TeranoOptions) {
    super()
    this.logger = createLogger(`Cluster ${this.comms.id}`, console as any, 'yellow')
    this.responses = Responses;
    
    this.colors = colors;
    
    // Init shit
    this.db = {
      guildDB: new GuildDB(),
      userDB: new UserDB(),
    };
    
    this.loadCommands(path.resolve(__dirname, '../', opts.commandDir))
    this.loadMonitors()
    this.initMongo()
    this.initRedis()
    this.loadInit()
  }

  loadInit() {
    const dir = path.resolve(__dirname, '../', './init/')
    fs.readdir(dir, (err, files) => {
      if (err) return console.error(err.toString());
      else {
        files.forEach(file => {
          try {
            fs.stat(path.resolve(__dirname, dir, file), (err, stats) => {
              if (stats.isDirectory()) return this.loadCommands(`${dir}/${file}`);
              if (stats.isFile() && file.endsWith('.js')) {
                this.logger.log('Loaded Init', `${file}`)
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
    this.db.connection = await mongoose.connect(this.opts.mongodb.connectURI, this.opts.mongodb.connectOptions)
    this.logger.log('Connected to MongoDB');

    this.dbModels = { userLevelModel, guildModel, guildModerationModel, userModel, userSettingsModel }
  }

  initRedis() {
    const client = redis.createClient(this.opts.redis);
    ['get', 'set', 'del', 'ttl', 'hget'].forEach(command => {
      client[command] = promisify(client[command]).bind(client);
    });
    this.logger.log('Connected to Redis at:', this.opts.redis.host + ':' + this.opts.redis.port);
    return client;
  }

  loadCommands(dir: string) {
    fs.readdir(dir, (err, files) => {
      if (err) return console.error(err.toString());
      else {
        files.forEach(file => {
          try {
            fs.stat(path.resolve(__dirname, dir, file), (err, stats) => {
              if (stats.isDirectory()) return this.loadCommands(`${dir}/${file}`);
              if (stats.isFile() && file.endsWith('.js')) {
                this.logger.log('Loaded command', `${file}`)
                const cmd = require(`${dir}/${file}`).default;
                this.commands.add(cmd);
              }
            });
          } catch (e) { }
        });
      }
    });
  }
}
