import express from 'express';
import cors from 'cors';
import statsRouter from './routes/stats.js';
import questionsRouter from './routes/questions.js';
import personalitiesRouter from './routes/personalities.js';
import { seedDefaults } from './seed.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use('/stats', statsRouter);
app.use('/questions', questionsRouter);
app.use('/personalities', personalitiesRouter);

// Health check
app.get('/', (_req, res) => {
  res.json({ status: 'KGTI API', version: '1.0.0' });
});

// Seed default data on startup
seedDefaults();

app.listen(PORT, () => {
  console.log(`KGTI backend listening on port ${PORT}`);
});
