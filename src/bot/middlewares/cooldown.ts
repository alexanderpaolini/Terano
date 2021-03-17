import { CommandContext } from 'discord-rose/dist/typings/lib'

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
    if (guildProtecton.filter(e => e === ctx.guild.id).length > 40) {
      await ctx.worker.webhooks.shard(ctx.worker.colors.RED, `Guild ${ctx.guild.id} excedeed ratelimit`)
      return false
    }

    guildProtecton.push(ctx.guild.id)
    setTimeout(() => {
      guildProtecton.splice(guildProtecton.indexOf(ctx.guild.id), 1)
    }, 5000)

    if (ctx.command.cooldown === undefined) {
      ctx.invokeCooldown = () => {
        throw new Error(`cooldown does not exist on command ${ctx.command.command as string}`)
      }
      return true
    }

    const id = `${ctx.message.author.id}-${ctx.guild.id}-${ctx.command.command as string}`
    const currentCooldown = cooldowns.get(id)

    if (currentCooldown != null) {
      if (currentCooldown.createdMessage) return false
      const timeRemaining = currentCooldown.time - Date.now()

      currentCooldown.createdMessage = true

      setTimeout(() => {
        currentCooldown.createdMessage = false
      }, 2000)

      await ctx.worker.responses.small(ctx, ctx.worker.colors.RED, `You're on cooldown, try again in ${formatTime(timeRemaining)}`)
      return false
    }

    ctx.invokeCooldown = () => {
      cooldowns.set(id, {
        time: Date.now() + (ctx.command.cooldown ?? 0),
        timeout: setTimeout(() => {
          cooldowns.delete(id)
        }, ctx.command.cooldown)
      })
    }

    return true
  }
}
