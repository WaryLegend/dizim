import { EventType, EventPayloads } from '../types';
import { EventBus } from './EventBus';

type Handler<T extends EventType> = (payload: EventPayloads[T]) => void;

export class InMemoryEventBus implements EventBus {
  private handlers: Map<string, Set<Handler<any>>> = new Map();

  emit<T extends EventType>(event: T, payload: EventPayloads[T]): void {
    const handlers = this.handlers.get(event);
    if (!handlers) return;
    for (const handler of handlers) {
      try {
        handler(payload);
      } catch (error) {
        console.error(`[InMemoryEventBus] Error in handler for event "${event}":`, error);
      }
    }
  }

  subscribe<T extends EventType>(event: T, handler: Handler<T>): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);
  }

  unsubscribe<T extends EventType>(event: T, handler: Handler<T>): void {
    const handlers = this.handlers.get(event);
    if (!handlers) return;
    handlers.delete(handler);
    if (handlers.size === 0) {
      this.handlers.delete(event);
    }
  }

  clear(): void {
    this.handlers.clear();
  }
}
