import TeranoWorker from './TeranoWorker'

import eng from '../lang/en-US'
import und from '../lang/undefined'
import esp from '../lang/es-ES'
import ara from '../lang/ar-AR'
import ita from '../lang/it-IT'

import { Language, LanguageString } from '../lang'

export default class LanguageHandler {
  langs: Map<string, Language> = new Map()

  constructor (private readonly worker: TeranoWorker) {
    // TODO: make this cleaner
    this.langs.set('en-US', eng)
    this.langs.set('undefined', und)
    this.langs.set('es-ES', esp)
    this.langs.set('ar-AR', ara)
    this.langs.set('it-IT', ita)
  }

  async getString (id: string, name: LanguageString, ...args: string | string[] | any): Promise<string> {
    const guildLang = await this.getLang(id)
    const string = this.langs.get(guildLang)?.[name] ?? this.langs.get('en-US')?.[name] ?? 'undefined'
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
