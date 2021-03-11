import TeranoWorker from "../lib/TeranoWorker";

import { readdir } from "fs";
import { resolve } from "path";

export default function initFunction(worker: TeranoWorker) {
  function loadMiddleware(dir: string) {
    readdir(dir, { withFileTypes: true }, (err, files) => {
      if (err) return console.error(err.toString());
      for (const file of files) {
        if (file.isDirectory()) return loadMiddleware(`${dir}/${file.name}`);
        if (file.isFile() && file.name.endsWith('.js')) {
          const middlewareFunc = require(`${dir}/${file.name}`).default;
          worker.logger.debug('Loaded middleware:', `${file.name}`);
          worker.commands.middleware(middlewareFunc());
        }
      }
    });
  }
  loadMiddleware(resolve(__dirname, '../', './middlewares'));
}
