import TeranoWorker from "../lib/TeranoWorker";

import { readdir } from "fs";
import { resolve } from "path";

export default function initFunction(worker: TeranoWorker) {
  function loadMonitors(dir: string) {
    readdir(dir, { withFileTypes: true }, (err, files) => {
      if (err) return console.error(err.toString());
      for (const file of files) {
        if (file.isDirectory()) return loadMonitors(`${dir}/${file.name}`);
        if (file.isFile() && file.name.endsWith('.js')) {
          const f = require(`${dir}/${file.name}`).default;
          new f(worker);
          worker.logger.debug('Loaded Monitor:', file.name);
        }
      }
    });
  }
  loadMonitors(resolve(__dirname, '../', './monitors'));
}
