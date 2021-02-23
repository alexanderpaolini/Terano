import { CommandOptions } from 'discord-rose/dist/typings/lib';

export default {
  name: 'Berry',
  usage: 'stinky',
  description: 'Berry is stinky.',
  category: 'misc',
  command: 'stinky',
  aliases: ['jpbbitch'],
  permissions: [],
  botPermissions: [],
  owner: false,
  exec: async (ctx) => {
    ctx.reply(`<@142408079177285632>`);
  }
} as CommandOptions;
