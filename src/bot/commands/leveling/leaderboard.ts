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
    // Send the loading message
    ctx.send('Loading...').then(async msg => {
      // Get all of the level data and sort it
      const allLevels = await ctx.worker.db.userDB.getAllLevels(ctx.guild.id);
      const data = allLevels.sort((a, b) => {
        if (a.level !== b.level) return (a.level - b.level);
        else return (Number(a.xp) - Number(b.xp));
      });
      data.reverse();

      // Intialize the array that will be posted
      const newDataArr = [];

      // Loop through all users, getting the data from each
      for (const user of data) {

        // Fetch the user, if none just continue
        const userFetch = await ctx.worker.api.members.get(ctx.guild.id, user.userID as Snowflake).catch(() => null as unknown as APIGuildMember);
        if (!userFetch || !userFetch.user) continue;
        
        // Push the user to the array 
        newDataArr.push({
          tag: `${userFetch.user.username}#${userFetch.user.discriminator}`,
          pfp: `${userFetch.user.id}/${userFetch.user.avatar}`,
          level: user.level,
          rank: data.indexOf(user) + 1,
        });
      }

      // Fetch the canvas
      const response = await fetch(`http://localhost:${ctx.worker.opts.port}/leaderboard`, {
        method: 'POST',
        body: JSON.stringify({ data: newDataArr }),
        headers: {
          'Content-Type': 'application/json'
        }
      }).catch(() => null);

      // Respond with an error kekw
      if(!response || !response.ok) throw new Error('Internal Server Error')

      // Get the buffer
      const buffer = await response.buffer();

      // Delete the message and send the file
      // @ts-ignore
      await ctx.worker.api.messages.delete(msg.channel_id, msg.id).catch(() => null);
      ctx.sendFile({ name: 'leaderboard.png', buffer });
      return;
    })
  }
} as CommandOptions;
