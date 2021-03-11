import TeranoWorker from '../lib/TeranoWorker';

import { readdir } from "fs";
import { resolve } from "path";

export default function initFunction(worker: TeranoWorker) {
  function loadCommands(dir: string) {
    readdir(dir, { withFileTypes: true }, (err, files) => {
      if (err) return console.error(err.toString());
      for (const file of files) {
        if (file.isDirectory()) {
          loadCommands(`${dir}/${file.name}`);
          continue;
        }
        if (file.isFile() && file.name.endsWith('.js')) {
          let cmd = require(`${dir}/${file.name}`).default;
          if (!cmd) continue;
          worker.commands.add(cmd);
          worker.logger.debug('Loaded command:', cmd.name);
        }
      }
    });
  }
  loadCommands(resolve(__dirname, '../', './commands'));
}
