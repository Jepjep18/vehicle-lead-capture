import { Router } from 'express';
import { getSources, getStatuses } from '../controllers/lookup.controller.js';
import { asyncHandler } from '../utils/async-handler.js';

export const lookupRouter = Router();

lookupRouter.get('/sources', asyncHandler(getSources));
lookupRouter.get('/statuses', asyncHandler(getStatuses));
