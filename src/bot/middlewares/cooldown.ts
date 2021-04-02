import CommandContext from '../lib/CommandContext'

import { formatTime } from '../../utils/index'

import Collection from '@discordjs/collection'

interface CooldownObject {
  time: number
  timeout: number
  createdMessage?: boolean
}

export default (): ((ctx: CommandContext) => {}) => {
  const cooldowns: Collection<string, CooldownObject> = new Collection()
  const guildProtecton: string[] = []

  return async (ctx: CommandContext) => {
    if (guildProtecton.filter(e => e === ctx.getID).length > 40) {
      await ctx.worker.webhooks.shard(ctx.worker.colors.RED, `Guild ${ctx.getID} excedeed ratelimit`)
      return false
    }

    guildProtecton.push(ctx.getID)
    setTimeout(() => {
      guildProtecton.splice(guildProtecton.indexOf(ctx.getID), 1)
    }, 5000)

    if (ctx.command.cooldown === undefined) {
      ctx.invokeCooldown = () => {
        throw new Error(`cooldown does not exist on command ${ctx.command.command as string}`)
      }
      return true
    }

    const id = `${ctx.message.author.id as string}-${ctx.getID}-${ctx.command.command as string}`
    const currentCooldown = cooldowns.get(id)

    if (currentCooldown != null) {
      if (currentCooldown.createdMessage) return false
      const timeRemaining = currentCooldown.time - Date.now()

      currentCooldown.createdMessage = true

      setTimeout(() => {
        currentCooldown.createdMessage = false
      }, 2000)

      await ctx.smallResponse(ctx.worker.colors.RED, `You're on cooldown, try again in ${formatTime(timeRemaining)}`)
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
