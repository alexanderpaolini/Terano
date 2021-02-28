import { Router } from 'express';

import Canvas from 'canvas';

const router = Router();

router.post('/leaderboard', async (req, res) => {
  const users: any[] = req.body.data;
  if(users.length > 8) users.length = 8;

  const canvas = Canvas.createCanvas(800, 250 + 1000);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#23272A';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Cool Thing
  ctx.lineWidth = 45;
  ctx.strokeStyle = '#2C2F33';
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  // Leaderboard
  ctx.font = 'bold 88px sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('Leaderboard', 80, 175);

  let diff = 100;
  for (const user of users) {
    // Do the canvas image 
    const pfp = await Canvas.loadImage(`https://cdn.discordapp.com/avatars/${user.pfp}.png?size=128`);
    ctx.drawImage(pfp, 82, 175 + diff - 40, 100, 100);

    // Fill the user tag
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px sans-serif';
    while (ctx.measureText(user.tag).width > 500) user.tag = `${user.tag.slice(0, -4)}...`;
    ctx.fillText(user.tag, 122 + 84, 175 + diff);

    // Fil the level and rank
    ctx.fillStyle = '#d4d4d4';
    ctx.font = 'normal 32px sans-serif';
    ctx.fillText(`Level: ${user.level}`, 122 + 84, 175 + diff + 50);
    ctx.fillText(`Rank: ${user.rank}`, 317 + 84, 175 + diff + 50);

    // Increase the difference
    diff = diff + 120;
  }

  const buffer = canvas.toBuffer('image/png');

  res.contentType('image/png');
  res.send(buffer);
  return;
});

export default router;
