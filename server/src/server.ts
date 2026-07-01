import cors from 'cors';
import express from 'express';
import { env } from './config/env.js';

const app = express();

app.use(
  cors({
    origin: env.clientOrigin,
  }),
);
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Vehicle Lead Capture API is running' });
});

app.listen(env.port, () => {
  console.log(`API server listening on http://localhost:${env.port}`);
});
