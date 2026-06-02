export { EventBus } from './EventBus';
export { InMemoryEventBus } from './InMemoryEventBus';
export { RedisEventBus } from './RedisEventBus';

let eventBusInstance: EventBus = new InMemoryEventBus();

export function getEventBus(): EventBus {
  return eventBusInstance;
}

export function setEventBus(bus: EventBus): void {
  eventBusInstance = bus;
}
