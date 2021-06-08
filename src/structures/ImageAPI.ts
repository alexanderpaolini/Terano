import fetch from 'node-fetch'
import TeranoWorker from './TeranoWorker'

type methods = 'GET' | 'POST'

export interface CardRequest {
  color: string
  level: string | number
  xp: string | number
  maxxp: string | number
  picture: string
  tag: string
  usertag: string
}

export interface LeaderboardUser {
  pfp: string
  tag: string
  level: string | number
  rank: string | number
}

export class ImageAPI {
  port: number

  constructor (private readonly worker: TeranoWorker) {
    this.port = this.worker.config.image_api.port
  }

  public async _request (method: methods, path: string, body?: any, headers = {}): Promise<Buffer> {
    const req = await fetch(`http://localhost:${this.port}${path}`, {
      method: method,
      body: JSON.stringify(body),
      headers: Object.assign(headers, {
        'Content-Type': 'application/json'
      })
    }).catch(() => null)

    if (!req?.ok) throw new Error('No response from ImageAPI request')

    const buffer = await req.buffer()

    return buffer
  }

  public async card (data: CardRequest): Promise<Buffer> {
    const buffer = await this._request('POST', '/leveling/card', data)
    if (!Buffer.isBuffer(buffer)) throw new Error('non-Buffer returned when Buffer was expected')
    return buffer
  }

  public async leaderboard (data: LeaderboardUser[]): Promise<Buffer> {
    const buffer = await this._request('POST', '/leveling/leaderboard', { data })
    if (!Buffer.isBuffer(buffer)) throw new Error('non-Buffer returned when Buffer was expected')
    return buffer
  }
}
