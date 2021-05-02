interface Language {
  [key: string]: string | LanguageFunction
}

type LanguageFunction = (...args: any[]) => string
