import express from 'express';

// Routers
import cardRouter from './card';
import leaderboardRouter from './leaderboard';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cardRouter);
app.use(leaderboardRouter);

export default app;
