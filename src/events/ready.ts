import TeranoWorker from "../lib/Worker";

export default (worker: TeranoWorker) => {
  worker.on('SHARD_READY', shard => {
    worker.logger.log(`Shard ${shard.id} is ready`);
  });
};
