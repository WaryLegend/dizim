import { Worker, Job } from 'bullmq';
import { connection } from '../queues';
import { createObjectCsvStringifier } from 'csv-writer';
import * as fs from 'fs/promises';
import * as path from 'path';

const EXPORT_DIR = process.env.EXPORT_DIR || path.join(process.cwd(), 'exports');
const LEAD_UID = 'api::lead.lead';

export function createExportWorker(): Worker {
  const worker = new Worker(
    'lead:export',
    async (job: Job) => {
      const { filters, jobId } = job.data;

      console.log(`[ExportWorker] Generating CSV export ${jobId}`);

      await fs.mkdir(EXPORT_DIR, { recursive: true });

      const strapi = (global as any).strapi;
      const queryFilters: any = { deleted_at: { $null: true } };

      if (filters?.source_type) queryFilters.source_type = { $eq: filters.source_type };
      if (filters?.status) queryFilters.status = { $eq: filters.status };
      if (filters?.lead_level) queryFilters.lead_level = { $eq: filters.lead_level };
      if (filters?.from_date) {
        queryFilters.created_at = { ...queryFilters.created_at, $gte: filters.from_date };
      }
      if (filters?.to_date) {
        queryFilters.created_at = { ...queryFilters.created_at, $lte: filters.to_date };
      }

      const leads = await strapi.entityService.findMany(LEAD_UID, {
        filters: queryFilters,
        sort: { created_at: 'desc' },
        limit: -1,
      });

      const csvStringifier = createObjectCsvStringifier({
        header: [
          { id: 'id', title: 'ID' },
          { id: 'source_type', title: 'Source Type' },
          { id: 'full_name', title: 'Full Name' },
          { id: 'email', title: 'Email' },
          { id: 'phone', title: 'Phone' },
          { id: 'company', title: 'Company' },
          { id: 'inquiry_type', title: 'Inquiry Type' },
          { id: 'expected_platform', title: 'Expected Platform' },
          { id: 'monthly_orders', title: 'Monthly Orders' },
          { id: 'status', title: 'Status' },
          { id: 'lead_score', title: 'Lead Score' },
          { id: 'lead_level', title: 'Lead Level' },
          { id: 'ai_summary', title: 'AI Summary' },
          { id: 'created_at', title: 'Created At' },
        ],
      });

      const records = leads.map((lead: any) => ({
        id: lead.id,
        source_type: lead.source_type,
        full_name: lead.full_name,
        email: lead.email,
        phone: lead.phone || '',
        company: lead.company || '',
        inquiry_type: lead.inquiry_type || '',
        expected_platform: lead.expected_platform || '',
        monthly_orders: lead.monthly_orders ?? '',
        status: lead.status,
        lead_score: lead.lead_score ?? '',
        lead_level: lead.lead_level || '',
        ai_summary: lead.ai_summary || '',
        created_at: lead.created_at || '',
      }));

      const csvContent = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(records);
      const filePath = path.join(EXPORT_DIR, `leads-${jobId}.csv`);
      await fs.writeFile(filePath, csvContent, 'utf-8');

      const downloadUrl = `/api/leads/export/download/${jobId}`;

      return {
        jobId,
        status: 'completed',
        downloadUrl,
        recordCount: records.length,
        filePath,
      };
    },
    {
      connection,
      concurrency: 3,
      lockDuration: 120000,
    }
  );

  worker.on('completed', (job: Job) => {
    console.log(`[ExportWorker] CSV export ${job.id} completed`);
  });

  worker.on('failed', (job: Job | undefined, error: Error) => {
    console.error(`[ExportWorker] Export ${job?.id} failed:`, error.message);
  });

  return worker;
}
