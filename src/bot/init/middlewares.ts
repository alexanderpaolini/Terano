import TeranoWorker from "../lib/TeranoWorker";

import { readdir, stat } from "fs";
import { resolve } from "path";

export default function loadFunctions(worker: TeranoWorker) {
  function loadMiddleware(dir: string) {
    readdir(dir, (err, files) => {
      if (err) return console.error(err.toString());
      for (const file of files) {
        stat(resolve(dir, file), (e, stats) => {
          if (e) return console.error(e.toString());
          if (stats.isDirectory()) return loadMiddleware(`${dir}/${file}`);
          if (stats.isFile() && file.endsWith('.js')) {
            const middleware = require(`${dir}/${file}`).default;
            worker.logger.debug('Loaded middleware:', `${file}`);
            worker.commands.middleware(middleware);
          }
        });
      }
    });
  }
  loadMiddleware(resolve(__dirname, '../', './middlewares'));
}
