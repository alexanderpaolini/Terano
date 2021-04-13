import { CommandOptions } from 'discord-rose'

export default {
  name: 'Tag',
  usage: 'tag <new tag>',
  description: 'Set your tag for the rank card.',
  category: 'leveling',
  command: 'tag',
  aliases: [],
  permissions: [],
  botPermissions: [],
  exec: async (ctx) => {
    // Get the tag
    const tag = ctx.args.join(' ')

    // Do the checks
    if (!tag.length) return await ctx.respond('CMD_TAG_NONE', { error: true })

    // Make sure people aren't stuid
    if (tag.length > 30) return await ctx.respond('CMD_TAG_LONG', { error: true })

    // Get the user settings
    await ctx.worker.db.userDB.setTag(ctx.message.author.id, tag)

    // Return success
    await ctx.respond('CMD_TAG_UPDATED', {}, tag)
  }
} as CommandOptions
