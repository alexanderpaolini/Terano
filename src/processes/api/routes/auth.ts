/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { API } from '../structures/API'

export default function (this: API, router: Router): void {
  router.get('/login', (req, res) => {
    res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${this.config.oauth.id}&redirect_uri=${encodeURIComponent(`${req.hostname}/callback`)}&response_type=code&scope=${this.config.oauth.scopes.join('%20')}`)
  })

  router.get('/callback', async (req, res) => {
    if (!req.query.code) return res.redirect('/login')

    const cb = await req.app.oauth2.callback(req.query.code as string, req.hostname).catch(e => null)
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
}
