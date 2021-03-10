import { APIEmbed, APIGuild, Snowflake } from "discord-api-types";
import TeranoWorker from "./TeranoWorker";
import TeranoOptions, { Webhook } from "./types/TeranoOptions";

export default class Webhooks {
  /**
   * The webhooks, ya know
   */
  webhooks: {
    [key in keyof TeranoOptions['webhooks']]: Webhook
  };

  /**
   * A webhook class for sending webhook messages
   * @param worker The Worker
   */
  constructor(private worker: TeranoWorker) {
    this.webhooks = worker.opts.webhooks;
  }

  /**
   * Send an error webhook
   * @param error The Error to be sent
   */
  error(error: string) {
    if (!this.worker.prod) return;
    const embed: APIEmbed = {
      author: {
        name: `${this.worker.user.username}#${this.worker.user.discriminator}`,
        icon_url: 'https://cdn.discordapp.com/attachments/733471377608147008/813572741230755880/error-handling.jpg'
      },
      color: this.worker.colors.RED,
      description: `\`\`\`xl\n${error}\`\`\``
    };
    return this.worker.comms.sendWebhook(this.webhooks.error.id as Snowflake, this.webhooks.error.token, { embeds: [embed] });
  }

  /**
   * Send a guild join webhook
   * @param guild The Guild from the event
   */
  guildJoin(guild: APIGuild) {
    if (!this.worker.prod) return;
    const embed: APIEmbed = {
      title: `Joined Guild`,
      author: {
        name: `${this.worker.user.username}#${this.worker.user.discriminator}`,
        icon_url: 'https://cdn.discordapp.com/attachments/813578636162367559/813581068199264296/image0.png'
      },
      color: this.worker.colors.GREEN,
      description: `\`${guild.name}\` (${guild.id})`,
      footer: {
        text: `Current Guild Count: ${this.worker.guilds.size}`
      }
    };
    return this.worker.comms.sendWebhook(this.webhooks.guilds.id as Snowflake, this.webhooks.guilds.token, { embeds: [embed] });
  }

  /**
   * Send a guild leave webhook
   * @param guild The Guild from the event
   */
  guildLeave(guild: APIGuild) {
    if (!this.worker.prod) return;
    const embed: APIEmbed = {
      title: `Left Guild`,
      author: {
        name: `${this.worker.user.username}#${this.worker.user.discriminator}`,
        icon_url: 'https://cdn.discordapp.com/attachments/813578636162367559/813581068199264296/image0.png'
      },
      color: this.worker.colors.RED,
      description: `\`${guild.name}\` (${guild.id})`,
      footer: {
        text: `Current Guild Count: ${this.worker.guilds.size}`
      }
    };
    return this.worker.comms.sendWebhook(this.webhooks.guilds.id as Snowflake, this.webhooks.guilds.token, { embeds: [embed] });
  }

  /**
   * Send a shard message
   * @param color The color (corresponding to the type of response)
   * @param message The message to send
   */
  shard(color: number, message: string) {
    if (!this.worker.prod) return;
    const embed: APIEmbed = {
      title: `Cluster ${this.worker.comms.id}`,
      author: {
        name: `${this.worker.user.username}#${this.worker.user.discriminator}`,
        icon_url: 'https://cdn.discordapp.com/attachments/813578636162367559/813581068199264296/image0.png'
      },
      color: color,
      description: message,
    };
    return this.worker.comms.sendWebhook(this.webhooks.shards.id as Snowflake, this.webhooks.shards.token, { embeds: [embed] });
  }

  /**
   * Send a vote event webhook
   * @param user The user ID from the vote event
   */
  votes(u: string) {
    if (!this.worker.prod) return;
    this.worker.api.users.get(u as Snowflake).then(user => {
      const embed: APIEmbed = {
        title: `User Voted`,
        author: {
          name: `${this.worker.user.username}#${this.worker.user.discriminator}`,
          icon_url: 'https://cdn.discordapp.com/attachments/813578636162367559/813585465169018880/image0.png'
        },
        color: this.worker.colors.PURPLE,
        description: `\`${user.username}#${user.discriminator}\` just voted!`,
      };
      return this.worker.comms.sendWebhook(this.webhooks.votes.id as Snowflake, this.webhooks.votes.token, { embeds: [embed] });
    });
  }
}