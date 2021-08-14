import path from 'path'

import { LoadRoutes } from '@jpbberry/load-routes'

import { Api } from '../structures/Api'

const api = new Api()

LoadRoutes(api.app, path.resolve(__dirname, 'routes'), this)

api.app.listen(api.config.api.port, () => {
  api.comms.log('Starting on port', api.config.api.port)
})
