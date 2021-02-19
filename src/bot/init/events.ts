import TeranoWorker from '../lib/TeranoWorker';

import { readdir } from "fs";
import { resolve } from 'path';

export default function loadFunctions(worker: TeranoWorker) {
  readdir(resolve(__dirname, '../', './events'), (err, files) => {
    for (const file of files) {
      if (!file.endsWith('.js')) return;
      try {
        const f = require(resolve(__dirname, '../', `./events/${file}`)).default;
        f(worker);
        return;
      } catch (e) {
        throw new Error(`Error while loading event: ${file}\n${e.toString()}`);
      }
    }
  });
}
