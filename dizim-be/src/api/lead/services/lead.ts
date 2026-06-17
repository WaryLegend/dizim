import { factories } from '@strapi/strapi';
import { CreateLeadInput, UpdateLeadInput, LeadStatus, LeadLevel } from '../../../types';
import { auditService } from '../../../services/audit';
import { getEventBus } from '../../../events';
import {
  LeadValidationError,
  SpamError,
  LeadNotFoundError,
} from '../errors';

const LEAD_UID = 'api::lead.lead';

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

  async updateLead(id: number, input: UpdateLeadInput): Promise<any> {
    const existing = await strapi.entityService.findOne(LEAD_UID, id);
    if (!existing) {
      throw new LeadNotFoundError();
    }

    const sanitized = sanitizeInput(input);

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
  if (!input.email || !isValidEmail(input.email)) {
    throw new LeadValidationError('VALIDATION_EMAIL', 'Invalid email address');
  }
  if (input.phone && !isValidPhone(input.phone)) {
    throw new LeadValidationError('VALIDATION_PHONE', 'Invalid phone number');
  }
  if (!input.full_name || input.full_name.trim().length === 0) {
    throw new LeadValidationError('VALIDATION_NAME', 'Full name is required');
  }
  if (!['contact', 'demo', 'chatbot', 'cta'].includes(input.source_type)) {
    throw new LeadValidationError('VALIDATION_SOURCE_TYPE', 'Invalid source type');
  }
  if (isSpam(input)) {
    throw new SpamError();
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
