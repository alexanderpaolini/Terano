import { CommandContext } from '../structures/CommandContext'

import { formatTime } from '../utils/index'

import Collection from '@discordjs/collection'

interface CooldownObject {
  time: number
  timeout: number
  createdMessage?: boolean
}

export default (): ((ctx: CommandContext) => {}) => {
  const cooldowns = new Collection<string, CooldownObject>()
  const guildProtecton: string[] = []

  return async (ctx: CommandContext) => {
    if (guildProtecton.filter(e => e === ctx.id).length > 40) {
      await ctx.worker.webhook('shards')
        .title(`Guild ${ctx.id} exceeded ratelimits`)
        .send()
      return false
    }

    guildProtecton.push(ctx.id)
    setTimeout(() => {
      guildProtecton.splice(guildProtecton.indexOf(ctx.id), 1)
    }, 5000)

    const id = `${ctx.message.author.id as string}-${ctx.id}-${ctx.command.command}`
    const currentCooldown = cooldowns.get(id)

    if (currentCooldown != null) {
      if (currentCooldown.createdMessage) return false
      const timeRemaining = currentCooldown.time - Date.now()

      currentCooldown.createdMessage = true

      setTimeout(() => {
        currentCooldown.createdMessage = false
      }, 2000)

      await ctx.respond('COOLDOWN', { error: true }, formatTime(timeRemaining))
      return false
    }

    ctx.invokeCooldown = () => {
      cooldowns.set(id, {
        time: Date.now() + Number(ctx.command.cooldown ?? 0),
        timeout: setTimeout(() => {
          cooldowns.delete(id)
        }, ctx.command.cooldown)
      })
    }

    return true
  }
}
