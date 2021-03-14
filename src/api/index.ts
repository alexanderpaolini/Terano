// Config
import config from '../config.json';

// Imports
import { Thread } from 'discord-rose';
import express from 'express';
import mongoose from 'mongoose';
import VoteDB from '../database/vote';

// Routers
import cardRouter from './routes/card';
import leaderboardRouter from './routes/leaderboard';
import topggRouter from './routes/topgg';

const app = express();
app.comms = new Thread();
app.VoteDB = new VoteDB();

mongoose.connect(config.mongodb.connectURI, config.mongodb.connectOptions)
  .then(() => { console.log('Connected to MongoDB'); })
  .catch(() => { console.error('Failed connection to MongoDB'); });

app.set('trust-proxy', true);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cardRouter);
app.use(leaderboardRouter);
app.use(topggRouter);

app.listen(config.api.port, () => {
  console.log('Starting API on port', config.api.port);
});
