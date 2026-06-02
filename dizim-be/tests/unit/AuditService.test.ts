import { AuditService } from '../../src/services/audit';

const mockStrapi = {
  entityService: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
};

(global as any).strapi = mockStrapi;

describe('AuditService', () => {
  let audit: AuditService;

  beforeEach(() => {
    audit = new AuditService();
    jest.clearAllMocks();
  });

  it('should log an activity', async () => {
    mockStrapi.entityService.create.mockResolvedValue({ id: 1 });

    await audit.log({
      lead_id: 1,
      action: 'lead_created',
      new_value: { source_type: 'contact' } as any,
      performed_by: 'system',
    });

    expect(mockStrapi.entityService.create).toHaveBeenCalledTimes(1);
    expect(mockStrapi.entityService.create).toHaveBeenCalledWith(
      'api::lead-activity.lead-activity',
      expect.objectContaining({
        data: expect.objectContaining({
          lead: 1,
          action: 'lead_created',
        }),
      })
    );
  });

  it('should handle errors gracefully', async () => {
    mockStrapi.entityService.create.mockRejectedValue(new Error('DB error'));
    await expect(
      audit.log({
        lead_id: 1,
        action: 'lead_created',
      })
    ).resolves.not.toThrow();
  });

  it('should find activities by lead id', async () => {
    mockStrapi.entityService.findMany.mockResolvedValue([{ id: 1, action: 'lead_created' }]);
    const activities = await audit.findByLeadId(1);
    expect(activities).toHaveLength(1);
    expect(mockStrapi.entityService.findMany).toHaveBeenCalledWith(
      'api::lead-activity.lead-activity',
      expect.objectContaining({
        filters: { lead: { id: { $eq: 1 } } },
      })
    );
  });
});
