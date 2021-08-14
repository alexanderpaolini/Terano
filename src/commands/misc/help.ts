import { ApplicationCommandOptionType } from 'discord-api-types'

import { CommandOptions } from 'discord-rose'

export default <CommandOptions>{
  name: 'Help',
  command: 'help',
  category: 'Misc',
  usage: '<command: String>',
  interaction: {
    name: 'help',
    description: 'View the bot\'s help menu',
    options: [
      {
        name: 'command',
        description: 'The command you want info about',
        type: ApplicationCommandOptionType.String
      }
    ]
  },
  myPerms: ['embed'],
  exec: async (ctx) => {
    const cmd = ctx.args.shift() ?? ctx.options.command

    const isUserOwner = await ctx.worker.db.users.getOwner(ctx.author.id)

    if (cmd) {
      const command = ctx.worker.commands.find(cmd) ?? ctx.worker.commands.commands!.find(c => c.interaction?.name === cmd)

      if (command && !(command.ownerOnly && !isUserOwner)) {
        let desc = `**Name**: \`${`${command.name} (${command.command as string})`}\`\n`

        if (command.description) { desc += `**Description**: ${command.description}\n` }

        if (command.aliases?.length) { desc += `**Aliases**: ${command.aliases.map(e => `\`${e as string}\``).join(', ')}\n` }

        if (command.usage) { desc += `**Usage**: \`${ctx.prefix ?? ''}${command.command as string} ${command.usage}\`\n` }

        await ctx.embed
          .author(
            'Help Menu',
            ctx.worker.utils.getAvatar(ctx.me.user!)
          )
          .description(desc)
          .color(ctx.worker.config.colors.PURPLE)
          .footer(
            `${ctx.author.username}#${ctx.author.discriminator} | ${ctx.command.name}`,
            ctx.worker.utils.getAvatar(ctx.author)
          )
          .send()
        return
      }

      await ctx.error(`Command "${cmd as string}" doesn't exist :(`)
      return
    }

    const categories = ctx.worker.commands.commands!
      .reduce<string[]>((a, c) => a.includes(c.category) ? a : a.concat([c.category]), [])
      .filter(e => isUserOwner || e !== 'Owner')

    const embed = ctx.embed
      .author(
        'Help Menu',
        ctx.worker.utils.getAvatar(ctx.me.user!)
      )
      .footer(
        `${ctx.author.username}#${ctx.author.discriminator} | ${ctx.command.name}`,
        ctx.worker.utils.getAvatar(ctx.author)
      )
      .color(ctx.worker.config.colors.PURPLE)

    for (const cat of categories) {
      if (!cat) continue

      embed.field(
        cat,
        ctx.worker.commands.commands!
          .filter(c => c.category === cat)
          .map(
            c => `\`${(ctx.isInteraction ? c.interaction?.name ?? c.command : c.command) as string}\`: ${(c.interaction?.description ?? c.description)}\n`
          )
          .join('')
      )
    }

    await embed.send()
  }
}
