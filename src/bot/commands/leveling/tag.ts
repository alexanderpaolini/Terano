import { CommandOptions } from 'discord-rose/dist/typings/lib'

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
    if (!tag.length) return await ctx.worker.responses.normal(ctx, ctx.worker.colors.RED, 'No tag was given.')

    // Make sure people aren't stuid
    if (tag.length > 30) return await ctx.worker.responses.normal(ctx, ctx.worker.colors.RED, 'Tag must be no longer than 20 characters.')

    // Get the user settings
    await ctx.worker.db.userDB.setTag(ctx.message.author.id, tag)

    // Return success
    await ctx.worker.responses.normal(ctx, ctx.worker.colors.GREEN, `Set card tag to: **${tag}**`)
  }
} as CommandOptions
