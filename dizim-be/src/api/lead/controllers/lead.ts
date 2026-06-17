import { factories } from '@strapi/strapi';
import { Context } from 'koa';
import { CreateLeadInput, UpdateLeadInput, LeadExportFilters } from '../../../types';
import {
  LeadValidationError,
  SpamError,
  LeadNotFoundError,
} from '../errors';

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
      await strapi.service(LEAD_SERVICE).createLead(input);
      sendSuccess(ctx, 201, 'Contact request received successfully');
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
      await strapi.service(LEAD_SERVICE).createLead(input);
      sendSuccess(ctx, 201, 'Demo request received successfully');
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
      await strapi.service(LEAD_SERVICE).createLead(input);
      sendSuccess(ctx, 201, 'Chatbot lead received successfully');
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
      await strapi.service(LEAD_SERVICE).createLead(input);
      sendSuccess(ctx, 201, 'CTA lead received successfully');
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

      ctx.body = { success: true, data: leads };
    } catch (error: any) {
      handleError(ctx, error);
    }
  },

  async findOne(ctx: Context): Promise<void> {
    try {
      const { id } = ctx.params;
      const lead = await strapi.service(LEAD_SERVICE).findById(parseInt(id));
      if (!lead) {
        sendError(ctx, 404, 'NOT_FOUND', 'Lead not found');
        return;
      }
      ctx.body = { success: true, data: lead };
    } catch (error: any) {
      handleError(ctx, error);
    }
  },

  async update(ctx: Context): Promise<void> {
    try {
      const { id } = ctx.params;
      const input: UpdateLeadInput = ctx.request.body as any;
      const lead = await strapi.service(LEAD_SERVICE).updateLead(parseInt(id), input);
      ctx.body = { success: true, data: lead };
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
        sendError(ctx, 400, 'VALIDATION_NOTE', 'Note is required');
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
      ctx.body = { success: true, data: leadNote };
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
      ctx.body = { success: true, data: lead };
    } catch (error: any) {
      handleError(ctx, error);
    }
  },

  async requalify(ctx: Context): Promise<void> {
    try {
      const { id } = ctx.params;
      const lead = await strapi.service(LEAD_SERVICE).findById(parseInt(id));
      if (!lead) {
        sendError(ctx, 404, 'NOT_FOUND', 'Lead not found');
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

      ctx.body = { success: true, data: updated };
    } catch (error: any) {
      handleError(ctx, error);
    }
  },
}));

/**
 * Send a standardized success response.
 */
function sendSuccess(ctx: Context, status: number, message: string): void {
  ctx.status = status;
  ctx.body = { success: true, message };
}

/**
 * Send a standardized error response.
 */
function sendError(ctx: Context, status: number, code: string, message: string): void {
  ctx.status = status;
  ctx.body = {
    error: { code, success: false, message },
  };
}

/**
 * Map typed errors to standardized error responses.
 * Checks error class/type rather than string-matching on message.
 */
function handleError(ctx: Context, error: any): void {
  if (error instanceof LeadValidationError) {
    sendError(ctx, 400, error.code, error.message);
  } else if (error instanceof SpamError) {
    sendError(ctx, 400, 'SPAM_DETECTED', error.message);
  } else if (error instanceof LeadNotFoundError) {
    sendError(ctx, 404, 'NOT_FOUND', error.message);
  } else {
    console.error('[LeadController] Unhandled error:', error);
    sendError(ctx, 500, 'INTERNAL_ERROR', 'Internal server error');
  }
}
