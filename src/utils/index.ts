import { APIUser } from "discord-api-types";

/**
 * Function to escape code [stolen from here](https://stackoverflow.com/questions/39542872/escaping-discord-subset-of-markdown)
 * @param text String to be escaped
 */
function escapeMarkdown(text: string) {
  const unescaped = text.replace(/\\(\*|_|`|~|\\)/g, '$1');
  const escaped = unescaped.replace(/(\*|_|`|~|\\)/g, '\\$1');
  return escaped;
}

/**
 * Get the user's avatar
 * @param user The user to get the avatar from
 */
function getAvatar(user: APIUser, type: string = 'png', size: number = 128) {
  if (user.avatar) return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${type}?size=${size}`;
  return `https://cdn.discordapp.com/embed/avatars/${BigInt(user.discriminator) % BigInt(5)}.png`;
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

export default { escapeMarkdown, getAvatar };