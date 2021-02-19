import { APIMessage } from "discord-api-types";
import TeranoWorker from "./TeranoWorker";

export default class Monitor {
  constructor(public worker: TeranoWorker) {
    this.worker.on('MESSAGE_CREATE', this._run.bind(this))
  }

  _run(data: APIMessage) {
    this.restrictions(data).then(b => {
      if(!b) return;
      this.run(data);
    });
  }

  run(data: APIMessage): Promise<any> | any {
    return;
  }

  async restrictions(data: APIMessage): Promise<boolean | null | undefined> {
    return true;
  }
}
