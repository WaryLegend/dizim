import { factories } from '@strapi/strapi';
import { Context } from 'koa';
import { CreateLeadInput, UpdateLeadInput, LeadExportFilters } from '../../../types';

const LEAD_SERVICE = 'api::lead.lead';
const LEAD_NOTE_SERVICE = 'api::lead-note.lead-note';
const AUDIT_SERVICE = 'api::lead-activity.lead-activity';

export default factories.createCoreController(LEAD_SERVICE, ({ strapi }) => ({
  async contact(ctx: Context): Promise<void> {
    try {
      const input: CreateLeadInput = {
        ...(ctx.request.body as any),
        source_type: 'contact',
      };
      const lead = await strapi.service(LEAD_SERVICE).createLead(input);
      ctx.status = 201;
      ctx.body = { data: lead, message: 'Contact request received successfully' };
    } catch (error: any) {
      handleError(ctx, error);
    }
  },

  async demo(ctx: Context): Promise<void> {
    try {
      const input: CreateLeadInput = {
        ...(ctx.request.body as any),
        source_type: 'demo',
      };
      const lead = await strapi.service(LEAD_SERVICE).createLead(input);
      ctx.status = 201;
      ctx.body = { data: lead, message: 'Demo request received successfully' };
    } catch (error: any) {
      handleError(ctx, error);
    }
  },

  async chatbot(ctx: Context): Promise<void> {
    try {
      const input: CreateLeadInput = {
        ...(ctx.request.body as any),
        source_type: 'chatbot',
      };
      const lead = await strapi.service(LEAD_SERVICE).createLead(input);
      ctx.status = 201;
      ctx.body = { data: lead, message: 'Chatbot lead received successfully' };
    } catch (error: any) {
      handleError(ctx, error);
    }
  },

  async cta(ctx: Context): Promise<void> {
    try {
      const input: CreateLeadInput = {
        ...(ctx.request.body as any),
        source_type: 'cta',
      };
      const lead = await strapi.service(LEAD_SERVICE).createLead(input);
      ctx.status = 201;
      ctx.body = { data: lead, message: 'CTA lead received successfully' };
    } catch (error: any) {
      handleError(ctx, error);
    }
  },

  async find(ctx: Context): Promise<void> {
    try {
      const { query } = ctx;
      const filters: any = {};
      if (query.source_type) filters.source_type = { $eq: query.source_type };
      if (query.status) filters.status = { $eq: query.status };
      if (query.lead_level) filters.lead_level = { $eq: query.lead_level };
      if (query.search) {
        filters.$or = [
          { full_name: { $containsi: query.search } },
          { email: { $containsi: query.search } },
          { company: { $containsi: query.search } },
        ];
      }

      const leads = await strapi.service(LEAD_SERVICE).findMany(filters, {
        start: parseInt(query._start as string) || 0,
        limit: parseInt(query._limit as string) || 25,
      });

      ctx.body = { data: leads };
    } catch (error: any) {
      handleError(ctx, error);
    }
  },

  async findOne(ctx: Context): Promise<void> {
    try {
      const { id } = ctx.params;
      const lead = await strapi.service(LEAD_SERVICE).findById(parseInt(id));
      if (!lead) {
        ctx.status = 404;
        ctx.body = { error: 'Lead not found' };
        return;
      }
      ctx.body = { data: lead };
    } catch (error: any) {
      handleError(ctx, error);
    }
  },

  async update(ctx: Context): Promise<void> {
    try {
      const { id } = ctx.params;
      const input: UpdateLeadInput = ctx.request.body as any;
      const lead = await strapi.service(LEAD_SERVICE).updateLead(parseInt(id), input);
      ctx.body = { data: lead };
    } catch (error: any) {
      handleError(ctx, error);
    }
  },

  async delete(ctx: Context): Promise<void> {
    try {
      const { id } = ctx.params;
      await strapi.service(LEAD_SERVICE).softDelete(parseInt(id));
      ctx.status = 204;
    } catch (error: any) {
      handleError(ctx, error);
    }
  },

  async addNote(ctx: Context): Promise<void> {
    try {
      const { id } = ctx.params;
      const { note } = ctx.request.body as any;
      if (!note) {
        ctx.status = 400;
        ctx.body = { error: 'Note is required' };
        return;
      }

      const leadNote = await strapi.entityService.create(LEAD_NOTE_SERVICE, {
        data: {
          lead: parseInt(id),
          note,
          created_by: ctx.state?.user?.email || 'admin',
          publishedAt: null,
        },
      });

      await strapi.service(AUDIT_SERVICE).log({
        lead_id: parseInt(id),
        action: 'notes_added',
        new_value: { note } as any,
        performed_by: ctx.state?.user?.email || 'admin',
      });

      ctx.status = 201;
      ctx.body = { data: leadNote };
    } catch (error: any) {
      handleError(ctx, error);
    }
  },

  async markSpam(ctx: Context): Promise<void> {
    try {
      const { id } = ctx.params;
      const lead = await strapi.service(LEAD_SERVICE).markSpam(
        parseInt(id),
        ctx.state?.user?.email || 'admin'
      );
      ctx.body = { data: lead };
    } catch (error: any) {
      handleError(ctx, error);
    }
  },

  async requalify(ctx: Context): Promise<void> {
    try {
      const { id } = ctx.params;
      const lead = await strapi.service(LEAD_SERVICE).findById(parseInt(id));
      if (!lead) {
        ctx.status = 404;
        ctx.body = { error: 'Lead not found' };
        return;
      }

      const { qualifyLead } = await import('../../../ai');
      const result = await qualifyLead({
        full_name: lead.full_name,
        email: lead.email,
        company: lead.company,
        monthly_orders: lead.monthly_orders,
        message: lead.message,
      });

      const updated = await strapi.service(LEAD_SERVICE).updateLead(parseInt(id), {
        lead_score: result.leadScore,
        lead_level: result.leadLevel.toLowerCase() as any,
        ai_summary: result.summary,
      });

      const { getEventBus } = await import('../../../events');
      getEventBus().emit('lead:requalified', {
        leadId: parseInt(id),
        leadScore: result.leadScore,
        leadLevel: result.leadLevel,
        summary: result.summary,
        previousLevel: lead.lead_level,
      });

      ctx.body = { data: updated };
    } catch (error: any) {
      handleError(ctx, error);
    }
  },
}));

function handleError(ctx: Context, error: any): void {
  const message = error.message || 'Internal server error';
  switch (message) {
    case 'INVALID_EMAIL':
      ctx.status = 400;
      ctx.body = { error: 'Invalid email address' };
      break;
    case 'INVALID_PHONE':
      ctx.status = 400;
      ctx.body = { error: 'Invalid phone number' };
      break;
    case 'INVALID_NAME':
      ctx.status = 400;
      ctx.body = { error: 'Full name is required' };
      break;
    case 'INVALID_SOURCE_TYPE':
      ctx.status = 400;
      ctx.body = { error: 'Invalid source type' };
      break;
    case 'SPAM_DETECTED':
      ctx.status = 400;
      ctx.body = { error: 'Message flagged as spam' };
      break;
    case 'Lead not found':
      ctx.status = 404;
      ctx.body = { error: 'Lead not found' };
      break;
    default:
      ctx.status = 500;
      ctx.body = { error: 'Internal server error' };
  }
}
