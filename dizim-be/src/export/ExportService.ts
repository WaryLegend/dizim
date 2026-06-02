import { v4 as uuidv4 } from 'uuid';
import { exportQueue } from '../queues';
import { LeadExportJob, LeadExportFilters } from '../types';
import * as path from 'path';
import * as fs from 'fs/promises';

const EXPORT_DIR = process.env.EXPORT_DIR || path.join(process.cwd(), 'exports');

const jobs = new Map<string, LeadExportJob>();

export class ExportService {
  async createExport(filters: LeadExportFilters): Promise<{ jobId: string }> {
    const jobId = `exp_${uuidv4().replace(/-/g, '').substring(0, 12)}`;

    const job: LeadExportJob = {
      jobId,
      status: 'pending',
      createdAt: new Date(),
      filters,
    };

    jobs.set(jobId, job);

    await exportQueue.add('export:csv', {
      jobId,
      filters,
    });

    return { jobId };
  }

  async getExportStatus(jobId: string): Promise<LeadExportJob | null> {
    const job = jobs.get(jobId);
    if (!job) return null;

    const filePath = path.join(EXPORT_DIR, `leads-${jobId}.csv`);
    try {
      await fs.access(filePath);
      return {
        ...job,
        status: 'completed',
        downloadUrl: `/api/leads/export/download/${jobId}`,
      };
    } catch {
      return job;
    }
  }

  updateJob(jobId: string, update: Partial<LeadExportJob>): void {
    const job = jobs.get(jobId);
    if (job) {
      jobs.set(jobId, { ...job, ...update });
    }
  }

  getDownloadPath(jobId: string): string {
    return path.join(EXPORT_DIR, `leads-${jobId}.csv`);
  }
}

export const exportService = new ExportService();
