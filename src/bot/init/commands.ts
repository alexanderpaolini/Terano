import { readdir, stat } from "fs";
import { resolve } from "path";
import TeranoWorker from "../lib/Worker";

export default function loadFunctions(worker: TeranoWorker) {
  function loadCommands(dir: string) {
    readdir(dir, (err, files) => {
      if (err) return console.error(err.toString());
      else {
        files.forEach(file => {
          try {
            stat(resolve(dir, file), (e, stats) => {
              if (e) return console.error(err.toString());
              if (stats.isDirectory()) return loadCommands(`${dir}/${file}`);
              if (stats.isFile() && file.endsWith('.js')) {
                const cmd = require(`${dir}/${file}`).default;
                worker.logger.log('Loaded command:', `${cmd.name}`);
                worker.commands.add(cmd);
              }
            });
          } catch (e) { }
        });
      }
    });
  }
  loadCommands(resolve(__dirname, '../', './commands'));
}
