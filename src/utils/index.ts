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
function getAvatar(user: any, type: string = 'png', size: number = 128) {
  if (user.user) user = user.user;
  if (user.avatar) return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${type}?size=${size}`;
  return `https://cdn.discordapp.com/embed/avatars/${user.discriminator % 5}.png`;
}

export default { escapeMarkdown, getAvatar };