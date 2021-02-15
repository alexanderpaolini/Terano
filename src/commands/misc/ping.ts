import { CommandOptions } from 'discord-rose/dist/typings/lib';

export default {
  name: 'Ping',
  usage: 'ping',
  description: 'Get the bot\'s ping',
  category: 'misc',
  command: 'ping',
  aliases: ['pong'],
  permissions: [],
  botPermissions: [],
  exec: async (ctx) => {
    const time = Date.now();
    const url = `https://cdn.discordapp.com/avatars/${ctx.message.author.id}/${ctx.message.author.avatar}.png?size=128`;
    ctx.embed
      .author('Pong!', url)
      .color(ctx.worker.colors.PURPLE)
      .send(true)
      .then(msg => {
        msg.embeds[0].author.name += ` (${(Date.now() - time).toFixed(2)}ms)`;
        ctx.worker.api.messages.edit(msg.channel_id, msg.id, { embed: msg.embeds[0] });
      });
  }
} as CommandOptions;
