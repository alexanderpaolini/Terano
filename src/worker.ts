import TeranoWorker from './structures/TeranoWorker'

import frogCommand from './slashCommands/frog'
import pingCommand from './slashCommands/ping'
import rankCommand from './slashCommands/rank'

const worker = new TeranoWorker()

worker.slashCommands
  .add(frogCommand)
  .add(pingCommand)
  .add(rankCommand)
