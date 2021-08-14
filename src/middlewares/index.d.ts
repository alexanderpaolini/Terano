import { CommandContext } from 'discord-rose'

type MiddlewareFunc = (ctx: CommandContext) => boolean | Promise<boolean>
