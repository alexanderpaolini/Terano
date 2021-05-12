import { LoadRoutes as loadRoutes } from '@jpbberry/load-routes'
import { RestManager, Thread } from 'discord-rose'

import express from 'express'
import path from 'path'
import mongoose from 'mongoose'

import { VoteDB } from '../../database'
import { OAuth2 } from './OAuth2'

import { Config } from '../../config'

export class API {
  config = Config

  app = express()

  db = new VoteDB()
  comms = new Thread()
  rest = new RestManager(Config.discord.token)
  oauth2 = new OAuth2(this.app)

  constructor () {
    this.app.set('trust-proxy', true)
    this.app.set('views', path.join(__dirname, '../views'))

    mongoose.connect(Config.db.connection_string, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    })
      .then(() => { this.comms.log('Connected to MongoDB') })
      .catch(() => { this.comms.log('MongoDB connction failed') })

    this.app.use('/', express.static(path.join(__dirname, '../public')))
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(express.json())

    loadRoutes(this.app, path.join(__dirname, '../routes'), this)

    this.app.listen(Config.api.port, () => {
      this.comms.log('Starting on port', Config.api.port)
    })
  }
}
