import CommandContext from './CommandContext';
import { CommandOptions as options } from 'discord-rose/dist/typings/lib';

interface CommandOptions extends options {
  name: string;
  permissions: string[];
  botPermissions: string[];
  owner?: boolean;
  exec: (ctx: CommandContext) => void | Promise<void>;
  disabled?: boolean;
}

export default CommandOptions;
