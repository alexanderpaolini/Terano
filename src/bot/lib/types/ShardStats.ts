interface ShardStat {
  guilds: number;
  channels: number;
  roles: number;
  ping: string;
}

interface ShardObject {
  [key: number]: ShardStat;
}

interface ShardGuildObject {
  [key: number]: number;
}
