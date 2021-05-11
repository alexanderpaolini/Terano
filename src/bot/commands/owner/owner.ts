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
    if (!userID) return await ctx.error('No user was given, please mention a user.')
    if (userID === ctx.message.author.id) return await ctx.error('You cannot remove yourself from owner.')

    // Change the owner to the opposite
    const isOwner = await ctx.worker.db.userDB.getOwner(userID)
    await ctx.worker.db.userDB.setOwner(userID, !isOwner)

    // Respond with success
    await ctx.tinyResponse(ctx.worker.colors.ORANGE, `<@${userID}> is ${isOwner ? 'no longer bot owner' : 'now bot owner'}.`)
  }
} as CommandOptions
