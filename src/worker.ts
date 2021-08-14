import { Worker } from './structures/Bot'
import { CommandContext, SlashCommandContext } from './structures/CommandContext'

import path from 'path'

import permissionsMiddleware from '@discord-rose/permissions-middleware'
import cooldownMiddleware from '@discord-rose/cooldown-middleware'
import flagsMiddleware from '@discord-rose/flags-middleware'
import interactionMiddleware from './middlewares/interaction'
import guildMiddleware from './middlewares/guild'
import ownerMiddleware from './middlewares/owner'
import blacklistMiddleware from './middlewares/blacklist'
import disableBlacklist from './middlewares/disable'

const worker = new Worker()

worker.commands.CommandContext = CommandContext
worker.commands.SlashCommandContext = SlashCommandContext

worker.commands
  .options({
    bots: true,
    caseInsensitiveCommand: true,
    caseInsensitivePrefix: true,
    interactionGuild: worker.config.discord.test_guild,
    default: {},
    mentionPrefix: true
  })
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  .error(async (ctx, error) => {
    if (error.nonFatal) {
      await ctx.respond({
        color: ctx.worker.config.colors.RED,
        text: error.message
      })
    } else {
      await ctx.embed
        .color(ctx.worker.config.colors.RED)
        .title(error.message)
        .send()
    }
  })
  .middleware(blacklistMiddleware())
  .middleware(disableBlacklist())
  .middleware(flagsMiddleware())
  .middleware(interactionMiddleware())
  .middleware(permissionsMiddleware())
  .middleware(cooldownMiddleware())
  .middleware(guildMiddleware())
  .middleware(ownerMiddleware())
  .load(path.resolve(__dirname, 'commands'))
  .prefix(async (m) => m.guild_id ? await worker.db.guilds.getPrefix(m.guild_id) : 't!')
