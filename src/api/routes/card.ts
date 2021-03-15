import { Router } from 'express';

import Canvas from 'canvas';

// Middleware
import authentication from '../middleware/authentication';

const router = Router();

router.post('/card', authentication(), async (req, res) => {
  let { color, level, xp, maxxp, picture, tag, usertag } = req.body;

  const canvas = Canvas.createCanvas(850, 250);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#23272A';
  ctx.fillRect(0, 0, 1000, 250);

  ctx.lineWidth = 45;
  ctx.strokeStyle = '#2C2F33';
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  ctx.font = '26px sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`Level: ${level}   XP: ${xp} / ${maxxp}`, 275, canvas.height / 2);

  ctx.font = 'normal 32px sans-serif';
  ctx.fillStyle = '#ffffff';
  while (ctx.measureText(usertag).width > 530) usertag = `${usertag.slice(0, -4)}...`;
  ctx.fillText(`${usertag}`, 275, canvas.height / 3.5);

  ctx.font = 'bold 32px sans-serif';
  ctx.fillStyle = color;
  while (ctx.measureText(tag).width > 530) tag = `${tag.slice(0, -4)}...`;
  ctx.fillText(tag, 275, canvas.height / 1.35);

  const percentage = Math.floor(Number(xp) / Number(maxxp) * 100) / 100;
  const twoPI = 2 * Math.PI;
  const pointFivePI = 0.5 * Math.PI;

  const arcLength = percentage * twoPI;
  const totalLength = arcLength - pointFivePI;

  ctx.strokeStyle = '#2C2F33';
  ctx.lineWidth = 35;
  ctx.beginPath();
  ctx.arc(125, 125, 85, 1.5 * Math.PI, 1.51 * Math.PI, true);
  ctx.stroke();

  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.arc(125, 125, 86, 1.5 * Math.PI, totalLength, false);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(125, 125, 85, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();

  const avatar = await Canvas.loadImage(picture);
  ctx.drawImage(avatar, 33, 32, 185, 185);

  const buffer = canvas.toBuffer('image/png');

  res.contentType('image/png');
  res.send(buffer);
  return;
});

export default router;
