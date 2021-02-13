import { CommandOptions } from 'discord-rose/dist/typings/lib';

export default {
  name: 'Leaderboard',
  usage: 'leaderboard',
  description: 'View the guild leaderboard',
  category: 'leveling',
  command: 'leaderboard',
  aliases: ['lb'],
  permissions: [],
  botPermissions: [],
  exec: async (ctx) => {
    const yes = await ctx.worker.db.userDB.getAllLevel(ctx.guild.id);

    const data = yes.sort((a, b) => {
      if (a.level !== b.level) return (a.level - b.level);
      else return (Number(a.xp) - Number(b.xp));
    });

    data.reverse();

    ctx.send('Loading...').then(async msg => {
      const arr = [];
      for (let i = 0; i < (data.length > 10 ? 10 : data.length); i++) {
        const user = await ctx.worker.api.members.get(ctx.guild.id, data[i].userID as any);
        arr.push({ user: user.nick || user.user.username, level: data[i].level, xp: data[i].xp });
      }
      ctx.worker.api.messages.delete(msg.channel_id, msg.id);
      ctx.worker.responses.tiny(ctx, ctx.worker.colors.GREEN, arr.map(e => `${e.user}: level ${e.level}`).join('\n'));
    });
  }
} as CommandOptions;
