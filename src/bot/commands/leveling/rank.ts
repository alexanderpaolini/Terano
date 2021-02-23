import { CommandOptions } from 'discord-rose/dist/typings/lib';

import fetch from 'node-fetch';

import { APIGuildMember, APIUser, Snowflake } from 'discord-api-types';

export default {
  name: 'Rank',
  usage: 'rank [mention]',
  description: 'View your rank in a card format.',
  category: 'leveling',
  command: 'rank',
  aliases: ['card', 'level'],
  permissions: [],
  botPermissions: [],
  cooldown: {
    bucket: 1,
    time: 5_60_1000
  },
  exec: async (ctx) => {
    const user = (await ctx.worker.api.users.get((ctx.args[0] || '').replace(/[<@!>]/g, '') as Snowflake).catch(() => null as unknown as APIUser)) || ctx.message.author;
    const data = await ctx.worker.db.userDB.getLevel(user.id, ctx.guild.id);
    const settings = await ctx.worker.db.userDB.getSettings(user.id) || {} as SettingsDoc;

    const usertag = `${user.username}#${user.discriminator}`;

    const level = data.level;
    const xp = data.xp;
    const maxxp = Math.floor(100 + 5 / 6 * level * (2 * level * level + 27 * level + 91));

    const tag = settings?.level.tag || '─────────────────';
    const picture = settings?.level.picture || `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256`;
    const color = settings?.level.color || await ctx.worker.db.guildDB.getLevelColor(ctx.guild.id);

    const body = { color, level, xp, maxxp, picture, tag, usertag }

    const response = await fetch(`http://localhost:${ctx.worker.opts.port}/card`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const buffer = await response.buffer();

    ctx.sendFile({ name: 'rank.png',buffer: Buffer.from(buffer) })
    return;
  }
} as CommandOptions;
