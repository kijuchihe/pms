import Redis from 'ioredis';
import { InternalServerException } from '../shared/exceptions';
import 'dotenv/config'

class RedisClient {
  private static instance: RedisClient;
  private client: Redis;

  private constructor() {
    this.client = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      retryStrategy: (times) => {
        // Maximum retry delay is 3000ms
        return Math.min(times * 50, 3000);
      },
    });

    this.client.on('error', (err) => {
      console.error('Redis Client Error:', err);
      throw new InternalServerException('Redis connection error');
    });

    this.client.on('connect', () => {
      console.log('Redis Client Connected');
    });
  }

  public static getInstance(): RedisClient {
    if (!RedisClient.instance) {
      RedisClient.instance = new RedisClient();
    }
    return RedisClient.instance;
  }

  public getClient(): Redis {
    return this.client;
  }

  public async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  public async set(key: string, value: string, ttl?: number): Promise<'OK'> {
    if (ttl) {
      return this.client.set(key, value, 'EX', ttl);
    }
    return this.client.set(key, value);
  }

  public async del(key: string): Promise<number> {
    return this.client.del(key);
  }

  public async flushAll(): Promise<'OK'> {
    return this.client.flushall();
  }
}

export const redisClient = RedisClient.getInstance();