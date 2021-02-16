import { Router } from 'express';

import Canvas from 'canvas';

const router = Router();

router.get('/card/:color/:level/:xp/:maxxp/:picture/:tag/:usertag', async (req, res) => {
  const { color, level, xp, maxxp, picture, tag, usertag } = req.params;

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
  ctx.fillText(`${usertag}`, 275, canvas.height / 3.5);

  ctx.font = 'bold 32px sans-serif';
  ctx.fillStyle = color;
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

// /card/%23800080/2/2/10/https%3A%2F%2Fcdn.discordapp.com%2Favatars%2F142408079177285632%2F2ee8cd8a497e07924f9a51c4b3821c78.png%3Fsize%3D128/Pog/MILLION%231321