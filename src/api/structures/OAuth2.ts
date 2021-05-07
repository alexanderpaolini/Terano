import OAuth2DB from '../../database/oauth2'

import Crypto from 'crypto'
import { Application } from 'express'
import qs from 'qs'
import { APIUser, RESTPostOAuth2AccessTokenResult, RESTPostOAuth2AccessTokenURLEncodedData } from 'discord-api-types'
import { OAuth2Doc } from '../../database/types/OAuth2Doc'

export class OAuth2 {
  db = new OAuth2DB()

  constructor (private readonly app: Application) {}

  /**
   * Creates a token
   * @returns {String} New Token
   */
  createToken (): string {
    return Crypto.createHash('sha256')
      .update(Crypto.randomBytes(8).toString('hex'))
      .update(`${Date.now()}`)
      .digest('hex')
  }

  async callback (code: string, host?: string): Promise<{ user: APIUser, doc: OAuth2Doc }> {
    const oauthUser = await this.getBearer(code, host)
    if (!oauthUser) throw new Error('Invalid Code')

    const user = await this.getUser(oauthUser.access_token)
    if (!user) throw new Error('Invalid User')

    const currentUser = await this.db.getAuth(user.id)

    const token = currentUser?.token ?? this.createToken()

    const doc: OAuth2Doc = {
      id: user.id,
      bearer: oauthUser.access_token,
      token,
      avatar: user.avatar as string,
      email: user.email as string
    }

    await this.db.updateAuth(doc)

    return { user, doc }
  }

  async getBearer (code: string, host = 'http://51.81.82.25:3002/callback'): Promise<RESTPostOAuth2AccessTokenResult | false> {
    const user = await this.app.api.request('POST', '/oauth2/token', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: {
        client_id: '647256366280474626',
        client_secret: 'L0zn78ufGzkdSNZ5zW2iut3Eec3kmDUe',
        code,
        grant_type: 'authorization_code',
        redirect_uri: host,
        scope: 'identify email connections guilds'
      } as RESTPostOAuth2AccessTokenURLEncodedData,
      parser: qs.stringify
    })
      .catch(() => false)

    if (!user || !user.access_token) return false

    return user
  }

  public async getUser (token: string): Promise<APIUser | false> {
    const user = await this.app.api.request('GET', '/users/@me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (!user || !user.id) return false

    return user
  }
}
