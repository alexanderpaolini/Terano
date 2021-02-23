import TeranoWorker from '../lib/TeranoWorker';

export default (worker: TeranoWorker) => {
  worker.on('READY', () => {
    worker.logger.log(`Ready as ${worker.user.username}#${worker.user.id} (${worker.user.id})`);

    setInterval(() => {
      worker.setStatus('watching', `Minecraft`, 'online')
    }, 60 * 1000)
  });
  worker.on('SHARD_READY', (shard) => {
    worker.webhooks.shard(worker.colors.GREEN, `Shard ${shard.id} is ready`)
  });
};
