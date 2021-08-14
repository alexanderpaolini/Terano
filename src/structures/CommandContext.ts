import * as Rose from 'discord-rose'

import { APIActionRowComponent, APIMessage } from 'discord-api-types'

import FormData from 'form-data'

export interface ResponseOptions {
  text: string
  color: number
  removeEmbed?: boolean
  components?: APIActionRowComponent[]
}

export class CommandContext extends Rose.CommandContext {
  async respond (options: ResponseOptions): Promise<APIMessage> {
    // @ts-expect-error | Flags does exist but ts is stupid
    if (this.flags.noembed || options.removeEmbed || !this.myPerms('embed')) {
      return await this.reply({
        content: options.text
      })
    }

    return await this.reply({
      embeds: [
        this.embed
          .description(options.text)
          .author(
            `${this.author.username}#${this.author.discriminator} | ${(this.command.name ?? (this.command.command as string)
              .split(' ').map(c => c.charAt(0).toUpperCase() + c.slice(1))
              .join(' '))}`,
            this.worker.utils.getAvatar(this.author)
          )
          .color(options.color ?? 13808780)
          .render()
      ],
      components: options.components
    })
  }
}

export class SlashCommandContext extends Rose.SlashCommandContext {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  get respond () {
    return CommandContext.prototype.respond.bind(this)
  }

  /**
   * Sends a file to the same channel
   * @param file File buffer
   * @param extra Extra message options
   * @returns
   */
  async sendFile (file: { name: string, buffer: Buffer }, extra?: Rose.MessageTypes): Promise<null> {
    // @ts-expect-error
    if (!this.sent) {
      // @ts-expect-error
      this.sent = true

      return await this.worker.api.interactions.callbackFile(this.interaction.id, this.interaction.token, file)
    }

    const formData = new FormData()
    formData.append('file', file.buffer, file.name)

    return await this.worker.api.request('PATCH', `/webhooks/${this.worker.user.id}/${this.interaction.token}/messages/@original`, {
      body: formData,
      headers: formData.getHeaders(),
      parser: _ => _
    })
  }
}
