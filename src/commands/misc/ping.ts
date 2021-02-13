import CommandOptions from '../../structures/CommandOptions';

export default {
  name: 'Ping',
  command: 'ping',
  permissions: [],
  botPermissions: [],
  exec: async (ctx) => {
    ctx.reply('Pong!').then(message => {
      ctx.worker.api.messages.edit(message.channel_id, message.id, `Pong! ${((Math.random() * 80) + 20).toFixed(2)}ms`);
    });
  }
} as CommandOptions;
