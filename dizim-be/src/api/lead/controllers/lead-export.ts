import { Context } from 'koa';
import { exportService } from '../../../export/ExportService';
import { auditService } from '../../../services/audit';
import { LeadExportFilters } from '../../../types';
import * as fs from 'fs/promises';

export default {
  async create(ctx: Context): Promise<void> {
    try {
      const filters: LeadExportFilters = {
        source_type: ctx.request.body?.source_type,
        status: ctx.request.body?.status,
        lead_level: ctx.request.body?.lead_level,
        from_date: ctx.request.body?.from_date,
        to_date: ctx.request.body?.to_date,
      };

      const result = await exportService.createExport(filters);

      await auditService.log({
        lead_id: 0,
        action: 'lead_exported',
        metadata: { filters, jobId: result.jobId },
        performed_by: ctx.state?.user?.email || 'admin',
      });

      ctx.status = 202;
      ctx.body = { jobId: result.jobId };
    } catch (error: any) {
      console.error('[Export] Create error:', error);
      ctx.status = 500;
      ctx.body = { error: 'Failed to create export' };
    }
  },

  async status(ctx: Context): Promise<void> {
    try {
      const { jobId } = ctx.params;
      const job = await exportService.getExportStatus(jobId);

      if (!job) {
        ctx.status = 404;
        ctx.body = { error: 'Export job not found' };
        return;
      }

      ctx.body = {
        jobId: job.jobId,
        status: job.status,
        downloadUrl: job.downloadUrl,
        createdAt: job.createdAt,
        completedAt: job.completedAt,
      };
    } catch (error: any) {
      ctx.status = 500;
      ctx.body = { error: 'Failed to get export status' };
    }
  },

  async download(ctx: Context): Promise<void> {
    try {
      const { jobId } = ctx.params;
      const filePath = exportService.getDownloadPath(jobId);

      try {
        await fs.access(filePath);
      } catch {
        ctx.status = 404;
        ctx.body = { error: 'Export file not found or not yet ready' };
        return;
      }

      ctx.type = 'text/csv';
      ctx.set('Content-Disposition', `attachment; filename="leads-${jobId}.csv"`);
      ctx.body = fs.createReadStream(filePath);
    } catch (error: any) {
      ctx.status = 500;
      ctx.body = { error: 'Failed to download export' };
    }
  },
};
