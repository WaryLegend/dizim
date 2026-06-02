import { ExportService } from '../../src/export/ExportService';

jest.mock('../../src/queues', () => ({
  exportQueue: {
    add: jest.fn().mockResolvedValue({ id: 'mock-job-id' }),
  },
}));

describe('ExportService', () => {
  let service: ExportService;

  beforeEach(() => {
    service = new ExportService();
  });

  it('should create an export job', async () => {
    const result = await service.createExport({});
    expect(result.jobId).toBeDefined();
    expect(result.jobId).toMatch(/^exp_/);
  });

  it('should return pending status for new jobs', async () => {
    const { jobId } = await service.createExport({ status: 'new' });
    const job = await service.getExportStatus(jobId);
    expect(job).toBeDefined();
    expect(job!.status).toBe('pending');
    expect(job!.filters).toEqual({ status: 'new' });
  });

  it('should return null for unknown job ids', async () => {
    const job = await service.getExportStatus('nonexistent');
    expect(job).toBeNull();
  });

  it('should update job status', async () => {
    const { jobId } = await service.createExport({});
    service.updateJob(jobId, { status: 'completed', downloadUrl: '/test.csv' });
    const job = await service.getExportStatus(jobId);
    expect(job!.status).toBe('completed');
  });
});
