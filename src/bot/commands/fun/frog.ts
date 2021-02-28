import { CommandOptions } from 'discord-rose/dist/typings/lib';

import fetch from 'node-fetch'

export default {
  name: 'frog',
  usage: 'frog',
  description: 'FROG.',
  category: 'fun',
  command: 'frog',
  aliases: ['forg', 'froggers'],
  permissions: [],
  botPermissions: [],
  owner: false,
  exec: async (ctx) => {
    fetch('https://frogs.censor.bot/api/random')
      .then(res => res.json())
      .then(json => {
        ctx.reply(json.url);
      });
  }
} as CommandOptions;
