import express from 'express';

// Routers
import cardRouter from './routes/card';
import leaderboardRouter from './routes/leaderboard';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cardRouter);
app.use(leaderboardRouter);

export default app;
