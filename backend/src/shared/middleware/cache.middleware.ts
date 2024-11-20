import { Request, Response, NextFunction } from 'express';
import { redisClient } from '../../config/redis';

interface CacheOptions {
  ttl?: number;
  keyGenerator?: (req: Request) => string;
}

type ResponseWithJson = Response & {
  json: (data: any) => Response;
};

const defaultKeyGenerator = (req: Request): string => {
  return `${req.method}:${req.originalUrl}`;
};

export const cache = (options: CacheOptions = {}) => {
  const ttl = options.ttl || 300; // Default 5 minutes
  const keyGenerator = options.keyGenerator || defaultKeyGenerator;

  return async (req: Request, res: ResponseWithJson, next: NextFunction): Promise<void> => {
    if (req.method !== 'GET') {
      // Only cache GET requests
      next();
      return;
    }

    const key = keyGenerator(req);

    try {
      const cachedData = await redisClient.get(key);

      if (cachedData) {
        const data = JSON.parse(cachedData);
        res.json(data);
        return;
      }

      // Store original res.json method
      const originalJson = res.json.bind(res);

      // Override res.json method to cache the response
      res.json = ((data: any) => {
        // Restore original method
        res.json = originalJson;

        // Cache the data
        redisClient.set(key, JSON.stringify(data), ttl);

        // Send the response
        return originalJson(data);
      }) as Response['json'];

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
};

export const clearCache = (pattern: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const client = redisClient.getClient();
      const keys = await client.keys(pattern);

      if (keys.length > 0) {
        await Promise.all(keys.map(key => client.del(key)));
      }

      next();
    } catch (error) {
      console.error('Clear cache error:', error);
      next();
    }
  };
};
