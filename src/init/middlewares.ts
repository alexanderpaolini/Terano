import { readdir, stat } from "fs";
import { resolve } from "path";
import TeranoWorker from "../lib/Worker";

export default function loadFunctions(worker: TeranoWorker) {
  function loadMiddleware(dir: string) {
    readdir(dir, (err, files) => {
      if (err) return console.error(err.toString());
      else {
        files.forEach(file => {
          try {
            stat(resolve(dir, file), (e, stats) => {
              if (e) return console.error(err.toString());
              if (stats.isDirectory()) return loadMiddleware(`${dir}/${file}`);
              if (stats.isFile() && file.endsWith('.js')) {
                const middleware = require(`${dir}/${file}`).default;
                worker.logger.log('Loaded middleware:', `${file}`);
                worker.commands.middleware(middleware);
              }
            });
          } catch (e) { }
        });
      }
    });
  }
  loadMiddleware(resolve(__dirname, '../', './middlewares'));
}
