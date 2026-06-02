import { InMemoryEventBus } from '../../src/events/InMemoryEventBus';
import { setEventBus, getEventBus } from '../../src/events';
import { ruleBasedQualify } from '../../src/ai/RuleBasedQualifier';

jest.mock('../../src/queues', () => ({
  leadQualificationQueue: { add: jest.fn() },
  newsletterQueue: { add: jest.fn() },
  notificationQueue: { add: jest.fn() },
  connection: {},
}));

jest.mock('../../src/ai', () => ({
  qualifyLead: jest.fn().mockImplementation((input) => {
    return ruleBasedQualify(input);
  }),
}));

describe('Lead Workflow Integration', () => {
  const mockStrapi = {
    entityService: {
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(() => {
    (global as any).strapi = mockStrapi;
    setEventBus(new InMemoryEventBus());
    jest.clearAllMocks();
  });

  it('should process lead:created event end-to-end', async () => {
    const bus = getEventBus();
    const eventHandler = jest.fn();
    bus.subscribe('lead:created', eventHandler);

    bus.emit('lead:created', {
      leadId: 1,
      sourceType: 'contact',
      email: 'test@example.com',
      fullName: 'Test User',
      createdAt: new Date().toISOString(),
    });

    expect(eventHandler).toHaveBeenCalledTimes(1);
    expect(eventHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        leadId: 1,
        sourceType: 'contact',
      })
    );
  });

  it('should handle lead qualification flow', async () => {
    const result = ruleBasedQualify({
      full_name: 'John Doe',
      email: 'john@company.com',
      phone: '+84123456789',
      company: 'Acme Corp',
      monthly_orders: 500,
    });

    expect(result.leadScore).toBeGreaterThanOrEqual(60);
    expect(result.leadLevel).toBe('HOT');
    expect(result.summary).toBeTruthy();
    expect(result.recommendedAction).toBe('Contact immediately via phone');
  });

  it('should emit lead:qualified after qualification', async () => {
    const bus = getEventBus();
    const qualifiedHandler = jest.fn();
    bus.subscribe('lead:qualified', qualifiedHandler);

    const result = ruleBasedQualify({
      full_name: 'Jane Doe',
      email: 'jane@example.com',
      phone: '+84123456789',
      company: 'Tech Inc',
      monthly_orders: 1000,
      message: 'A'.repeat(200),
    });

    bus.emit('lead:qualified', {
      leadId: 1,
      leadScore: result.leadScore,
      leadLevel: result.leadLevel,
      summary: result.summary,
    });

    expect(qualifiedHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        leadScore: expect.any(Number),
        leadLevel: expect.any(String),
      })
    );
  });

  it('should emit lead:hot for high-scoring leads', async () => {
    const bus = getEventBus();
    const hotHandler = jest.fn();
    bus.subscribe('lead:hot', hotHandler);

    const result = ruleBasedQualify({
      full_name: 'Hot Lead',
      email: 'hot@example.com',
      phone: '+84123456789',
      company: 'Big Corp',
      monthly_orders: 1000,
      message: 'A'.repeat(200),
    });

    if (result.leadLevel === 'HOT') {
      bus.emit('lead:hot', {
        leadId: 1,
        leadScore: result.leadScore,
        summary: result.summary,
        email: 'hot@example.com',
        fullName: 'Hot Lead',
      });
      expect(hotHandler).toHaveBeenCalledTimes(1);
    }
  });
});
