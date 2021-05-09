import TeranoWorker from './TeranoWorker'

import eng from '../lang/en-US'
import und from '../lang/undefined'
import esp from '../lang/es-ES'

export default class LanguageHandler {
  langs: Map<string, string> = new Map()
  cache: Map<string, Language> = new Map()

  constructor (private readonly worker: TeranoWorker) {
    this.cache.set('en-US', eng)
    this.cache.set('undefined', und)
    this.cache.set('es-ES', esp)
  }

  async getString (id: string, name: string, ...args: string[]): Promise<string> {
    const guildLang = await this.getLang(id)
    const string = this.cache.get(guildLang)?.[name] ?? 'undefined'
    if (typeof string === 'function') return string(...args)
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
