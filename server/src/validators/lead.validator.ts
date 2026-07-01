import { z } from 'zod';

const optionalPhoneSchema = z
  .string()
  .trim()
  .min(3, 'Phone must be at least 3 characters')
  .max(40, 'Phone must be at most 40 characters')
  .nullable()
  .optional();

export const leadIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const leadListQuerySchema = z.object({
  search: z.string().trim().optional(),
  source: z.string().trim().optional(),
  status: z.string().trim().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  sort: z.enum(['name', 'email', 'createdAt']).default('createdAt'),
  direction: z.enum(['asc', 'desc']).default('desc'),
});

export const createLeadSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: z
    .string()
    .trim()
    .email()
    .max(160)
    .transform((value) => value.toLowerCase()),
  phone: optionalPhoneSchema,
  vehicle: z.string().trim().min(1).max(160),
  sourceId: z.number().int().positive(),
  statusId: z.number().int().positive(),
});

export const updateLeadSchema = createLeadSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required',
  });

export type LeadListQuery = z.infer<typeof leadListQuerySchema>;
export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
