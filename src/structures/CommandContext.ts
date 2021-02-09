import { CommandContext as ctx } from "../../../discord-rose/dist/structures/CommandContext";
import TeranoWorker from "../lib/Worker";

export default interface CommandContext extends ctx {
  worker: TeranoWorker;
}
