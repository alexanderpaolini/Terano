import TeranoWorker from "../lib/TeranoWorker";

import { readdir, stat } from "fs";
import { resolve } from "path";

export default function loadFunctions(worker: TeranoWorker) {
  function loadMonitors(dir: string) {
    readdir(dir, (err, files) => {
      if (err) return console.error(err.toString());
      for (const file of files) {
        stat(resolve(dir, file), (e, stats) => {
          if (e) return console.error(e.toString());
          if (stats.isDirectory()) return loadMonitors(`${dir}/${file}`);
          if (stats.isFile() && file.endsWith('.js')) {
            const f = require(`${dir}/${file}`).default;
            new f(worker);
            worker.logger.debug('Loaded Monitor:', file)
          }
        });
      }
    });
  }
  loadMonitors(resolve(__dirname, '../', './monitors'));
}
