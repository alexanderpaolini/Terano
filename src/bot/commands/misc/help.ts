import { CommandOptions } from 'discord-rose'
import { getAvatar } from '../../../utils'

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
    const guildPrefix = await ctx.worker.db.guildDB.getPrefix(ctx.getID)

    const cmd = ctx.args[0]
    const url = getAvatar(ctx.message.author)

    if (cmd) {
      const command = ctx.worker.commands.commands?.find(e => e.command === cmd)
      if (command != null) {
        ctx.embed
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          .author(ctx.message.author.username + ' | ' + ctx.command.name, url)
          .description(`\`Command\`: ${command.command as string}\n\`Usage\`: ${guildPrefix as string}${command.usage as string}\n${(command.aliases != null) ? `\`Aliases\`: ${(command.aliases as string[]).join(', ')}\n` : ''}${(command.permissions != null) ? (command.permissions as string[]).join(', ') + '\n' : ''}\`Description\`: ${command.description as string}`)
          .footer('Developed by MILLION#1321')
          .color(ctx.worker.colors.GREEN)
          .timestamp()
          .send(true)
          .catch(() => { })
      } else {
        await ctx.tinyResponse(ctx.worker.colors.RED, `Command "${cmd as string}" not found.`)
      }
    } else {
      const userIsOwner = await ctx.worker.db.userDB.getOwner(ctx.message.author.id)
      const categories = ctx.worker.commands.commands?.reduce((a, b) => a.includes(b.category) ? a : a.concat([b.category]), [] as string[]) ?? []

      const embed = ctx.embed
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        .author(ctx.message.author.username + ' | ' + ctx.command.name, url)
        .title('Commands')
        .footer('Developed by MILLION#1321')
        .color(ctx.worker.colors.PURPLE)
        .timestamp()

      categories.forEach((cat: string) => {
        if (!cat) return
        if (cat === 'owner' && !userIsOwner) return
        const desc = ctx.worker.commands.commands?.filter(x => x.category === cat).map(cmd_ => `\`${guildPrefix as string}${cmd_.command as string}\`: ${cmd_.description as string}`).join('\n') ?? ''
        embed.field(cat.charAt(0).toUpperCase() + cat.substr(1), desc)
      })

      embed
        .send(true)
        .catch(() => { })
    }
  }
} as CommandOptions
