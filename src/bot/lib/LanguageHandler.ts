import TeranoWorker from './TeranoWorker'

import english from '../lang/en-US.json'
import und from '../lang/undefined.json'

export default class LanguageHandler {
  langs: Map<string, string> = new Map()
  cache: Map<string, { [key: string]: string }> = new Map()

  constructor (private readonly worker: TeranoWorker) {
    this.cache.set('en-US', english)
    this.cache.set('undefined', und)
  }

  async getString (id: string, name: string, ...args: string[]): Promise<string> {
    const guildLang = await this.getLang(id)
    const string = this.cache.get(guildLang)?.[name] ?? 'undefined'
    return this.formatString(string, ...args)
  }

  formatString (string: string, ...args: string[]): string {
    return string.replace(/{(\d+)}/g, function (match, number) {
      return typeof args[number] !== 'undefined' ? args[number] : match
    })
  }

  async getLang (id: string): Promise<string> {
    const guildLang = await this.worker.db.guildDB.getLang(id)
    return guildLang ?? 'en-US'
  }
}
