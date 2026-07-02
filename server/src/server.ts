import cors from 'cors';
import express from 'express';
import { env } from './config/env.js';
import { errorHandler } from './middleware/error-handler.js';
import { notFoundHandler } from './middleware/not-found.js';
import { leadRouter } from './routes/lead.routes.js';
import { lookupRouter } from './routes/lookup.routes.js';

const app = express();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || env.clientOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked origin: ${origin}`));
    },
  }),
);
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Vehicle Lead Capture API is running' });
});

app.use('/api/leads', leadRouter);
app.use('/api', lookupRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`API server listening on http://localhost:${env.port}`);
});
