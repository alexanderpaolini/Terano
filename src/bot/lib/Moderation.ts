import { Snowflake } from "discord-api-types";
import TeranoWorker from "./TeranoWorker";

export default class Moderation {
  /**
   * The interval ig
   */
  muteInterval: NodeJS.Timeout = setInterval(() => {

  }, 1_1000_60);

  /**
   * Construction go brrrrrrrrr
   * @param worker The ~~worker~~ slave
   */
  constructor(private worker: TeranoWorker) {}

  /**
   * Compare 2 roles
   * 
   * role1 higher role2 > true
   * 
   * role2 higher role1 > false
   * @param role1 Role ID
   * @param role2 Other Role ID
   */
  compareRoles(guildID: string, roleid1: string, roleid2: string) {
    const role1 = this.worker.guildRoles.get(guildID as Snowflake)?.get(roleid1 as Snowflake);
    const role2 = this.worker.guildRoles.get(guildID as Snowflake)?.get(roleid2 as Snowflake);
    return (role1?.position ?? 0) > (role2?.position ?? 0)
  }
}