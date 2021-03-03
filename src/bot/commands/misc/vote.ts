import { CommandOptions } from 'discord-rose/dist/typings/lib';

export default {
  name: 'Vote',
  usage: 'vote',
  description: 'Get the link to vote for the bot.',
  category: 'misc',
  command: 'vote',
  aliases: [],
  permissions: [],
  botPermissions: [],
  owner: false,
  exec: async (ctx) => {
    ctx.reply(`https://top.gg/bot/647256366280474626/vote`);
  }
} as CommandOptions;
