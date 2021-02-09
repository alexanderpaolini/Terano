export default function parseOptions(options) {
  if (!options || typeof (options) !== 'object') return '';
  let str = '';
  for (const [key, value] of Object.entries(options)) {
    if (!str) str += `?${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`;
    else str += `&${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`;
  }
  return str;
};
