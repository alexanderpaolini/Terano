import { CommandContext as ctx } from 'discord-rose/dist/structures/CommandContext';
import TeranoWorker from "../lib/Worker";
import CommandOptions from "./CommandOptions";

export default class CommandContext extends ctx {
  worker: TeranoWorker;
  command: CommandOptions;
}
