/* eslint-disable @typescript-eslint/no-misused-promises */
import { CommandOptions } from 'discord-rose'
import { getAvatar } from '../../../utils'
import { LanguageString } from '../../lang'

export default {
  command: 'help',
  category: 'misc',
  aliases: ['yardım', 'yardim'],
  locale: 'HELP',
  exec: async (ctx) => {
    const guildPrefix = await ctx.worker.db.guildDB.getPrefix(ctx.getID)

    const cmd = ctx.args[0]
    const url = getAvatar(ctx.message.author)

    if (cmd) {
      const command = ctx.worker.commands.commands?.find(e => e.command === cmd)
      if (command != null) {
        const l1 = await ctx.lang('CMD_HELP_C', String(command.command))
        const l2 = await ctx.lang('CMD_HELP_A', command.aliases as any as string)
        const l3 = await ctx.lang('CMD_HELP_U', await ctx.lang(`CMD_${command.locale}_USAGE` as LanguageString))
        const l4 = await ctx.lang('CMD_HELP_D', await ctx.lang(`CMD_${command.locale}_DESCRIPTION` as LanguageString))
        ctx.embed
          .author(ctx.message.author.username + ' | ' + await ctx.lang('CMD_HELP_NAME'), url)
          .description(`${l1}\n${l2}\n${l3}\n${l4}`)
          .footer(await ctx.lang('DEVELOPED_BY'))
          .color(ctx.worker.colors.GREEN)
          .timestamp()
          .send(true)
          .catch(() => { })
      } else {
        await ctx.respond('CMD_HELP_NOCMD', { error: true }, cmd)
      }
    } else {
      const userIsOwner = await ctx.worker.db.userDB.getOwner(ctx.message.author.id)
      const categories = ctx.worker.commands.commands?.reduce((a, b) => a.includes(b.category) ? a : a.concat([b.category]), [] as string[]) ?? []

      const embed = ctx.embed
        .author(ctx.message.author.username + ' | ' + await ctx.lang('CMD_HELP_NAME'), url)
        .title(await ctx.lang('CMD_HELP_COMMANDS'))
        .footer(await ctx.lang('DEVELOPED_BY'))
        .color(ctx.worker.colors.PURPLE)
        .timestamp()

      for (const cat of categories) {
        if (!cat) return
        if (cat === 'owner' && !userIsOwner) return
        let desc = ''
        for (const cmd_ of ctx.worker.commands.commands?.filter(x => x.category === cat).map(e => e) ?? []) {
          const cmdDesc = await ctx.lang(`CMD_${cmd_.locale}_DESCRIPTION` as LanguageString)
          desc += `\`${guildPrefix}${cmd_.command as string}\`: ${cmdDesc}\n`
        }
        embed.field(await ctx.lang(`CAT_${cat.toUpperCase()}` as LanguageString), desc)
      }

      embed
        .send(true)
        .catch(() => { })
    }
  }
} as CommandOptions
