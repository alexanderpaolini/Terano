import { CommandOptions } from 'discord-rose'

export default {
  name: 'Owner',
  usage: 'owner <mention | id>',
  description: 'Add or remove someone from bot owner.',
  category: 'owner',
  command: 'owner',
  aliases: ['owo'],
  userPerms: [],
  myPerms: [],
  owner: true,
  exec: async (ctx) => {
    // Get the user ID
    const userID = (ctx.args[0] || '').replace(/[<@!>]/g, '')

    // Check if the user exists
    if (!userID) return await ctx.respond('CMD_OWNER_NOUSER', { error: true })
    if (userID === ctx.message.author.id) return await ctx.respond('CMD_OWNER_NOSELF', { error: true })

    // Change the owner to the opposite
    const isOwner = !(await ctx.worker.db.userDB.getOwner(userID))
    await ctx.worker.db.userDB.setOwner(userID, isOwner)

    // Respond with success
    if (isOwner) return await ctx.respond('CMD_OWNER_ADDED', {}, userID)
    else await ctx.respond('CMD_OWNER_REMOVED', {}, userID)
  }
} as CommandOptions
