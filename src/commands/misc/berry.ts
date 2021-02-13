import CommandOptions from '../../structures/CommandOptions';

export default {
  name: 'Berry',
  command: 'stinky',
  permissions: [],
  botPermissions: [],
  exec: async (ctx) => {
    ctx.reply(`<@142408079177285632>`);
  }
} as CommandOptions;
