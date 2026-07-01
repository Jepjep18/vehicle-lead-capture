import { Router } from 'express';
import {
  getLeadById,
  getLeads,
  postLead,
  putLead,
  removeLead,
} from '../controllers/lead.controller.js';
import { asyncHandler } from '../utils/async-handler.js';

export const leadRouter = Router();

leadRouter.get('/', asyncHandler(getLeads));
leadRouter.get('/:id', asyncHandler(getLeadById));
leadRouter.post('/', asyncHandler(postLead));
leadRouter.put('/:id', asyncHandler(putLead));
leadRouter.delete('/:id', asyncHandler(removeLead));
