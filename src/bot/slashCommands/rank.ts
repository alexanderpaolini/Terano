import { SlashCommand } from '../structures/SlashHandler'

import { APIApplicationCommandGuildInteraction, Snowflake } from 'discord-api-types'

import fetch from 'node-fetch'
import FormData from 'form-data'

import { getAvatar } from '../../utils'

export default {
  name: 'rank',
  description: 'View your rank',
  options: [
    {
      name: 'user',
      type: 6,
      description: 'The user',
      required: false
    }
  ],
  exec: async (worker, data: APIApplicationCommandGuildInteraction) => {
    const u = data.data.options?.find(e => e.name === 'user')
    if (u && !('value' in u)) return
    const mentionId = u?.value as Snowflake

    const user = (worker.users.get(mentionId ?? '') ??
      worker.members.get(data.guild_id)?.get(mentionId ?? '')?.user ??
      data.member.user)

    await worker.api.request('POST', `/interactions/${data.id}/${data.token}/callback`, {
      body: { type: 5 }
    })

    const levelData = await worker.db.userDB.getLevel(user.id, data.guild_id)
    const settings = await worker.db.userDB.getSettings(user.id) || {} as SettingsDoc

    const usertag = `${user.username}#${user.discriminator}`

    const level = levelData.level
    const xp = levelData.xp
    const maxxp = Math.floor(100 + 5 / 6 * level * (2 * level * level + 27 * level + 91))

    const tag = settings?.level.tag || '─────────────────'
    const picture = settings?.level.picture || getAvatar(user, 'png', 256)
    const color = settings?.level.color || await worker.db.guildDB.getLevelColor(data.guild_id)

    const body = { color, level, xp, maxxp, picture, tag, usertag }

    const response = await fetch(`http://localhost:${String(worker.config.api.port)}/card`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    }).catch(() => null)

    if (!response || !response.ok) {
      await worker.api.request('POST', `/interactions/${data.id}/${data.token}/callback`, {
        body: { type: 4, content: 'Oops! An error has occured. Please try again later' }
      })
      const text = response ? await response.text() : 'No response from POST /rank'
      worker.log(text)
      return
    }

    const buffer = await response.buffer()

    const formData = new FormData()
    formData.append('file', buffer, 'rank.png')

    await worker.api.request('PATCH', `/webhooks/692029320775860245/${data.token}/messages/@original`, {
      body: formData,
      headers: formData.getHeaders(),
      parser: _ => _
    })
  }
} as SlashCommand
