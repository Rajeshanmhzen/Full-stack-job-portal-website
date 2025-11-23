import { createClient } from 'redis';

class CacheManager {
  constructor() {
    this.client = null;
    this.memoryCache = new Map();
    this.isRedisConnected = false;
  }

  async init() {
    try {
      // Try to connect to Redis (optional)
      this.client = createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379'
      });
      
      await this.client.connect();
      this.isRedisConnected = true;
      console.log('✅ Redis cache connected');
    } catch (error) {
      console.log('⚠️  Redis not available, using memory cache');
      this.isRedisConnected = false;
    }
  }

  async get(key) {
    try {
      if (this.isRedisConnected) {
        const data = await this.client.get(key);
        return data ? JSON.parse(data) : null;
      } else {
        // Fallback to memory cache
        const cached = this.memoryCache.get(key);
        if (cached && Date.now() - cached.timestamp < cached.ttl) {
          return cached.data;
        }
        this.memoryCache.delete(key);
        return null;
      }
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key, data, ttlSeconds = 300) {
    try {
      if (this.isRedisConnected) {
        await this.client.setEx(key, ttlSeconds, JSON.stringify(data));
      } else {
        // Fallback to memory cache
        this.memoryCache.set(key, {
          data,
          timestamp: Date.now(),
          ttl: ttlSeconds * 1000
        });
        
        // Clean old entries
        if (this.memoryCache.size > 100) {
          this.cleanMemoryCache();
        }
      }
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async del(key) {
    try {
      if (this.isRedisConnected) {
        await this.client.del(key);
      } else {
        this.memoryCache.delete(key);
      }
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  cleanMemoryCache() {
    const now = Date.now();
    for (const [key, value] of this.memoryCache.entries()) {
      if (now - value.timestamp > value.ttl) {
        this.memoryCache.delete(key);
      }
    }
  }

  generateKey(prefix, params) {
    return `${prefix}:${JSON.stringify(params)}`;
  }
}

const cache = new CacheManager();
export default cache;