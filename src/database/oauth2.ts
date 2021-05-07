import { Cache } from '@jpbberry/cache'

import OAuth2Model from './models/users/OAuth2'
import { OAuth2Doc } from './types/OAuth2Doc'

export default class VoteDB {
  /**
   * The Settings
   */
  cache: Cache<string, OAuth2Doc> = new Cache(0)

  /**
   * Get a VoteDoc
   * @param id User ID
   */
  async getAuth (token: string): Promise<OAuth2Doc | null> {
    // Check the cache first
    const fromCache = this.cache.get(token)
    if (fromCache !== undefined) return fromCache

    // Then check the DB
    const fromDB: OAuth2Doc = await OAuth2Model.findOne({ token }).lean()
    if (fromDB !== null) {
      // Add it to the cache
      this.cache.set(token, fromDB)
      return fromDB
    }

    // Otherwise create a new one
    return null
  }

  async updateAuth (doc: OAuth2Doc): Promise<void> {
    this.cache.set(doc.id, doc)
    await OAuth2Model.updateOne({ id: doc.id }, doc, { upsert: true })
  }
}
