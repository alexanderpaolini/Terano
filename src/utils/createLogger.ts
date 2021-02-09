import separate from './separate'
import colors from 'colors/safe'

function format(m: string, c: string = 'yellow') {
  const str = m;
  const len = 13;
  return colors.bold(colors[c](`${separate(str, len)}|`));
}

interface logger {
  log: (...args: any[]) => {},
  warn: (...args: any[]) => {},
  error: (...args: any[]) => {}
}

export default function createLogger(m: string, logger: logger, c: string) {
  const msg = format(m, c);
  return {
    log: (...args: any) => { return logger.log(msg, ...args); },
    warn: (...args: any) => { return logger.warn(msg, ...args); },
    error: (...args: any) => { return logger.error(msg, ...args); }
  };
};
