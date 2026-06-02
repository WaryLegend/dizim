import { factories } from '@strapi/strapi';
import { CreateActivityInput } from '../../../types';

const ACTIVITY_UID = 'api::lead-activity.lead-activity';

export default factories.createCoreService(ACTIVITY_UID, ({ strapi }) => ({
  async log(input: CreateActivityInput): Promise<any> {
    return strapi.entityService.create(ACTIVITY_UID, {
      data: {
        lead: input.lead_id,
        action: input.action,
        previous_value: input.previous_value || null,
        new_value: input.new_value || null,
        performed_by: input.performed_by || 'system',
        metadata: input.metadata || null,
        publishedAt: null,
      },
    });
  },

  async findByLead(leadId: number): Promise<any[]> {
    return strapi.entityService.findMany(ACTIVITY_UID, {
      filters: { lead: { id: { $eq: leadId } } },
      sort: { createdAt: 'desc' },
      limit: 100,
    });
  },
}));
