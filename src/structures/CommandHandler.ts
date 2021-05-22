import { APIMessage, MessageType } from 'discord-api-types'
import { CommandType } from 'discord-rose/dist/typings/lib'

import fs from 'fs'
import path from 'path'
import { EventEmitter } from '@jpbberry/typed-emitter'
import Collection from '@discordjs/collection'

import Worker from './TeranoWorker'
import { CommandContext } from './CommandContext'

import { LanguageString } from '../lang'

import { getAvatar } from '../utils'

export type MiddlewareFunction = (ctx: CommandContext) => boolean | Promise<boolean>

/**
 * Error in command
 */
export class CommandError extends Error {
  nonFatal?: boolean
}

/**
 * Command Events
 */
export interface HandlerEvents {
  COMMAND_RAN: [CommandContext, any]
  MIDDLEWARE_ERROR: [CommandContext, CommandError]
  COMMAND_ERROR: [CommandContext, CommandError]
  NO_COMMAND: [APIMessage]
}

/**
 * Utility in charge of holding and running commands
 */
export class CommandHandler extends EventEmitter<HandlerEvents> {
  private _options: CommandHandlerOptions = {
    bots: true,
    caseInsensitiveCommand: true,
    caseInsensitivePrefix: true,
    default: {
      category: 'Misc',
      cooldown: 3e3
    },
    mentionPrefix: true
  }

  /**
   * The command handler middlewares
   */
  public middlewares: MiddlewareFunction[] = []
  /**
   * The command handler commnads
   */
  public commands = new Collection<CommandType, CommandOptions>()

  /**
   * Create's new Command Handler
   * @param worker Worker
   */
  constructor (private readonly worker: Worker) {
    super()

    this.worker.on('MESSAGE_CREATE', (data) => {
      this._exec(data).catch(() => { })
    })
  }

  /**
   * The function which returns the prefix
   * @param msg Mesasge
   */
  public prefixFunction: ((message: APIMessage) => Promise<string | string[]> | string | string[]) = async (msg: any) => {
    const id = msg.guild_id ?? 'dm'
    return await this.worker.db.guildDB.getPrefix(id)
  }

  /**
   * The function which handles the error
   * @param ctx Command Context
   * @param err The Error
   */
  public errorFunction = async (ctx: CommandContext, err: CommandError): Promise<void> => {
    const embed = ctx.embed

    if (err.nonFatal) {
      embed
        .author((ctx.message.member?.nick ?? ctx.message.author.username) + ` | ${String(await ctx.lang(`CMD_${ctx.command.locale}_NAME` as LanguageString) ?? ctx.command.command)}`,
          getAvatar(ctx.message.author))
        .description(err.message)
    } else {
      console.error(err)

      embed
        .author('Error: ' + err.message, getAvatar(ctx.message.author))
    }

    embed
      .color(ctx.worker.colors.RED)
      .send(true)
      .then(() => { })
      .catch(() => { })
  }

  /**
   * Load a directory of CommandOptions commands (will also load sub-folders)
   * @param directory Absolute directory full of command files
   */
  load (directory: string): this {
    if (!path.isAbsolute(directory)) directory = path.resolve(process.cwd(), directory)

    const files = fs.readdirSync(directory, { withFileTypes: true })

    files.forEach(file => {
      if (file.isDirectory()) return this.load(path.resolve(directory, file.name))

      if (!file.name.endsWith('.js')) return

      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete require.cache[require.resolve(path.resolve(directory, file.name))]

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      let command = require(path.resolve(directory, file.name))

      if (!command) return

      if (command.default) command = command.default

      this.add(command)
    })

    return this
  }

  /**
   * Sets Command Handler options
   * @param opts Options
   * @returns this
   */
  options (opts: CommandHandlerOptions): this {
    this._options = {
      ...this._options,
      ...opts
    }

    return this
  }

  /**
   * Adds a global middleware function
   * @param fn Middleware function
   * @returns this
   */
  middleware (fn: MiddlewareFunction): this {
    this.middlewares.push(fn)

    return this
  }

  /**
   * Adds a command to the command handler
   * @param command Command data, be sure to add exec() and command:
   * @example
   * worker.commands
   *   .add({
   *     command: 'hello',
   *     exec: (ctx) => {
   *       ctx.reply('World!')
   *     }
   *   })
   * @returns this
   */
  add (command: CommandOptions): this {
    this.commands.set(command.command, {
      ...this._options.default,
      ...command
    })

    return this
  }

  private _test (command: string, cmd: CommandType): boolean {
    if (this._options.caseInsensitiveCommand) command = command.toLowerCase()
    if (typeof cmd === 'string') return command === cmd
    if (cmd instanceof RegExp) return !!command.match(cmd)

    return false
  }

  /**
   * Gets a command from registry
   * @param command Command name to fetch
   * @returns Command
   */
  public find (command: string): CommandOptions | undefined {
    return this.commands?.find(x => !!(this._test(command, x.command) || x.aliases?.some(alias => this._test(command, alias))))
  }

  private async _exec (data: APIMessage): Promise<void> {
    if (!data.content || (!this._options.bots && data.author.bot)) return
    if (![MessageType.DEFAULT, MessageType.REPLY].includes(data.type)) return

    let prefix: string | string[] | undefined = ''
    if (this.prefixFunction) {
      prefix = await this.prefixFunction(data)
      if (!Array.isArray(prefix)) prefix = [prefix]

      if (this._options.mentionPrefix) prefix.push(`<@${this.worker.user.id}>`, `<@!${this.worker.user.id}>`)

      const content = this._options.caseInsensitivePrefix ? data.content.toLowerCase() : data.content

      prefix = prefix.find(x => content.startsWith(x))
      if (!prefix) return
    }

    const args = data.content.slice(prefix ? prefix.length : 0).split(/\s/)
    if (args[0] === '') {
      args.shift()

      prefix += ' '
    }

    const command = args.shift() ?? ''

    const cmd = this.find(command)
    if (!cmd) {
      this.emit('NO_COMMAND', data)
      return
    }

    const ctx = new CommandContext({
      worker: this.worker,
      message: data,
      command: cmd,
      prefix,
      ran: command,
      args: args
    })

    try {
      for (const midFn of this.middlewares) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-boolean-literal-compare
          if (await midFn(ctx) !== true) return
        } catch (err) {
          err.nonFatal = true

          throw err
        }
      }

      try {
        const response = await cmd.exec(ctx)

        try {
          void cmd.onRun?.(ctx, response)
        } catch (e) { }

        this.emit('COMMAND_RAN', ctx, response)
      } catch (err_) {
        this.emit('COMMAND_ERROR', ctx, err_)

        try {
          void cmd.onError?.(ctx, err_)
        } catch (e) { }

        await this.errorFunction(ctx, err_)
      }
    } catch (err) {
      this.emit('MIDDLEWARE_ERROR', ctx, err)

      await this.errorFunction(ctx, err)
    }
  }
}

/**
 * The options
 */
export interface CommandHandlerOptions {
  /**
   * Default CommandOptions ('command', 'exec', and 'aliases' cannot be defaulted)
   */
  default?: Partial<Pick<CommandOptions, Exclude<keyof CommandOptions, 'command' | 'exec' | 'aliases'>>>
  /**
   * Allow commands from bots
   * @default false
   */
  bots?: boolean
  /**
   * Whether or not to respond to your bot's @Mention
   * @default true
   */
  mentionPrefix?: boolean
  /**
   * Whether or not the prefix is case insensitive
   * @default true
   */
  caseInsensitivePrefix?: boolean
  /**
   * Whether or not the command is case insensitive
   * @default true
   */
  caseInsensitiveCommand?: boolean
}

/**
 * The Command
 */
export interface CommandOptions<K = any> {
  /**
   * Code ran when the command finishes
   */
  onRun?: (ctx: CommandContext, response: K) => any | Promise<any>
  /**
   * Code ran when the command errors
   */
  onError?: (ctx: CommandContext, response: CommandError) => any | Promise<any>
  /**
   * The Command's code
   */
  exec: (ctx: CommandContext) => K | Promise<K>
  /**
   * Aliases the command can be called by
   */
  aliases?: string[]
  /**
   * The command name
   */
  command: string
  /**
   * The locale (Language support)
   */
  locale: string
  /**
   * The category of the command
   */
  category: string
  /**
   * If the command is locked to owners
   */
  owner?: boolean
  /**
   * If the command is disabled
   */
  disabled?: boolean
  /**
   * The cooldown
   * @default 3
   */
  cooldown?: number
}
