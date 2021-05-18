import TeranoWorker from '../structures/TeranoWorker'

export default (worker: TeranoWorker): void => {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  worker.on('GUILD_CREATE', async (guild) => {
    worker.log(`Joined Guild ${guild.name} (${guild.id})`)

    // Database shit
    await worker.db.guildDB.createGuild(guild.id)

    // Send the Webhook
    await worker.webhook('guilds')
      .title('Joined Guild')
      .author(`${worker.user.username}#${worker.user.discriminator}`, 'https://cdn.discordapp.com/attachments/813578636162367559/813581068199264296/image0.png')
      .color(worker.colors.GREEN)
      .description(`\`${guild.name}\` (${guild.id})`)
      .footer(`Current Guild Count: ${worker.guilds.size}`)
      .send()
  })

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  worker.on('GUILD_DELETE', async (guild) => {
    worker.log(`Left Guild ${guild.id}`)
    await worker.webhook('guilds')
      .title('Left Guild')
      .author(`${worker.user.username}#${worker.user.discriminator}`, 'https://cdn.discordapp.com/attachments/813578636162367559/813581068199264296/image0.png')
      .color(worker.colors.RED)
      .description(`${guild.id}`)
      .footer(`Current Guild Count: ${worker.guilds.size}`)
      .send()
  })
}
