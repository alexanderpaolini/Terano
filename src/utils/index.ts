import { APIUser } from "discord-api-types";

import colors from 'colors/safe';

interface logger {
  log: (...args: any[]) => {},
  warn: (...args: any[]) => {},
  error: (...args: any[]) => {};
}

/**
 * Function to escape code [stolen from here](https://stackoverflow.com/questions/39542872/escaping-discord-subset-of-markdown)
 * @param text String to be escaped
 */
export function escapeMarkdown(text: string) {
  const unescaped = text.replace(/\\(\*|_|`|~|\\)/g, '$1');
  const escaped = unescaped.replace(/(\*|_|`|~|\\)/g, '\\$1');
  return escaped;
}

/**
 * Get the user's avatar
 * @param user The user to get the avatar from
 */
export function getAvatar(user: APIUser, type: string = 'png', size: number = 128) {
  if (user.avatar) return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${type}?size=${size}`;
  return `https://cdn.discordapp.com/embed/avatars/${BigInt(user.discriminator) % BigInt(5)}.png`;
}

/**
 * Format the string
 * @param m Message
 * @param c Color
 * @param len Length
 */
export function format(m: string, c: string = 'yellow', len = 7) {
  const str = m;
  // @ts-ignore
  return colors.bold(colors[c](`${separate(str, len)}`)) + colors.grey('|');
}

/**
 * Create a logger
 * @param m Message
 * @param logger Logger
 * @param c Color
 */
export function createLogger(m: string, logger: logger, c: string) {
  const msg = format(m, c, 13);
  const log = format('LOG', 'green');
  const dbg = format('DEBUG', 'magenta');
  const err = format('ERROR', 'red');
  return {
    log: (...args: any) => { return logger.log(log, msg, ...args); },
    debug: (...args: any) => { return logger.log(dbg, msg, ...args); },
    error: (...args: any) => { return logger.log(err, msg, ...args); }
  };
}

/**
 * Format the time broski
 * @param time how long in milliseconds
 */
export function formatTime(time: number) {
  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  // Hours
  while (time > 3600000) {
    hours++;
    time = time - 3600000;
  }

  // Minutes
  while (time > 60000) {
    minutes++;
    time = time - 60000;
  }

  // Seconds
  while (time > 1000) {
    seconds++;
    time = time - 1000;
  }

  return `${hours ? `${hours} hour${hours > 1 ? 's' : ''}, ` : ''}${minutes ? `${minutes} minute${minutes > 1 ? 's' : ''}${hours ? ', and' : ' and'} ` : ''}${seconds > 1 ? seconds : 1} second${seconds > 1 ? 's' : ''}`;
}

/**
 * Make a string longer
 * @param str String
 * @param to string length
 */
export function separate(str: string, to: number): string {
  let res = str;
  let sw = 1;
  for (let i = 0; i < 100; i++) {
    if (sw === 1) res = res + ' ';
    else res = ' ' + res;
    if (res.length >= to) break;
    sw = sw * -1;
  }
  return res;
}
