import type { RequestHandler } from 'express';
import {
  createLead,
  deleteLead,
  getLead,
  listLeads,
  updateLead,
} from '../services/lead.service.js';
import {
  createLeadSchema,
  leadIdParamSchema,
  leadListQuerySchema,
  updateLeadSchema,
} from '../validators/lead.validator.js';

export const getLeads: RequestHandler = async (req, res) => {
  const query = leadListQuerySchema.parse(req.query);
  const data = await listLeads(query);

  res.json({ success: true, data: data.records, pagination: data.pagination });
};

export const getLeadById: RequestHandler = async (req, res) => {
  const { id } = leadIdParamSchema.parse(req.params);
  const data = await getLead(id);

  res.json({ success: true, data });
};

export const postLead: RequestHandler = async (req, res) => {
  const input = createLeadSchema.parse(req.body);
  const data = await createLead(input);

  res.status(201).json({ success: true, data });
};

export const putLead: RequestHandler = async (req, res) => {
  const { id } = leadIdParamSchema.parse(req.params);
  const input = updateLeadSchema.parse(req.body);
  const data = await updateLead(id, input);

  res.json({ success: true, data });
};

export const removeLead: RequestHandler = async (req, res) => {
  const { id } = leadIdParamSchema.parse(req.params);
  await deleteLead(id);

  res.status(204).send();
};
