import { prisma } from '../utils/prisma.js';

export function listSources() {
  return prisma.source.findMany({
    orderBy: { name: 'asc' },
  });
}

export function listStatuses() {
  return prisma.status.findMany({
    orderBy: { name: 'asc' },
  });
}
