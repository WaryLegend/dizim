import { EventType, EventPayloads } from '../types';
import { EventBus } from './EventBus';
import Redis from 'ioredis';

type Handler<T extends EventType> = (payload: EventPayloads[T]) => void;

export class RedisEventBus implements EventBus {
  private redis: Redis;
  private pub: Redis;
  private sub: Redis;
  private handlers: Map<string, Set<Handler<any>>> = new Map();
  private channelPrefix = 'dizim:event:';

  constructor(redisUrl: string) {
    this.redis = new Redis(redisUrl);
    this.pub = new Redis(redisUrl);
    this.sub = new Redis(redisUrl);
    this.setupListener();
  }

  private setupListener(): void {
    this.sub.on('message', (channel: string, message: string) => {
      const event = channel.replace(this.channelPrefix, '') as EventType;
      const handlers = this.handlers.get(event);
      if (!handlers) return;
      const payload = JSON.parse(message);
      for (const handler of handlers) {
        try {
          handler(payload);
        } catch (error) {
          console.error(`[RedisEventBus] Error in handler for event "${event}":`, error);
        }
      }
    });
  }

  emit<T extends EventType>(event: T, payload: EventPayloads[T]): void {
    const channel = `${this.channelPrefix}${event}`;
    const message = JSON.stringify(payload);
    this.pub.publish(channel, message);
  }

  subscribe<T extends EventType>(event: T, handler: Handler<T>): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
      const channel = `${this.channelPrefix}${event}`;
      this.sub.subscribe(channel);
    }
    this.handlers.get(event)!.add(handler);
  }

  unsubscribe<T extends EventType>(event: T, handler: Handler<T>): void {
    const handlers = this.handlers.get(event);
    if (!handlers) return;
    handlers.delete(handler);
    if (handlers.size === 0) {
      this.handlers.delete(event);
      const channel = `${this.channelPrefix}${event}`;
      this.sub.unsubscribe(channel);
    }
  }

  async disconnect(): Promise<void> {
    await Promise.all([
      this.redis.quit(),
      this.pub.quit(),
      this.sub.quit(),
    ]);
  }
}
