/* eslint-disable @typescript-eslint/no-misused-promises */
import config from '../../config.json'

import { Router } from 'express'

const router = Router()

const redirect = encodeURIComponent(`${config.website.host}/callback`)

router.get('/login', (req, res) => {
  res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${config.website.client_id}&redirect_uri=${redirect}&response_type=code&scope=${config.website.scopes.join('%20')}`)
})

router.get('/callback', async (req, res) => {
  if (!req.query.code) return res.redirect('/login')

  const cb = await req.app.oauth2.callback(req.query.code as string).catch(e => null)
  if (!cb) return res.redirect('/500')

  const { doc } = cb

  res.cookie('token', doc.token)
  res.redirect('/user')
})

router.get('/logout', async (req, res) => {
  res.clearCookie('token')
  res.redirect('/home')
})

router.get('/*', async (req, res) => {
  const user = await req.app.oauth2.db.getAuth(req.cookies?.token ?? '').catch(() => null)
  res.render('index.ejs', { user: user })
})

export default router
