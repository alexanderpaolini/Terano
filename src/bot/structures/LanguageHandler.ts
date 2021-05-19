import TeranoWorker from './TeranoWorker'

import English from '../lang/en-US'
import Undefined from '../lang/undefined'
import Spanish from '../lang/es-ES'
// import Arabic from '../lang/ar-AR'
// import Italian from '../lang/it-IT'
import British from '../lang/en-GB'
import Malay from '../lang/ms-MY'

import { Language, LanguageString } from '../lang'

export class LanguageHandler {
  langs: Map<string, Language> = new Map()

  constructor (private readonly worker: TeranoWorker) {
    this.langs.set('en-US', English)
    this.langs.set('undefined', Undefined)
    this.langs.set('es-ES', Spanish)
    // this.langs.set('ar-AR', Arabic)
    // this.langs.set('it-IT', Italian)
    this.langs.set('en-GB', British)
    this.langs.set('ms-MY', Malay)
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

export { Language, LanguageString }
