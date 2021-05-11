import { CommandOptions } from 'discord-rose'

import colors from '../../../utils/colors'

export default {
  command: 'color',
  category: 'leveling',
  aliases: ['colour'],
  locale: 'COLOR',
  exec: async (ctx) => {
    if (!ctx.flags.custom) {
      // Get the name of the color
      const colorName = ctx.args.join('').toLowerCase()
      if (!colorName) return await ctx.respond('CMD_COLOR_NONE', { error: true })

      // Get the color from the JSON
      const color = colors[colorName]
      if (!color) return await ctx.respond('CMD_COLOR_UNKNOWN', { error: true }, ctx.args.join(' '))

      // Get the user settings
      await ctx.worker.db.userDB.setColor(ctx.message.author.id, color)

      // Respond with success
      await ctx.respond('CMD_COLOR_UPDATED', { color: Number('0x' + color.slice(1)) }, color, colorName)
    } else {
      // If custom flag get the color as a string
      const color = String(ctx.flags.custom)

      // Update the string
      await ctx.worker.db.userDB.setColor(ctx.message.author.id, color)

      // Return with success ezpz
      await ctx.respond('CMD_COLOR_UPDATEDCUSTOM', { color: Number('0x' + color.replace('#', '')) }, color)
    }
  }
} as CommandOptions
