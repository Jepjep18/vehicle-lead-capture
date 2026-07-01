import type { RequestHandler } from 'express';
import { listSources, listStatuses } from '../services/lookup.service.js';

export const getSources: RequestHandler = async (_req, res) => {
  const data = await listSources();

  res.json({ success: true, data });
};

export const getStatuses: RequestHandler = async (_req, res) => {
  const data = await listStatuses();

  res.json({ success: true, data });
};
