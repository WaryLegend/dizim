import { Context } from 'koa';
import { LeadExportFilters } from '../../../../types';

const LEAD_UID = 'api::lead.lead';
const NOTE_UID = 'api::lead-note.lead-note';

export default {
  async stats(ctx: Context): Promise<void> {
    try {
      const strapi = (global as any).strapi;

      const allLeads = await strapi.entityService.findMany(LEAD_UID, {
        filters: { deleted_at: { $null: true } },
        limit: -1,
      });

      const stats: any = {
        total: allLeads.length,
        today: 0,
        byStatus: { new: 0, processing: 0, resolved: 0, spam: 0 },
        byLevel: { cold: 0, warm: 0, hot: 0 },
        bySource: { contact: 0, demo: 0, chatbot: 0, cta: 0 },
      };

      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      for (const lead of allLeads) {
        if (lead.status) stats.byStatus[lead.status] = (stats.byStatus[lead.status] || 0) + 1;
        if (lead.lead_level) stats.byLevel[lead.lead_level] = (stats.byLevel[lead.lead_level] || 0) + 1;
        if (lead.source_type) stats.bySource[lead.source_type] = (stats.bySource[lead.source_type] || 0) + 1;

        const created = new Date(lead.created_at);
        if (created >= todayStart) stats.today++;
      }

      ctx.body = stats;
    } catch (error: any) {
      ctx.status = 500;
      ctx.body = { error: 'Failed to fetch stats' };
    }
  },

  async find(ctx: Context): Promise<void> {
    try {
      const strapi = (global as any).strapi;
      const { query } = ctx;

      const filters: any = { deleted_at: { $null: true } };
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

      const leads = await strapi.entityService.findMany(LEAD_UID, {
        filters,
        sort: { created_at: 'desc' },
        start: parseInt(query._start as string) || 0,
        limit: parseInt(query._limit as string) || 25,
      });

      ctx.body = { data: leads };
    } catch (error: any) {
      ctx.status = 500;
      ctx.body = { error: 'Failed to fetch leads' };
    }
  },

  async findOne(ctx: Context): Promise<void> {
    try {
      const strapi = (global as any).strapi;
      const { id } = ctx.params;

      const lead = await strapi.entityService.findOne(LEAD_UID, parseInt(id), {
        populate: ['activities', 'notes'],
      });

      if (!lead) {
        ctx.status = 404;
        ctx.body = { error: 'Lead not found' };
        return;
      }

      ctx.body = { data: lead };
    } catch (error: any) {
      ctx.status = 500;
      ctx.body = { error: 'Failed to fetch lead' };
    }
  },

  async update(ctx: Context): Promise<void> {
    try {
      const strapi = (global as any).strapi;
      const { id } = ctx.params;
      const data = ctx.request.body as any;

      const lead = await strapi.service(LEAD_UID).updateLead(parseInt(id), data);

      ctx.body = { data: lead };
    } catch (error: any) {
      const status = error?.name === 'LeadValidationError' ? 400 : error?.name === 'LeadNotFoundError' ? 404 : 500;
      ctx.status = status;
      ctx.body = { error: status === 500 ? 'Failed to update lead' : error.message };
    }
  },

  async addNote(ctx: Context): Promise<void> {
    try {
      const strapi = (global as any).strapi;
      const { id } = ctx.params;
      const { note } = ctx.request.body as any;

      if (!note) {
        ctx.status = 400;
        ctx.body = { error: 'Note is required' };
        return;
      }

      const leadNote = await strapi.entityService.create(NOTE_UID, {
        data: {
          lead: parseInt(id),
          note,
          created_by: ctx.state?.user?.email || 'admin',
          publishedAt: null,
        },
      });

      ctx.status = 201;
      ctx.body = { data: leadNote };
    } catch (error: any) {
      ctx.status = 500;
      ctx.body = { error: 'Failed to add note' };
    }
  },

  async requalify(ctx: Context): Promise<void> {
    try {
      const strapi = (global as any).strapi;
      const { id } = ctx.params;

      const lead = await strapi.entityService.findOne(LEAD_UID, parseInt(id));
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

      const updated = await strapi.entityService.update(LEAD_UID, parseInt(id), {
        data: {
          lead_score: result.leadScore,
          lead_level: result.leadLevel.toLowerCase(),
          ai_summary: result.summary,
          publishedAt: null,
        },
      });

      ctx.body = { data: updated };
    } catch (error: any) {
      ctx.status = 500;
      ctx.body = { error: 'Requalification failed' };
    }
  },

  async markSpam(ctx: Context): Promise<void> {
    try {
      const strapi = (global as any).strapi;
      const { id } = ctx.params;

      const lead = await strapi.entityService.update(LEAD_UID, parseInt(id), {
        data: { status: 'spam', publishedAt: null },
      });

      ctx.body = { data: lead };
    } catch (error: any) {
      ctx.status = 500;
      ctx.body = { error: 'Failed to mark as spam' };
    }
  },

  async export(ctx: Context): Promise<void> {
    try {
      const ownerId = getAuthenticatedUserId(ctx);
      if (ownerId === null) {
        ctx.status = 401;
        ctx.body = { error: 'Authentication required' };
        return;
      }

      const { ExportService } = await import('../../../export/ExportService');
      const exportService = new ExportService();
      const filters: LeadExportFilters = {
        source_type: ctx.request.body?.source_type,
        status: ctx.request.body?.status,
        lead_level: ctx.request.body?.lead_level,
        from_date: ctx.request.body?.from_date,
        to_date: ctx.request.body?.to_date,
      };
      const result = await exportService.createExport(filters, ownerId);
      ctx.status = 202;
      ctx.body = { jobId: result.jobId };
    } catch (error: any) {
      ctx.status = 500;
      ctx.body = { error: 'Failed to start export' };
    }
  },
};

function getAuthenticatedUserId(ctx: Context): number | null {
  const userId = ctx.state?.user?.id;
  const normalizedUserId =
    typeof userId === 'number'
      ? userId
      : typeof userId === 'string'
        ? Number.parseInt(userId, 10)
        : Number.NaN;

  return Number.isInteger(normalizedUserId) ? normalizedUserId : null;
}
