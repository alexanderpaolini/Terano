import Canvas from 'canvas'

import authentication from '../middleware/internalAuth'

import { Router } from 'express'
import { API } from '../structures/API'

export default function (this: API, router: Router): void {
  router.post('/', authentication(), async (req, res) => {
    const users: any[] = req.body.data
    if (users.length > 8) users.length = 8

    const canvas = Canvas.createCanvas(800, 250 + 1000)
    const ctx = canvas.getContext('2d')

    // Background
    ctx.fillStyle = '#23272A'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Cool Thing
    ctx.lineWidth = 45
    ctx.strokeStyle = '#2C2F33'
    ctx.strokeRect(0, 0, canvas.width, canvas.height)

    // Leaderboard
    ctx.font = 'bold 88px sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.fillText('Leaderboard', 80, 175)

    let diff = 100
    for (const user of users) {
      // Do the canvas image
      const pfp = await Canvas.loadImage(user.pfp)
      ctx.drawImage(pfp, 82, 175 + diff - 40, 100, 100)

      // Fill the user tag
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 36px sans-serif'
      while (ctx.measureText(user.tag).width > 510) user.tag = `${user.tag.slice(0, -4) as string}...`
      ctx.fillText(user.tag, 122 + 84, 175 + diff)

      // Fil the level and rank
      ctx.fillStyle = '#d4d4d4'
      ctx.font = 'normal 32px sans-serif'
      ctx.fillText(`Level: ${user.level as string}`, 122 + 84, 175 + diff + 50)
      ctx.fillText(`Rank: ${user.rank as string}`, 317 + 84, 175 + diff + 50)

      // Increase the difference
      diff = diff + 120
    }

    const buffer = canvas.toBuffer('image/png')

    res.contentType('image/png')
    res.send(buffer)
  })
}
