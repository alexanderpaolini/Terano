import CommandContext from './CommandContext';
import { CommandOptions as options } from 'discord-rose/dist/structures/CommandHandler';

interface CommandOptions extends options {
  name: string,
  permissions: string[],
  botPermissions: string[],
  owner?: boolean,
  exec: (ctx: CommandContext) => void | Promise<void>
}

export default CommandOptions
