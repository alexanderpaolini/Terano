import TeranoWorker from '../structures/TeranoWorker'

export default (worker: TeranoWorker): void => {
  worker.on('READY', () => {
    worker.log(`Ready as ${worker.user.username}#${worker.user.discriminator} (${worker.user.id})`)
  })

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  worker.on('SHARD_READY', async (shard) => {
    if (worker.prod) {
      await worker.webhook('shards')
        .title(`Cluster ${worker.comms.id}`)
        .author(`${worker.user.username}#${worker.user.discriminator}`)
        .description(`Shard ${shard.id} is ready`)
        .color(worker.colors.GREEN)
        .send()
    }
  })
}
