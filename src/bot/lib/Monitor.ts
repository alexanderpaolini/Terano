import { APIMessage } from 'discord-api-types'
import TeranoWorker from './TeranoWorker'

export default class Monitor {
  /**
   * @param worker The worker
   */
  constructor (public worker: TeranoWorker) {
    this.worker.on('MESSAGE_CREATE', this._run.bind(this))
  }

  /**
   * Private function for handling
   * @param data Message object
   */
  private _run (data: APIMessage): void {
    void this.restrictions(data).then(b => {
      if (!b) return
      void this.run(data)
    })
  }

  /**
   * The function to run
   * @param {APIMessage} data Message object
   */
  run (data: APIMessage): Promise<any> | any {

  }

  /**
   * Berry was annoying so I didn't actually comment this
   * @param {APIMessage} data The message object
   */
  async restrictions (data: APIMessage): Promise<boolean | null | undefined> {
    return true
  }
}
