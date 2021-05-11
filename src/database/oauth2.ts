import { Schema, model } from 'mongoose'
import { Cache } from '@jpbberry/cache'

const OAuth2Schema = new Schema({
  id: { type: String, required: true, unique: true },
  token: { type: String, required: true, unique: true },
  bearer: { type: String, required: true, unique: true },
  avatar: { type: String, required: false, default: 'https://cdn.discordapp.com/embed/avatars/1.png' },
  email: { type: String, required: false }
})

const OAuth2Model = model('users.oauth2', OAuth2Schema)

export default class OAuth2DB {
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
