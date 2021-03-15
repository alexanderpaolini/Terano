import TeranoWorker from "../lib/TeranoWorker";

import { readdir } from "fs";
import { resolve } from "path";

export default function initFunction(worker: TeranoWorker) {
  function loadEvents(dir: string) {
    readdir(dir, { withFileTypes: true }, (err, files) => {
      if (err) return worker.log(err.toString());
      for (const file of files) {
        if (file.isDirectory()) {
          loadEvents(`${dir}/${file.name}`);
          continue;
        }
        if (file.isFile() && file.name.endsWith('.js')) {
          const event = require(`${dir}/${file.name}`).default;
          event(worker);
        }
      }
    });
  }
  loadEvents(resolve(__dirname, '../', './events'));
  worker.log('Loaded Events');
}
