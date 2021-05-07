/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'

const router = Router()

const redirect = encodeURIComponent('http://51.81.82.25:3002/callback')
const CLIENT_ID = '647256366280474626'

router.get('/login', (req, res) => {
  res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirect}&response_type=code&scope=email%20connections%20guilds%20identify`)
})

router.get('/callback', async (req, res) => {
  if (!req.query.code) return res.redirect('/login')

  const cb = await req.app.oauth2.callback(req.query.code as string).catch(e => null)
  if (!cb) return res.redirect('/500')

  const { doc } = cb

  res.cookie('token', doc.token)
  res.redirect('/user')
})

router.get('/user', async (req, res) => {
  const token = req.cookies?.token
  if (!token) return res.redirect('/login')

  const user = await req.app.oauth2.db.getAuth(token).catch(() => null)
  if (!user) return res.redirect('/login')

  res.render('user.ejs', { user })
})

router.get('/*', (req, res) => {
  res.render('index.ejs', { test: 'test' })
})

export default router
