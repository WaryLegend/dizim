import { CreateActivityInput, LeadActivityAction } from '../types';

const AUDIT_SERVICE_UID = 'api::lead-activity.lead-activity';

export class AuditService {
  async log(input: CreateActivityInput): Promise<void> {
    try {
      const strapi = getStrapi();
      await strapi.entityService.create(AUDIT_SERVICE_UID, {
        data: {
          lead: input.lead_id,
          action: input.action,
          previous_value: input.previous_value ? JSON.parse(JSON.stringify(input.previous_value)) : null,
          new_value: input.new_value ? JSON.parse(JSON.stringify(input.new_value)) : null,
          performed_by: input.performed_by || 'system',
          metadata: input.metadata ? JSON.parse(JSON.stringify(input.metadata)) : null,
          publishedAt: null,
        },
      });
    } catch (error) {
      console.error('[AuditService] Failed to log activity:', error);
    }
  }

  async findByLeadId(leadId: number): Promise<any[]> {
    const strapi = getStrapi();
    return strapi.entityService.findMany(AUDIT_SERVICE_UID, {
      filters: { lead: { id: { $eq: leadId } } },
      sort: { created_at: 'desc' },
      limit: 100,
    });
  }
}

function getStrapi(): any {
  return (global as any).strapi;
}

export const auditService = new AuditService();
