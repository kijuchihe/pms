import { Request, Response, NextFunction } from 'express';
import { redisClient } from '../../config/redis';

interface CacheOptions {
  ttl?: number;
  key?: (req: Request) => string;
}

const defaultKeyGenerator = (req: Request): string => {
  return `${req.method}:${req.originalUrl}`;
};

export const cache = (options: CacheOptions = {}) => {
  const ttl = options.ttl || 300; // Default 5 minutes
  const keyGenerator = options.key || defaultKeyGenerator;

  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET') {
      return next();
    }

    const key = keyGenerator(req);

    try {
      const cachedData = await redisClient.get(key);
      
      if (cachedData) {
        const data = JSON.parse(cachedData);
        return res.json(data);
      }

      // Store original res.json method
      const originalJson = res.json.bind(res);

      // Override res.json method to cache the response
      res.json = ((data: any): Response => {
        // Restore original method
        res.json = originalJson;

        // Cache the data
        redisClient.set(key, JSON.stringify(data), ttl);

        // Send the response
        return originalJson(data);
      }) as any;

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
};

export const clearCache = (pattern: string) => {
  return async (_req: Request, _res: Response, next: NextFunction) => {
    try {
      const client = redisClient.getClient();
      const keys = await client.keys(pattern);
      
      if (keys.length > 0) {
        await client.del(...keys);
      }
      
      next();
    } catch (error) {
      console.error('Clear cache middleware error:', error);
      next();
    }
  };
};
