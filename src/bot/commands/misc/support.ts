import { CommandOptions } from 'discord-rose/dist/typings/lib';

export default {
  name: 'Support',
  usage: 'support',
  description: 'Get the link to the bot\'s support server.',
  category: 'misc',
  command: 'support',
  aliases: [],
  permissions: [],
  botPermissions: [],
  owner: false,
  exec: async (ctx) => {
    ctx.reply(`https://discord.gg/YzWsDrs2kw`);
  }
} as CommandOptions;
