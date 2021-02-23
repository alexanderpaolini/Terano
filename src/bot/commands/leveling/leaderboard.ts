import { APIGuildMember, Snowflake } from 'discord-api-types';
import { CommandOptions } from 'discord-rose/dist/typings/lib';

import fetch from 'node-fetch';

export default {
  name: 'Leaderboard',
  usage: 'leaderboard',
  description: 'View the guild leaderboard',
  category: 'leveling',
  command: 'leaderboard',
  aliases: ['lb'],
  permissions: [],
  botPermissions: [],
  cooldown: {
    bucket: 1,
    time: 5_60_1000
  },
  exec: async (ctx) => {
    ctx.send('Loading...').then(async msg => {
      const allLevels = await ctx.worker.db.userDB.getAllLevels(ctx.guild.id);

      const data = allLevels.sort((a, b) => {
        if (a.level !== b.level) return (a.level - b.level);
        else return (Number(a.xp) - Number(b.xp));
      });

      data.reverse();

      const newDataArr = [];

      for (const user of data) {
        const userFetch = await ctx.worker.api.members.get(ctx.guild.id, user.userID as Snowflake).catch(() => null as unknown as APIGuildMember);
        if (!userFetch || !userFetch.user) break;
        newDataArr.push({
          tag: `${userFetch.user.username}#${userFetch.user.discriminator}`,
          pfp: `${userFetch.user.id}/${userFetch.user.avatar}`,
          level: user.level,
          rank: data.indexOf(user) + 1,
        });
      }

      const response = await fetch(`http://localhost:${ctx.worker.opts.port}/leaderboard`, {
        method: 'POST',
        body: JSON.stringify({ data: newDataArr }),
        headers: {
          'Content-Type': 'application/json'
        }
      }).catch(() => null);

      ctx.worker.webhooks.error('broski')

      if(!response || !response.ok) throw new Error('Internal Server Error')

      const buffer = await response.buffer();

      // @ts-ignore
      await ctx.worker.api.messages.delete(msg.channel_id, msg.id).catch(() => { });
      ctx.sendFile({ name: 'leaderboard.png', buffer });
      return;
    })
  }
} as CommandOptions;
