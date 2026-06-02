import { InMemoryEventBus } from '../../src/events/InMemoryEventBus';

describe('Rate Limit Performance', () => {
  it('should handle burst of events without crashing', () => {
    const bus = new InMemoryEventBus();
    const handler = jest.fn();
    bus.subscribe('lead:created', handler);

    const eventCount = 1000;
    for (let i = 0; i < eventCount; i++) {
      bus.emit('lead:created', {
        leadId: i,
        sourceType: 'contact',
        email: `user${i}@example.com`,
        fullName: `User ${i}`,
        createdAt: new Date().toISOString(),
      });
    }

    expect(handler).toHaveBeenCalledTimes(eventCount);
  });

  it('should handle multiple event types concurrently', () => {
    const bus = new InMemoryEventBus();
    const createdHandler = jest.fn();
    const qualifiedHandler = jest.fn();
    const hotHandler = jest.fn();

    bus.subscribe('lead:created', createdHandler);
    bus.subscribe('lead:qualified', qualifiedHandler);
    bus.subscribe('lead:hot', hotHandler);

    const eventCount = 500;
    for (let i = 0; i < eventCount; i++) {
      bus.emit('lead:created', {
        leadId: i,
        sourceType: 'contact',
        email: `user${i}@example.com`,
        fullName: `User ${i}`,
        createdAt: new Date().toISOString(),
      });
      bus.emit('lead:qualified', {
        leadId: i,
        leadScore: Math.floor(Math.random() * 100),
        leadLevel: 'HOT',
        summary: 'Qualified',
      });
      bus.emit('lead:hot', {
        leadId: i,
        leadScore: 90,
        summary: 'Hot lead',
        email: `user${i}@example.com`,
        fullName: `User ${i}`,
      });
    }

    expect(createdHandler).toHaveBeenCalledTimes(eventCount);
    expect(qualifiedHandler).toHaveBeenCalledTimes(eventCount);
    expect(hotHandler).toHaveBeenCalledTimes(eventCount);
  });

  it('should handle handler errors without affecting throughput', () => {
    const bus = new InMemoryEventBus();
    const failingHandler = jest.fn().mockImplementation(() => {
      throw new Error('Handler failed');
    });
    const goodHandler = jest.fn();

    bus.subscribe('lead:created', failingHandler);
    bus.subscribe('lead:created', goodHandler);

    for (let i = 0; i < 100; i++) {
      bus.emit('lead:created', {
        leadId: i,
        sourceType: 'contact',
        email: `user${i}@example.com`,
        fullName: `User ${i}`,
        createdAt: new Date().toISOString(),
      });
    }

    expect(goodHandler).toHaveBeenCalledTimes(100);
  });

  it('should cleanup handlers quickly', () => {
    const bus = new InMemoryEventBus();
    const handlers: Array<() => void> = [];

    for (let i = 0; i < 100; i++) {
      const handler = jest.fn();
      handlers.push(handler);
      bus.subscribe('lead:created', handler);
    }

    handlers.forEach((h) => bus.unsubscribe('lead:created', h));

    bus.emit('lead:created', {
      leadId: 1,
      sourceType: 'contact',
      email: 'test@example.com',
      fullName: 'Test',
      createdAt: new Date().toISOString(),
    });

    handlers.forEach((h) => {
      expect(h).not.toHaveBeenCalled();
    });
  });
});
