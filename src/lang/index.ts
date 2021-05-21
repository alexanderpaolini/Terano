import lang from './en-US'

export type LanguageFunction = (...args: any[]) => string

export type Language = {
  [key in Array<keyof typeof lang>[number]]: string | LanguageFunction
}

export type LanguageString = keyof typeof lang
