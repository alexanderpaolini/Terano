import { bits } from 'discord-rose/dist/utils/Permissions';
import TeranoWorker from './bot/lib/TeranoWorker';

declare module 'discord-rose/dist/typings/lib' {
  interface CommandOptions {
    name: string;
    description: string;
    usage: string;
    category: string;
    permissions?: (keyof typeof bits)[];
    botPermissions?: (keyof typeof bits)[];
    owner?: boolean;
    disabled?: boolean;
  }

  type worker = TeranoWorker;
}
