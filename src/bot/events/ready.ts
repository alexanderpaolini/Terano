import TeranoWorker from '../lib/TeranoWorker'

export default (worker: TeranoWorker): void => {
  worker.on('READY', () => {
    worker.log(`Ready as ${worker.user.username}#${worker.user.discriminator} (${worker.user.id})`)

    setInterval(() => {
      worker.setStatus(worker.status.type as any, worker.status.name, worker.status.type as any, worker.status.url)
    }, 60 * 1000)
  })

  worker.on('SHARD_READY', (shard) => {
    void worker.webhooks.shard(worker.colors.GREEN, `Shard ${shard.id} is ready`)
  })
}
