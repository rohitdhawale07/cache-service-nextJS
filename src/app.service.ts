import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Redis } from 'ioredis';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger(AppService.name);
  private redis: Redis;

  onModuleInit() {
    this.redis = (global as any).redisClient;
    if (!this.redis) {
      this.logger.error('❌ Redis client not initialized');
    } else {
      this.logger.log('✅ Redis client available in service');
    }
  }

  @MessagePattern({ cmd: 'get_cache' })
  async getCache(@Payload() key: string) {
    try {
      const cached = await this.redis.get(key);
      if (cached) {
        this.logger.debug(`📦 Cache HIT for key: ${key}`);
        return JSON.parse(cached);
      }
      this.logger.debug(`🆕 Cache MISS for key: ${key}`);
      return null;
    } catch (err) {
      this.logger.error('❌ Redis get error', err);
      return null;
    }
  }

  @MessagePattern({ cmd: 'set_cache' })
  async setCache(@Payload() data: { key: string; value: any; ttl?: number }) {
    try {
      const ttl = data.ttl || 300; // 5 min
      await this.redis.set(data.key, JSON.stringify(data.value), 'EX', ttl);
      this.logger.debug(`💾 Stored in Redis: ${data.key} (TTL ${ttl}s)`);
      return true;
    } catch (err) {
      this.logger.error('❌ Redis set error', err);
      return false;
    }
  }
}
