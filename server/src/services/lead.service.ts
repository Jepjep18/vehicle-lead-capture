import type { Prisma } from '@prisma/client';
import { ApiError } from '../utils/api-error.js';
import { prisma } from '../utils/prisma.js';
import type {
  CreateLeadInput,
  LeadListQuery,
  UpdateLeadInput,
} from '../validators/lead.validator.js';

const leadInclude = {
  source: true,
  status: true,
} satisfies Prisma.LeadInclude;

function buildRelationFilter(value: string | undefined): Prisma.IntFilter<'Lead'> | undefined {
  if (!value) {
    return undefined;
  }

  const numericValue = Number(value);

  if (Number.isInteger(numericValue) && numericValue > 0) {
    return { equals: numericValue };
  }

  return undefined;
}

function buildLeadWhere(query: LeadListQuery): Prisma.LeadWhereInput {
  const where: Prisma.LeadWhereInput = {};

  if (query.search) {
    where.OR = [
      { firstName: { contains: query.search } },
      { lastName: { contains: query.search } },
      { email: { contains: query.search } },
      { phone: { contains: query.search } },
      { vehicle: { contains: query.search } },
    ];
  }

  const sourceId = buildRelationFilter(query.source);
  const statusId = buildRelationFilter(query.status);

  if (sourceId) {
    where.sourceId = sourceId;
  } else if (query.source) {
    where.source = { name: query.source };
  }

  if (statusId) {
    where.statusId = statusId;
  } else if (query.status) {
    where.status = { name: query.status };
  }

  return where;
}

function buildLeadOrderBy(query: LeadListQuery): Prisma.LeadOrderByWithRelationInput[] {
  if (query.sort === 'name') {
    return [{ lastName: query.direction }, { firstName: query.direction }];
  }

  return [{ [query.sort]: query.direction }];
}

async function assertSourceAndStatusExist(sourceId?: number, statusId?: number) {
  const [source, status] = await Promise.all([
    sourceId ? prisma.source.findUnique({ where: { id: sourceId } }) : Promise.resolve(null),
    statusId ? prisma.status.findUnique({ where: { id: statusId } }) : Promise.resolve(null),
  ]);

  if (sourceId && !source) {
    throw new ApiError(422, 'Validation failed', { sourceId: ['Source does not exist'] });
  }

  if (statusId && !status) {
    throw new ApiError(422, 'Validation failed', { statusId: ['Status does not exist'] });
  }
}

export async function listLeads(query: LeadListQuery) {
  const where = buildLeadWhere(query);
  const skip = (query.page - 1) * query.limit;

  const [records, totalRecords] = await Promise.all([
    prisma.lead.findMany({
      where,
      include: leadInclude,
      orderBy: buildLeadOrderBy(query),
      skip,
      take: query.limit,
    }),
    prisma.lead.count({ where }),
  ]);

  return {
    records,
    pagination: {
      currentPage: query.page,
      totalPages: Math.ceil(totalRecords / query.limit),
      totalRecords,
      limit: query.limit,
    },
  };
}

export async function getLead(id: number) {
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      ...leadInclude,
      statusHistory: {
        include: { status: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!lead) {
    throw new ApiError(404, 'Lead not found');
  }

  return lead;
}

export async function createLead(input: CreateLeadInput) {
  await assertSourceAndStatusExist(input.sourceId, input.statusId);

  return prisma.lead.create({
    data: {
      ...input,
      externalId: crypto.randomUUID(),
      statusHistory: {
        create: {
          statusId: input.statusId,
        },
      },
    },
    include: leadInclude,
  });
}

export async function updateLead(id: number, input: UpdateLeadInput) {
  const existingLead = await prisma.lead.findUnique({ where: { id } });

  if (!existingLead) {
    throw new ApiError(404, 'Lead not found');
  }

  await assertSourceAndStatusExist(input.sourceId, input.statusId);

  return prisma.$transaction(async (tx) => {
    const updatedLead = await tx.lead.update({
      where: { id },
      data: input,
      include: leadInclude,
    });

    if (input.statusId && input.statusId !== existingLead.statusId) {
      await tx.statusHistory.create({
        data: {
          leadId: id,
          statusId: input.statusId,
        },
      });
    }

    return updatedLead;
  });
}

export async function deleteLead(id: number) {
  const existingLead = await prisma.lead.findUnique({ where: { id } });

  if (!existingLead) {
    throw new ApiError(404, 'Lead not found');
  }

  await prisma.lead.delete({ where: { id } });
}
