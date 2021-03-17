import TeranoWorker from '../lib/TeranoWorker'

export default (worker: TeranoWorker): void => {
  worker.on('READY', () => {
    worker.log(`Ready as ${worker.user.username}#${worker.user.id} (${worker.user.id})`)

    setInterval(() => {
      worker.setStatus('playing', 'Minecraft', 'online')
    }, 60 * 1000)
  })

  worker.on('SHARD_READY', (shard) => {
    void worker.webhooks.shard(worker.colors.GREEN, `Shard ${shard.id} is ready`)
  })
}
