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
  topgg: {
    token: string;
    webhook?: {
      url: string;
      auth: string;
    }
  };
  port: number;
}
