import { EventType, EventPayloads } from '../types';

export interface EventBus {
  emit<T extends EventType>(event: T, payload: EventPayloads[T]): void;
  subscribe<T extends EventType>(event: T, handler: (payload: EventPayloads[T]) => void): void;
  unsubscribe<T extends EventType>(event: T, handler: (payload: EventPayloads[T]) => void): void;
}
