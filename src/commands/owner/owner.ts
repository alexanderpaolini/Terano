import { CommandOptions } from '../../structures/CommandHandler'

export default {
  command: 'owner',
  category: 'owner',
  aliases: ['owo'],
  locale: 'OWNER',
  owner: true,
  exec: async (ctx) => {
    // Get the user ID
    const userID = (ctx.args[0] || '').replace(/[<@!>]/g, '')

    // Check if the user exists
    if (!userID) {
      await ctx.respond('CMD_OWNER_NOUSER', { error: true })
      return false
    }
    if (userID === ctx.message.author.id) {
      await ctx.respond('CMD_OWNER_NOSELF', { error: true })
      return false
    }

    // Change the owner to the opposite
    const isOwner = !(await ctx.worker.db.userDB.getOwner(userID))
    await ctx.worker.db.userDB.setOwner(userID, isOwner)

    // Respond with success
    if (isOwner) await ctx.respond('CMD_OWNER_ADDED', {}, userID)
    else await ctx.respond('CMD_OWNER_REMOVED', {}, userID)
    return true
  }
} as CommandOptions<boolean>
