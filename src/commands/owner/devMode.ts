import CommandOptions from '../../structures/CommandOptions';

export default {
  name: 'Dev Mode',
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
