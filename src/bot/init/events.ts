import TeranoWorker from "../lib/TeranoWorker";

import { readdir } from "fs";
import { resolve } from "path";

export default function initFunction(worker: TeranoWorker) {
  function loadEvents(dir: string) {
    readdir(dir, { withFileTypes: true }, (err, files) => {
      if (err) return console.error(err.toString());
      for (const file of files) {
        if (file.isDirectory()) {
          loadEvents(`${dir}/${file.name}`);
          continue;
        }
        if (file.isFile() && file.name.endsWith('.js')) {
          const event = require(`${dir}/${file.name}`).default;
          event(worker);
          worker.logger.debug('Loaded event:', file.name);
        }
      }
    });
  }
  loadEvents(resolve(__dirname, '../', './events'));
}
