import TeranoWorker from "../lib/Worker";

export default (worker: TeranoWorker) => {
  worker.on('READY', () => {
    worker.logger.log(`Ready`);
  });
};
