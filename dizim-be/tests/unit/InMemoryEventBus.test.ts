import { InMemoryEventBus } from '../../src/events/InMemoryEventBus';

describe('InMemoryEventBus', () => {
  let bus: InMemoryEventBus;

  beforeEach(() => {
    bus = new InMemoryEventBus();
  });

  it('should emit and receive events', () => {
    const handler = jest.fn();
    bus.subscribe('lead:created', handler);
    bus.emit('lead:created', {
      leadId: 1,
      sourceType: 'contact',
      email: 'test@example.com',
      fullName: 'Test',
      createdAt: new Date().toISOString(),
    });
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should not call unsubscribed handlers', () => {
    const handler = jest.fn();
    bus.subscribe('lead:created', handler);
    bus.unsubscribe('lead:created', handler);
    bus.emit('lead:created', {
      leadId: 1,
      sourceType: 'contact',
      email: 'test@example.com',
      fullName: 'Test',
      createdAt: new Date().toISOString(),
    });
    expect(handler).not.toHaveBeenCalled();
  });

  it('should handle multiple handlers for same event', () => {
    const handler1 = jest.fn();
    const handler2 = jest.fn();
    bus.subscribe('lead:created', handler1);
    bus.subscribe('lead:created', handler2);
    bus.emit('lead:created', {
      leadId: 1,
      sourceType: 'contact',
      email: 'test@example.com',
      fullName: 'Test',
      createdAt: new Date().toISOString(),
    });
    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler2).toHaveBeenCalledTimes(1);
  });

  it('should not throw when emitting with no handlers', () => {
    expect(() => {
      bus.emit('lead:created', {
        leadId: 1,
        sourceType: 'contact',
        email: 'test@example.com',
        fullName: 'Test',
        createdAt: new Date().toISOString(),
      });
    }).not.toThrow();
  });

  it('should continue if one handler throws', () => {
    const handler1 = jest.fn().mockImplementation(() => { throw new Error('Handler error'); });
    const handler2 = jest.fn();
    bus.subscribe('lead:created', handler1);
    bus.subscribe('lead:created', handler2);
    bus.emit('lead:created', {
      leadId: 1,
      sourceType: 'contact',
      email: 'test@example.com',
      fullName: 'Test',
      createdAt: new Date().toISOString(),
    });
    expect(handler2).toHaveBeenCalledTimes(1);
  });
});
