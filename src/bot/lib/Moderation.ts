import { APIChannel, APIGuildMember, Snowflake } from "discord-api-types";
import TeranoWorker from "./Worker";

export default class Moderation {
  muteInterval: NodeJS.Timeout;
  constructor(private worker: TeranoWorker) {
    this.muteInterval = setInterval(() => {
      this.worker.db.guildDB.getMuteDocs().then(docs => {
        const now = new Date();
        for (const doc of docs) {
          const timestamp = new Date(doc.timestamp).getTime();
          if (timestamp < now.getTime()) setTimeout(this.unmute(doc.userID as any, doc.guildID as any, doc.timestamp), (timestamp - now.getTime()));
        }
      });
    }, 5 * 1000 * 60);
  }

  async getMuteRole(guildID: Snowflake) {
    const muteRoleID = await this.worker.db.guildDB.getMuteRole(guildID);
    return this.worker.guildRoles.get(guildID).get(muteRoleID as Snowflake);
  }

  async getLogChannel(guildID: Snowflake): Promise<APIChannel | null> {
    const logChannelID = await this.worker.db.guildDB.getLogChannel(guildID);
    if (logChannelID === 'none') return null;
    return this.worker.channels.get(logChannelID as Snowflake);
  }

  async getMember(guildID: Snowflake, userID: Snowflake): Promise<APIGuildMember> {
    return await this.worker.api.members.get(guildID, userID).catch(() => null as APIGuildMember);
  }

  calculatePermissions(member: APIGuildMember, guildID: Snowflake): boolean {
    const memberHighest = member.roles.reduce((a, b) => {
      const rolePosition = this.worker.guildRoles.get(guildID).get(b).position;
      return a > rolePosition ? a : rolePosition;
    }, 0);
    const botHighest = this.worker.selfMember.get(guildID).roles.reduce((a, b) => {
      const rolePosition = this.worker.guildRoles.get(guildID).get(b).position;
      return a > rolePosition ? a : rolePosition;
    }, 0);
    if (memberHighest < botHighest) return true;
    return false;
  }

  async ban(guildID: Snowflake, userID: Snowflake, reason?: string): Promise<APIGuildMember> {
    const member = await this.getMember(guildID, userID);
    if (!member) throw new Error('Error occured while fetching member.');
    if (!this.calculatePermissions(member, guildID)) throw new Error('Unable to ban member higher than bot.');
    const success = await this.worker.api.members.ban(guildID, userID, { delete_message_days: 1, reason }).then(e => true).catch(e => false);
    if (!success) throw new Error('Error occured while banning member.');
    return member;
  }

  async kick(guildID: Snowflake, userID: Snowflake, reason?: string): Promise<APIGuildMember> {
    const member = await this.getMember(guildID, userID);
    if (!member) throw new Error('Error occured while fetching member.');
    if (!this.calculatePermissions(member, guildID)) throw new Error('Unable to kick member higher than the bot.');
    const success = await this.worker.api.members.kick(guildID, userID, reason).then(e => true).catch(e => false);
    if (!success) throw new Error('Error occured while kicking member.');
    return member;
  }

  async mute(guildID: Snowflake, userID: Snowflake, time: number) {
    const member = await this.getMember(guildID, userID);
    if (!member) throw new Error('Error occured while fetching member.');
    const muteRole = await this.getMuteRole(guildID);
    if (!muteRole) throw new Error('Error occured while getting mute role.');
    const botHighest = this.worker.selfMember.get(guildID).roles.reduce((a, b) => {
      const rolePosition = this.worker.guildRoles.get(guildID).get(b).position;
      return a > rolePosition ? a : rolePosition;
    }, 0);
    if (muteRole.position >= botHighest) throw new Error(`Unable to give a member "${muteRole.name}".`);
    const success = await this.worker.api.members.addRole(guildID, userID, muteRole.id).then(e => true).catch(e => false);
    if (!success) throw new Error('Error occured while adding role.');
    const timestamp = new Date(Date.now() + time).toString();
    await this.worker.db.guildDB.createMute(guildID, userID, timestamp);
    return member;
  }

  unmute(userID: Snowflake, guildID: Snowflake, timestamp: string): () => Promise<any> {
    return async () => {
      const member = await this.getMember(guildID, userID);
      if (!member) return this.worker.db.guildDB.deleteMute(guildID, userID, timestamp);
      const muteRole = await this.getMuteRole(guildID);
      if (!muteRole) return this.worker.db.guildDB.deleteMute(guildID, userID, timestamp);
      const botHighest = this.worker.selfMember.get(guildID).roles.reduce((a, b) => {
        const rolePosition = this.worker.guildRoles.get(guildID).get(b).position;
        return a > rolePosition ? a : rolePosition;
      }, 0);
      if (muteRole.position >= botHighest) return this.worker.db.guildDB.deleteMute(guildID, userID, timestamp);
      const success = await this.worker.api.members.removeRole(guildID, userID, muteRole.id).then(e => true).catch(e => false);
      await this.worker.db.guildDB.deleteMute(guildID, userID, timestamp);
      if (success) {
        const logChannel = await this.getLogChannel(guildID);
        if (logChannel) {
          this.worker.api.messages.send(logChannel.id, {
            embed: {
              title: `Un-Muted Member`,
              color: this.worker.colors.GREEN,
              fields: [
                {
                  name: 'Member',
                  value: `${member.user.username + '#' + member.user.discriminator} (<@${member.user.id}>)`,
                  inline: true
                },
                {
                  name: 'Moderator',
                  value: `${this.worker.user.username + '#' + this.worker.user.discriminator} (<@${this.worker.user.id}>)`,
                  inline: true
                },
                {
                  name: 'Reason',
                  value: 'Time\'s Up!',
                  inline: false
                }
              ],
              timestamp: new Date().toISOString(),
            },
          });
        }
      }
    };
  }
}