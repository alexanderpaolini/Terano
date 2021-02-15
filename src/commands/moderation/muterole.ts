import { CommandOptions } from 'discord-rose/dist/typings/lib';

export default {
  name: 'Mute Role',
  usage: 'muterole <mention | role ID>',
  description: 'Set the mute role.',
  category: 'moderation',
  command: 'muterole',
  aliases: ['mr'],
  permissions: ['manageGuild'],
  botPermissions: [],
  exec: async (ctx) => {
    const roleID = (ctx.args[0] || '').replace(/[<@&>]/g, '');
    const role = ctx.worker.guildRoles.get(ctx.guild.id).get(roleID as any);

    if (role) {
      await ctx.worker.db.guildDB.setMuteRole(ctx.guild.id, role.id);
      ctx.worker.responses.normal(ctx, ctx.worker.colors.GREEN, `Mute Role set to <@&${role.id}>`);
    } else ctx.worker.responses.tiny(ctx, ctx.worker.colors.RED, 'Role was not given.');
    return;
  }
} as CommandOptions;
