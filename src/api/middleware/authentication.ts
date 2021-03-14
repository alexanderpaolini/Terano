import { Router } from 'express';

export default () => {
  const middleware = Router();

  middleware.all('*', (req, res, next) => {
    if (req.ip === '::ffff:127.0.0.1') return next();
    return res.status(401).send({ success: false, message: 'Unauthorized' });
  });

  return middleware;
};
