import { Request, Response, NextFunction } from 'express'

export default () => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.ip === '::ffff:127.0.0.1') return next()
    return res.status(401).send({ success: false, message: 'Unauthorized' })
  }
}
