import { CommandOptions } from 'discord-rose/dist/typings/lib';

export default {
  name: 'Help',
  usage: 'help [command]',
  description: 'Get a list of all commands or help on a single one.',
  category: 'misc',
  command: 'help',
  aliases: ['yardım', 'yardim'],
  permissions: [],
  botPermissions: [],
  exec: async (ctx) => {
    const guildPrefix = await ctx.worker.db.guildDB.getPrefix(ctx.guild.id);

    const cmd = ctx.args[0];
    const url = `https://cdn.discordapp.com/avatars/${ctx.message.author.id}/${ctx.message.author.avatar}.png?size=128`;
    
    if (cmd) {
      const command = ctx.worker.commands.commands.find(e => e.command === cmd);
      if (command) {
        ctx.embed
          .author(ctx.message.author.username + ' | ' + ctx.command.name, url)
          .description(`\`Command\`: ${command.command}\n\`Usage\`: ${guildPrefix}${command.usage}\n${command.aliases ? `\`Aliases\`: ${command.aliases.join(', ')}\n` : '' }${command.permissions  ? command.permissions.join(', ') + '\n' : ''}\`Description\`: ${command.description}`)
          .footer('Developed by MILLION#1321')
          .color(ctx.worker.colors.GREEN)
          .timestamp()
          .send(true);
        return;
      } else {
        ctx.worker.responses.tiny(ctx, ctx.worker.colors.RED, `Command "${cmd}" not found.`);
        return;
      }
    } else {
      const userIsOwner = await ctx.worker.db.userDB.getOwner(ctx.message.author.id);
      const categories = ctx.worker.commands.commands.reduce((a, b) => a.includes(b.category) ? a : a.concat([b.category]), [] as string[]);

      const embed = ctx.embed
        .author(ctx.message.author.username + ' | ' + ctx.command.name, url)
        .title('Commands')
        .footer('Developed by MILLION#1321')
        .color(ctx.worker.colors.PURPLE)
        .timestamp();

      categories.forEach((cat: string) => {
        if(!cat) return;
        if (cat === 'owner' && !userIsOwner) return;
        const desc = ctx.worker.commands.commands.filter(x => x.category === cat).map(cmd_ => `\`${guildPrefix}${cmd_.command}\`: ${cmd_.description}`).join('\n');
        embed.field(cat.charAt(0).toUpperCase() + cat.substr(1), desc);
      });

      embed.send(true);
    }
  }
} as CommandOptions;
