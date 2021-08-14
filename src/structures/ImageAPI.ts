import fetch from 'node-fetch'

import { Worker } from './Bot/Worker'

type methods = 'GET' | 'POST'

interface CardRequest {
  color: string
  level: string | number
  xp: string | number
  maxxp: string | number
  picture: string
  tag: string
  usertag: string
}

interface LeaderboardUser {
  pfp: string
  tag: string
  level: string | number
  rank: string | number
}

export class ImageAPI {
  port: number
  token: string

  constructor (private readonly worker: Worker) {
    this.port = this.worker.config.image_api.port
    this.token = this.worker.config.image_api.token
  }

  public async _request (method: methods, path: string, body?: any, headers = {}): Promise<Buffer> {
    const req = await fetch(`http://localhost:${this.port}${path}`, {
      method: method,
      body: JSON.stringify(body),
      headers: Object.assign(headers, {
        'Content-Type': 'application/json',
        authorization: this.token
      })
    }).catch(() => null)

    if (!req?.ok) throw new Error('No response from ImageAPI request')

    const buffer = await req.buffer()
    if (!Buffer.isBuffer(buffer)) throw new Error('non-Buffer returned when Buffer was expected')

    return buffer
  }

  public async card (data: CardRequest): Promise<Buffer> {
    return await this._request('POST', '/leveling/card', data)
  }

  public async leaderboard (data: LeaderboardUser[]): Promise<Buffer> {
    return await this._request('POST', '/leveling/leaderboard', { data })
  }
}
