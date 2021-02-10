import CommandContext from '../../structures/CommandContext';

export default {
  command: 'stinky',
  userPerms: [''],
  botPerms: [''],
  exec: async (ctx: CommandContext) => {
    ctx.reply(`<@142408079177285632>`);
  }
}
