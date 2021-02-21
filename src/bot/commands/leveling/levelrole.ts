import { Snowflake } from 'discord-api-types';
import { CommandOptions } from 'discord-rose/dist/typings/lib';

export default {
  name: 'Level Role',
  usage: 'levelrole <level> <ID | Role Mention>',
  description: 'Add a level to the autorole',
  category: 'leveling',
  command: 'levelrole',
  aliases: ['lr'],
  permissions: ['manageRoles'],
  botPermissions: [],
  exec: async (ctx) => {
    // Get the level and do some good checks
    const level = parseInt(ctx.args[0]);
    if (!level) return ctx.worker.responses.normal(ctx, ctx.worker.colors.RED, 'No level was given.');
    if (isNaN(level)) return ctx.worker.responses.normal(ctx, ctx.worker.colors.RED, 'The level must be a number');
    if (level < 1) return ctx.worker.responses.normal(ctx, ctx.worker.colors.RED, `The level must be greater than 0`);

    // Get the role
    if(!ctx.args[1]) return ctx.worker.responses.normal(ctx, ctx.worker.colors.RED, 'No role was give.');
    const roleID = ctx.args[1].replace(/<@&>/g, '');
    if (!roleID) return ctx.worker.responses.normal(ctx, ctx.worker.colors.RED, 'No role was given.');

    // Check if it exists
    const role = ctx.worker.guildRoles.get(ctx.guild.id)?.get(roleID as Snowflake);
    if (!role) return ctx.worker.responses.normal(ctx, ctx.worker.colors.RED, 'Role not found.');
    
    // This shit sucks ngl
    const botHighest = ctx.worker.guildRoles.get(ctx.guild.id)?.reduce((a, role) => {
      if(!a) return role.position;
      if(a > role.position) return a;
      else return role.position;
    }, 0) || 0;
    if(role.position >= botHighest) return ctx.worker.responses.normal(ctx, ctx.worker.colors.RED, 'I cannot give members this role.')

    // Actually do the shit, ya know
    await ctx.worker.db.guildDB.addLevelRole(ctx.guild.id, role.id, level);

    // Respond with success
    ctx.worker.responses.normal(ctx, ctx.worker.colors.GREEN, `Members will now get the role <@&${role.id}> when they are level \`${level}\``);
    return;
  }
} as CommandOptions;
