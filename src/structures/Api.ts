import { Config } from './Config'

import { Thread } from 'jadl'
import { RestManager } from '@discord-rose/rest'

import express from 'express'

import { Database } from './Database'

export class Api {
  config = Config

  app = express()

  comms = new Thread()
  rest = new RestManager(this.config.discord.token)
  db = new Database()

  constructor () {
    this.app.set('trust-proxy', true)

    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(express.json())
  }
}
