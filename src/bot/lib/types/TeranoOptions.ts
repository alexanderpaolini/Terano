import { ConnectOptions } from "mongoose";
import { ClientOpts } from "redis";

export default interface TeranoOptions {
  prod: boolean;
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
  webhooks: {
    [key: string]: Webhook,
  }
}

export interface Webhook {
  id: string,
  token: string
}