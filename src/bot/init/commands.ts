import TeranoWorker from '../lib/TeranoWorker';

import { readdir, stat } from "fs";
import { resolve } from "path";

export default function loadFunctions(worker: TeranoWorker) {
  function loadCommands(dir: string) {
    readdir(dir, (err, files) => {
      if (err) return console.error(err.toString());
      for (const file of files) {
        stat(resolve(dir, file), (e, stats) => {
          if (e) return console.error(e.toString());
          if (stats.isDirectory()) return loadCommands(`${dir}/${file}`);
          if (stats.isFile() && file.endsWith('.js')) {
            let cmd = require(`${dir}/${file}`).default;
            if(!cmd) return;
            worker.commands.add(cmd);
            worker.logger.debug('Loaded command:', `${cmd.name}`);
          }
        });
      }
    });
  }
  loadCommands(resolve(__dirname, '../', './commands'));
}
