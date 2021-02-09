import CommandContext from '../../structures/CommandContext';

export default {
  command: 'ping',
  userPerms: [''],
  botPerms: [''],
  exec: async (ctx: CommandContext) => {
    ctx.reply('Pong!').then(message => {
      ctx.worker.api.messages.edit(message.channel_id, message.id, `Pong! ${((Math.random() * 80) + 20).toFixed(2)}ms`)
    });
  }
}
