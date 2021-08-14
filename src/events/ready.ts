import { Worker } from '../structures/Bot'

export default (worker: Worker): void => {
  worker.on('READY', () => {
    worker.log(`Ready as ${worker.user.username}#${worker.user.discriminator} (${worker.user.id})`)
  })

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  worker.on('SHARD_READY', async (shard) => {
    if (process.env.NODE_ENV === 'production') {
      await worker.webhook('shards')
        .title(`Cluster ${worker.comms.id}`)
        .author(`${worker.user.username}#${worker.user.discriminator}`)
        .description(`Shard ${shard.id} is ready`)
        .color(worker.config.colors.GREEN)
        .send()
    }
  })
}
