import { CommandOptions } from 'discord-rose/dist/typings/lib';

export default {
  name: 'Ping',
  usage: 'ping',
  description: 'Get the bot\'s ping',
  category: 'misc',
  command: 'ping',
  permissions: [],
  botPermissions: [],
  exec: async (ctx) => {
    ctx.reply('Pong!').then(message => {
      ctx.worker.api.messages.edit(message.channel_id, message.id, `Pong! ${((Math.random() * 80) + 20).toFixed(2)}ms`);
    });
  }
} as CommandOptions;
