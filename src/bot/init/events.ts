import { readdir } from "fs";
import { resolve } from "path";
import TeranoWorker from "../lib/Worker";

export default function loadFunctions(worker: TeranoWorker) {
  readdir(resolve(__dirname, '../', './events'), (err, files) => {
    files.forEach(file => {
      if (!file.endsWith('.js')) return;
      try {
        const f = require(resolve(__dirname, '../', `./events/${file}`)).default;
        f(worker);
        return;
      } catch (e) {
        throw new Error(`Error while loading event: ${file}\n${e.toString()}`);
      }
    });
  });
}
