import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const defaultDatasetUrl =
  'https://gist.githubusercontent.com/codemk12/3691a622ba446e4e39d0e80ece702a44/raw';

type RawLead = Record<string, unknown>;

type SeedLead = {
  externalId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  vehicle: string;
  source: string;
  status: string;
  createdAt?: Date;
};

const defaultStatuses = ['New', 'Contacted', 'Qualified', 'Follow-Up', 'Won', 'Lost'];

function getString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;
}

function pickString(record: RawLead, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = getString(record[key]);

    if (value) {
      return value;
    }
  }
}

function parseDate(value: unknown): Date | undefined {
  const raw = getString(value);

  if (!raw) {
    return undefined;
  }

  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function normalizeVehicle(record: RawLead): string | undefined {
  const direct = pickString(record, [
    'vehicleOfInterest',
    'vehicle_of_interest',
    'vehicle',
    'vehicleName',
    'vehicle_name',
    'car',
    'model',
  ]);

  if (direct) {
    return direct;
  }

  const vehicle = record.vehicle;

  if (!vehicle || typeof vehicle !== 'object' || Array.isArray(vehicle)) {
    return undefined;
  }

  const vehicleRecord = vehicle as RawLead;
  const year = getString(vehicleRecord.year) ?? '';
  const make = getString(vehicleRecord.make) ?? '';
  const model = getString(vehicleRecord.model) ?? '';
  const trim = getString(vehicleRecord.trim) ?? '';

  return [year, make, model, trim].filter(Boolean).join(' ') || undefined;
}

function normalizeLead(record: RawLead): SeedLead {
  const externalId = pickString(record, ['id', 'externalId', 'external_id']);
  const fullName = pickString(record, ['name', 'fullName', 'full_name']);
  const firstName = pickString(record, ['firstName', 'first_name']) ?? fullName?.split(' ')[0];
  const lastName =
    pickString(record, ['lastName', 'last_name']) ?? fullName?.split(' ').slice(1).join(' ');
  const email = pickString(record, ['email', 'emailAddress', 'email_address']);
  const vehicle = normalizeVehicle(record);

  if (!externalId || !firstName || !lastName || !email || !vehicle) {
    throw new Error(`Invalid lead record: ${JSON.stringify(record)}`);
  }

  return {
    externalId,
    firstName,
    lastName,
    email: email.toLowerCase(),
    phone: pickString(record, ['phone', 'phoneNumber', 'phone_number']) ?? null,
    vehicle,
    source: pickString(record, ['source', 'leadSource', 'lead_source']) ?? 'Unknown',
    status: pickString(record, ['status', 'leadStatus', 'lead_status']) ?? 'New',
    createdAt: parseDate(
      record.dateReceived ?? record.date_received ?? record.createdAt ?? record.created_at,
    ),
  };
}

function extractLeadArray(payload: unknown): RawLead[] {
  if (Array.isArray(payload)) {
    return payload as RawLead[];
  }

  if (!payload || typeof payload !== 'object') {
    throw new Error('Dataset must be a JSON array or an object containing a leads array.');
  }

  const record = payload as RawLead;
  const leads = record.leads ?? record.data ?? record.records;

  if (!Array.isArray(leads)) {
    throw new Error('Dataset object must contain a leads, data, or records array.');
  }

  return leads as RawLead[];
}

async function loadDataset(): Promise<SeedLead[]> {
  if (process.env.DATASET_PATH) {
    const datasetPath = path.resolve(process.cwd(), process.env.DATASET_PATH);
    const file = await readFile(datasetPath, 'utf8');

    return extractLeadArray(JSON.parse(file)).map(normalizeLead);
  }

  const datasetUrl = process.env.DATASET_URL ?? defaultDatasetUrl;
  const response = await fetch(datasetUrl);

  if (!response.ok) {
    throw new Error(`Dataset fetch failed with status ${response.status}`);
  }

  return extractLeadArray(await response.json()).map(normalizeLead);
}

async function upsertSource(name: string) {
  return prisma.source.upsert({
    where: { name },
    update: {},
    create: { name },
  });
}

async function upsertStatus(name: string) {
  return prisma.status.upsert({
    where: { name },
    update: {},
    create: { name },
  });
}

async function main() {
  const existingLeadCount = await prisma.lead.count();

  if (existingLeadCount > 0) {
    console.log(`Seed skipped. Database already contains ${existingLeadCount} leads.`);
    return;
  }

  const leads = await loadDataset();
  const sourceNames = Array.from(new Set(leads.map((lead) => lead.source)));
  const statusNames = Array.from(
    new Set([...defaultStatuses, ...leads.map((lead) => lead.status)]),
  );

  const sources = new Map<string, number>();
  const statuses = new Map<string, number>();

  for (const sourceName of sourceNames) {
    const source = await upsertSource(sourceName);
    sources.set(sourceName, source.id);
  }

  for (const statusName of statusNames) {
    const status = await upsertStatus(statusName);
    statuses.set(statusName, status.id);
  }

  for (const lead of leads) {
    const sourceId = sources.get(lead.source);
    const statusId = statuses.get(lead.status);

    if (!sourceId || !statusId) {
      throw new Error(`Unable to resolve source or status for ${lead.email}`);
    }

    const createdLead = await prisma.lead.create({
      data: {
        firstName: lead.firstName,
        externalId: lead.externalId,
        lastName: lead.lastName,
        email: lead.email,
        phone: lead.phone,
        vehicle: lead.vehicle,
        sourceId,
        statusId,
        createdAt: lead.createdAt,
        statusHistory: {
          create: {
            statusId,
            createdAt: lead.createdAt,
          },
        },
      },
    });

    console.log(`Seeded lead ${createdLead.id}: ${lead.firstName} ${lead.lastName}`);
  }

  console.log(`Seed complete. Created ${leads.length} leads.`);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
