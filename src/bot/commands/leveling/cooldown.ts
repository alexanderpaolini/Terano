import { CommandOptions } from 'discord-rose/dist/typings/lib';

export default {
  name: 'XP-Cooldown',
  usage: 'xpcooldown <seconds>',
  description: 'Change the cooldown for getting xp from messages.',
  category: 'leveling',
  command: 'xpcooldown',
  aliases: ['cooldown'],
  permissions: ['manageMessages'],
  botPermissions: [],
  exec: async (ctx) => {
    // Get the cooldowns
    const newCooldown = Number(ctx.args[0]);
    const oldCooldown = await ctx.worker.db.guildDB.getXPCooldown(ctx.guild.id);

    // Make sure its a number
    if (isNaN(newCooldown)) return ctx.worker.responses.normal(ctx, ctx.worker.colors.GREEN, `Current XP-cooldown is **${oldCooldown}s**.`);

    // Check To make sure people aren't stupid
    if (newCooldown < 0) return ctx.worker.responses.normal(ctx, ctx.worker.colors.GREEN, `The XP-cooldown must 0 seconds or greater.`);

    // Update the cooldown in the DB
    await ctx.worker.db.guildDB.setXPCooldown(ctx.guild.id, newCooldown);

    // Respond with success
    ctx.worker.responses.normal(ctx, ctx.worker.colors.GREEN, `Changed XP-cooldown from ${oldCooldown}s to **${newCooldown}s**.`);
    return;
  }
} as CommandOptions;
