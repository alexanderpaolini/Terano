import { ConnectOptions } from "mongoose";
import { ClientOpts } from "redis";

export default interface TeranoOptions {
  mongodb: {
    connectURI: string;
    connectOptions: ConnectOptions;
  };
  redis: ClientOpts;
  discord: {
    token: string;
  };
  topdotgeegee: string;
}
