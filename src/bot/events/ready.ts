import TeranoWorker from '../structures/TeranoWorker'

export default (worker: TeranoWorker): void => {
  worker.on('READY', () => {
    worker.log(`Ready as ${worker.user.username}#${worker.user.discriminator} (${worker.user.id})`)
  })

  worker.on('SHARD_READY', (shard) => {
    void worker.webhooks.shard(worker.colors.GREEN, `Shard ${shard.id} is ready`)
  })
}
