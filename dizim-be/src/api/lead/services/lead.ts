import { factories } from '@strapi/strapi';
import {
  CreateLeadInput,
  UpdateLeadInput,
  LeadSourceType,
  LeadStatus,
  LeadLevel,
} from '../../../types';
import { auditService } from '../../../services/audit';
import { getEventBus } from '../../../events';
import {
  LeadValidationError,
  SpamError,
  LeadNotFoundError,
} from '../errors';

const LEAD_UID = 'api::lead.lead';
const LEAD_SOURCE_TYPES: readonly LeadSourceType[] = ['contact', 'demo', 'chatbot', 'cta'];
const LEAD_STATUSES: readonly LeadStatus[] = ['new', 'processing', 'resolved', 'spam'];
const LEAD_LEVELS: readonly LeadLevel[] = ['cold', 'warm', 'hot'];

export const PUBLIC_LEAD_CREATE_FIELDS = [
  'full_name',
  'email',
  'phone',
  'company',
  'inquiry_type',
  'expected_platform',
  'monthly_orders',
  'message',
] as const;

const MANUAL_LEAD_UPDATE_FIELDS = [
  'full_name',
  'email',
  'phone',
  'company',
  'inquiry_type',
  'expected_platform',
  'monthly_orders',
  'message',
  'status',
] as const;

const SYSTEM_LEAD_UPDATE_FIELDS = ['lead_score', 'lead_level', 'ai_summary'] as const;

type UpdateLeadOptions = {
  allowSystemFields?: boolean;
};

export function pickPublicLeadCreateInput(input: unknown): Partial<CreateLeadInput> {
  return filterAllowedFields(input, PUBLIC_LEAD_CREATE_FIELDS) as Partial<CreateLeadInput>;
}

export default factories.createCoreService(LEAD_UID, ({ strapi }) => ({
  async createLead(input: CreateLeadInput): Promise<any> {
    const sanitized = sanitizeInput(input);
    validateLeadInput(sanitized);

    const lead = await strapi.entityService.create(LEAD_UID, {
      data: {
        ...sanitized,
        status: 'new',
        publishedAt: null,
      },
    });

    await auditService.log({
      lead_id: lead.id,
      action: 'lead_created',
      new_value: sanitized as any,
      metadata: { source_type: sanitized.source_type },
    });

    getEventBus().emit('lead:created', {
      leadId: lead.id,
      sourceType: sanitized.source_type,
      email: sanitized.email,
      fullName: sanitized.full_name,
      phone: sanitized.phone,
      company: sanitized.company,
      inquiryType: sanitized.inquiry_type,
      message: sanitized.message,
      createdAt: new Date().toISOString(),
    });

    return lead;
  },

  async updateLead(id: number, input: UpdateLeadInput, options: UpdateLeadOptions = {}): Promise<any> {
    const existing = await strapi.entityService.findOne(LEAD_UID, id);
    if (!existing) {
      throw new LeadNotFoundError();
    }

    const allowedFields = options.allowSystemFields
      ? [...MANUAL_LEAD_UPDATE_FIELDS, ...SYSTEM_LEAD_UPDATE_FIELDS]
      : [...MANUAL_LEAD_UPDATE_FIELDS];
    const disallowedFields = getDisallowedFields(input, allowedFields);
    if (disallowedFields.length > 0) {
      throw new LeadValidationError(
        'VALIDATION_FIELDS',
        `Fields not allowed for lead update: ${disallowedFields.join(', ')}`
      );
    }

    const filtered = filterAllowedFields(input, allowedFields);
    const sanitized = sanitizeInput(filtered);
    validateLeadUpdateInput(sanitized, options);

    const lead = await strapi.entityService.update(LEAD_UID, id, {
      data: {
        ...sanitized,
        publishedAt: null,
      },
    });

    const changes: Record<string, any> = {};
    for (const key of Object.keys(sanitized)) {
      if ((sanitized as any)[key] !== undefined && (sanitized as any)[key] !== (existing as any)[key]) {
        changes[key] = { from: (existing as any)[key], to: (sanitized as any)[key] };
      }
    }

    if (Object.keys(changes).length > 0) {
      await auditService.log({
        lead_id: id,
        action: 'status_changed',
        previous_value: changes,
        new_value: sanitized as any,
      });

      if (sanitized.status && sanitized.status !== existing.status) {
        getEventBus().emit('lead:status_changed', {
          leadId: id,
          previousStatus: existing.status,
          newStatus: sanitized.status,
        });
      }
    }

    return lead;
  },

  async findById(id: number): Promise<any> {
    return strapi.entityService.findOne(LEAD_UID, id, {
      populate: ['activities', 'notes'],
    });
  },

  async findMany(filters: any, pagination?: any): Promise<any> {
    return strapi.entityService.findMany(LEAD_UID, {
      filters: { ...filters, deleted_at: { $null: true } },
      sort: { created_at: 'desc' },
      populate: ['activities', 'notes'],
      ...pagination,
    });
  },

  async softDelete(id: number): Promise<void> {
    await strapi.entityService.update(LEAD_UID, id, {
      data: {
        deleted_at: new Date().toISOString(),
        publishedAt: null,
      },
    });
  },

  async markSpam(id: number, performedBy?: string): Promise<any> {
    const existing = await strapi.entityService.findOne(LEAD_UID, id);
    if (!existing) throw new LeadNotFoundError();

    const lead = await strapi.entityService.update(LEAD_UID, id, {
      data: {
        status: 'spam',
        publishedAt: null,
      },
    });

    await auditService.log({
      lead_id: id,
      action: 'marked_spam',
      previous_value: { status: existing.status } as any,
      new_value: { status: 'spam' } as any,
      performed_by: performedBy,
    });

    return lead;
  },
}));

function filterAllowedFields(input: unknown, allowedFields: readonly string[]): Record<string, unknown> {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return {};
  }

  const source = input as Record<string, unknown>;
  return allowedFields.reduce<Record<string, unknown>>((acc, field) => {
    if (Object.prototype.hasOwnProperty.call(source, field) && source[field] !== undefined) {
      acc[field] = source[field];
    }
    return acc;
  }, {});
}

function getDisallowedFields(input: unknown, allowedFields: readonly string[]): string[] {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return [];
  }

  const allowed = new Set(allowedFields);
  const source = input as Record<string, unknown>;
  return Object.keys(source).filter((field) => !allowed.has(field) && source[field] !== undefined);
}

function sanitizeInput(input: any): any {
  if (!input || typeof input !== 'object') return {};
  const sanitized: any = {};
  for (const [key, value] of Object.entries(input)) {
    if (value === undefined || value === null) continue;
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

function sanitizeString(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

function validateLeadInput(input: CreateLeadInput): void {
  validateRequiredString(input.full_name, 'VALIDATION_NAME', 'Full name is required');
  validateOptionalString(input.company, 'VALIDATION_COMPANY', 'Company must be a string');
  validateOptionalString(input.inquiry_type, 'VALIDATION_INQUIRY_TYPE', 'Inquiry type must be a string');
  validateOptionalString(
    input.expected_platform,
    'VALIDATION_EXPECTED_PLATFORM',
    'Expected platform must be a string'
  );
  validateOptionalString(input.message, 'VALIDATION_MESSAGE', 'Message must be a string');
  validateOptionalInteger(
    input.monthly_orders,
    'VALIDATION_MONTHLY_ORDERS',
    'Monthly orders must be an integer'
  );

  if (typeof input.email !== 'string' || !isValidEmail(input.email)) {
    throw new LeadValidationError('VALIDATION_EMAIL', 'Invalid email address');
  }
  if (input.phone !== undefined && (typeof input.phone !== 'string' || !isValidPhone(input.phone))) {
    throw new LeadValidationError('VALIDATION_PHONE', 'Invalid phone number');
  }
  if (!LEAD_SOURCE_TYPES.includes(input.source_type)) {
    throw new LeadValidationError('VALIDATION_SOURCE_TYPE', 'Invalid source type');
  }
  if (isSpam(input)) {
    throw new SpamError();
  }
}

function validateLeadUpdateInput(input: UpdateLeadInput, options: UpdateLeadOptions = {}): void {
  if ('full_name' in input) {
    validateRequiredString(input.full_name, 'VALIDATION_NAME', 'Full name is required');
  }

  validateOptionalString(input.company, 'VALIDATION_COMPANY', 'Company must be a string');
  validateOptionalString(input.inquiry_type, 'VALIDATION_INQUIRY_TYPE', 'Inquiry type must be a string');
  validateOptionalString(
    input.expected_platform,
    'VALIDATION_EXPECTED_PLATFORM',
    'Expected platform must be a string'
  );
  validateOptionalString(input.message, 'VALIDATION_MESSAGE', 'Message must be a string');
  validateOptionalInteger(
    input.monthly_orders,
    'VALIDATION_MONTHLY_ORDERS',
    'Monthly orders must be an integer'
  );

  if ('email' in input && (typeof input.email !== 'string' || !isValidEmail(input.email))) {
    throw new LeadValidationError('VALIDATION_EMAIL', 'Invalid email address');
  }
  if ('phone' in input && (typeof input.phone !== 'string' || !isValidPhone(input.phone))) {
    throw new LeadValidationError('VALIDATION_PHONE', 'Invalid phone number');
  }
  if ('status' in input && (!input.status || !LEAD_STATUSES.includes(input.status))) {
    throw new LeadValidationError('VALIDATION_STATUS', 'Invalid lead status');
  }

  if (!options.allowSystemFields) {
    return;
  }

  validateOptionalString(input.ai_summary, 'VALIDATION_AI_SUMMARY', 'AI summary must be a string');

  if (
    'lead_score' in input &&
    (!Number.isInteger(input.lead_score) || input.lead_score! < 0 || input.lead_score! > 100)
  ) {
    throw new LeadValidationError('VALIDATION_LEAD_SCORE', 'Lead score must be an integer between 0 and 100');
  }
  if ('lead_level' in input && (!input.lead_level || !LEAD_LEVELS.includes(input.lead_level))) {
    throw new LeadValidationError('VALIDATION_LEAD_LEVEL', 'Invalid lead level');
  }
}

function validateRequiredString(value: unknown, code: string, message: string): void {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new LeadValidationError(code, message);
  }
}

function validateOptionalString(value: unknown, code: string, message: string): void {
  if (value !== undefined && value !== null && typeof value !== 'string') {
    throw new LeadValidationError(code, message);
  }
}

function validateOptionalInteger(value: unknown, code: string, message: string): void {
  if (value !== undefined && value !== null && !Number.isInteger(value)) {
    throw new LeadValidationError(code, message);
  }
}

function isValidEmail(email: string): boolean {
  const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return re.test(email);
}

function isValidPhone(phone: string): boolean {
  const re = /^[+]?[\d\s()-]{7,20}$/;
  return re.test(phone);
}

function isSpam(input: CreateLeadInput): boolean {
  const spamPatterns = [
    /https?:\/\/[^\s]+/gi,
    /\[url=/gi,
    /<a\s+href/gi,
    /buy\s+now/gi,
    /click\s+here/gi,
    /free\s+money/gi,
    /cheap\s+/gi,
  ];
  const fieldsToCheck = [input.full_name, input.message, input.company].filter(Boolean);
  for (const field of fieldsToCheck) {
    for (const pattern of spamPatterns) {
      if (pattern.test(field!)) return true;
    }
  }
  return false;
}
