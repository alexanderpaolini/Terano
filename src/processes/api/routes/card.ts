import Canvas from 'canvas'

import authentication from '../middleware/internalAuth'

import { Router } from 'express'
import { API } from '../structures/API'

interface CardRequestBody {
  color: string
  level: string
  xp: string
  maxxp: string
  picture: string
  tag: string
  usertag: string
}

export default function (this: API, router: Router): void {
  router.post('/', authentication(), async (req, res) => {
    let { color, level, xp, maxxp, picture, tag, usertag } = req.body as CardRequestBody
    const str = color + level + xp + maxxp + tag + usertag

    const hasImage = this.cache.rank.has(str)
    if (hasImage) {
      console.log('cached')
      const image = this.cache.rank.get(str)

      res.contentType('image/png')
      res.status(200)
      res.send(image)
      return
    }

    const canvas = Canvas.createCanvas(850, 250)
    const ctx = canvas.getContext('2d')

    ctx.fillStyle = '#23272A'
    ctx.fillRect(0, 0, 1000, 250)

    ctx.lineWidth = 45
    ctx.strokeStyle = '#2C2F33'
    ctx.strokeRect(0, 0, canvas.width, canvas.height)

    ctx.font = '26px sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.fillText(`Level: ${level}   XP: ${xp} / ${maxxp}`, 275, canvas.height / 2)

    ctx.font = 'normal 32px sans-serif'
    ctx.fillStyle = '#ffffff'
    while (ctx.measureText(usertag).width > 530) usertag = `${usertag.slice(0, -4)}...`
    ctx.fillText(`${usertag}`, 275, canvas.height / 3.5)

    ctx.font = 'bold 32px sans-serif'
    ctx.fillStyle = color
    while (ctx.measureText(tag).width > 530) tag = `${tag.slice(0, -4)}...`
    ctx.fillText(tag, 275, canvas.height / 1.35)

    const percentage = Math.floor(Number(xp) / Number(maxxp) * 100) / 100
    const twoPI = 2 * Math.PI
    const pointFivePI = 0.5 * Math.PI

    const arcLength = percentage * twoPI
    const totalLength = arcLength - pointFivePI

    ctx.strokeStyle = '#2C2F33'
    ctx.lineWidth = 35
    ctx.beginPath()
    ctx.arc(125, 125, 85, 1.5 * Math.PI, 1.51 * Math.PI, true)
    ctx.stroke()

    ctx.strokeStyle = color
    ctx.beginPath()
    ctx.arc(125, 125, 86, 1.5 * Math.PI, totalLength, false)
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(125, 125, 85, 0, Math.PI * 2, true)
    ctx.closePath()
    ctx.clip()

    let avatar: Canvas.Image
    const hasAvatar = this.cache.avatar.has(picture)
    if (hasAvatar) {
      avatar = this.cache.avatar.get(picture) as Canvas.Image
    } else {
      avatar = await Canvas.loadImage(picture)
    }

    ctx.drawImage(avatar, 33, 32, 185, 185)

    const buffer = canvas.toBuffer('image/png')

    this.cache.rank.set(str, buffer)

    res.contentType('image/png')
    res.send(buffer)
  })
}
