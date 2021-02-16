import { CommandOptions } from 'discord-rose/dist/typings/lib';

export default {
  name: 'Dev Mode',
  usage: 'devmode',
  description: 'Toggle Developer-Only mode for the bot.',
  category: 'owner',
  command: 'devmode',
  aliases: [],
  permissions: [],
  botPermissions: [],
  owner: true,
  exec: async (ctx) => {
    if (ctx.worker.devMode) delete ctx.worker.devMode;
    else ctx.worker.devMode = true;
    ctx.worker.responses.tiny(ctx, ctx.worker.colors.ORANGE, `${ctx.worker.devMode ? 'Enabled' : 'Disabled'} developer mode`);
  }
} as CommandOptions;
