import { CommandOptions } from 'discord-rose/dist/typings/lib';

export default {
  name: 'Restart',
  usage: 'restart',
  description: 'Restart the bot.',
  category: 'owner',
  command: 'restart',
  aliases: [],
  permissions: [],
  botPermissions: [],
  owner: true,
  exec: async (ctx) => {
    ctx.worker.responses.tiny(ctx, ctx.worker.colors.RED, 'This command currently doesn\'t work');
    return;
  }
} as CommandOptions;
