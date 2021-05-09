import TeranoWorker from '../structures/TeranoWorker'

export default (worker: TeranoWorker): void => {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  worker.on('GUILD_CREATE', async (guild) => {
    worker.log(`Joined Guild ${guild.name} (${guild.id})`)

    // Database shit
    await worker.db.guildDB.createGuild(guild.id)

    // Send the Webhook
    await worker.webhooks.guildJoin(guild)
  })

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  worker.on('GUILD_DELETE', async (guild) => {
    worker.log(`Left Guild ${guild.id}`)
    await worker.webhooks.guildLeave(guild)
  })
}
