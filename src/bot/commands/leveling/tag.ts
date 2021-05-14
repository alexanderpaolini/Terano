import { CommandOptions } from 'discord-rose'

export default {
  command: 'tag',
  category: 'leveling',
  locale: 'TAG',
  exec: async (ctx) => {
    // Get the tag
    const tag = ctx.args.join(' ')

    // Do the checks
    if (!tag.length) {
      await ctx.respond('CMD_TAG_NONE', { error: true })
      return false
    }

    // Make sure people aren't stuid
    if (tag.length > 30) {
      await ctx.respond('CMD_TAG_LONG', { error: true })
      return false
    }

    // Get the user settings
    await ctx.worker.db.userDB.setTag(ctx.message.author.id, tag)

    // Return success
    await ctx.respond('CMD_TAG_UPDATED', {}, tag)
    return true
  }
} as CommandOptions<boolean>
