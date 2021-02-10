import { CommandOptions as options } from 'discord-rose/dist/structures/CommandHandler';
interface CommandOptions extends options {
  name: string,
  permissions: string[],
  botPermissions: string[]
}

export default CommandOptions