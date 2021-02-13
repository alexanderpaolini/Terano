import separate from './separate';
import colors from 'colors/safe';

function format(m: string, c: string = 'yellow', len = 5) {
  const str = m;
  return colors.bold(colors[c](`${separate(str, len)}`)) + colors.grey('|');
}

interface logger {
  log: (...args: any[]) => {},
  warn: (...args: any[]) => {},
  error: (...args: any[]) => {};
}

export default function createLogger(m: string, logger: logger, c: string) {
  const msg = format(m, c, 13);
  const log = format('LOG', 'green');
  const dbg = format('DEBUG', 'magenta');
  const err = format('ERROR', 'red');
  return {
    log: (...args: any) => { return logger.log(log, msg, ...args); },
    warn: (...args: any) => { return logger.log(dbg, msg, ...args); },
    error: (...args: any) => { return logger.log(err, msg, ...args); }
  };
}
