// Config
import config from '../config.json'

// Imports
import { OAuth2 } from './structures/OAuth2'
import express from 'express'
import mongoose from 'mongoose'
import path from 'path'
import VoteDB from '../database/vote'
import cookieParser from 'cookie-parser'

import { Thread, RestManager } from 'discord-rose'
import { websiteRouter, cardRouter, leaderboardRouter, topggRouter } from './routes'

const app = express()
app.comms = new Thread()
app.VoteDB = new VoteDB()
app.api = new RestManager(config.discord.token)
app.oauth2 = new OAuth2(app)

mongoose.connect(config.mongodb.connectURI, config.mongodb.connectOptions)
  .then(() => { app.comms.log('Connected to MongoDB') })
  .catch(() => { app.comms.log('MongoDB connction failed') })

app.set('trust-proxy', true)
app.set('views', path.join(__dirname, '/views'))

app.use('/', express.static(path.join(__dirname, '/public')))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use(cardRouter)
app.use(leaderboardRouter)
app.use(topggRouter)
app.use(websiteRouter)

app.listen(config.api.port, () => {
  app.comms.log('Starting on port', config.api.port)
})
