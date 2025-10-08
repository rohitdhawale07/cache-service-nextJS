import { Injectable, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RedisService } from './redis/redis.service';

@Injectable()
export class CacheService {
    private readonly logger = new Logger(CacheService.name);

    constructor(private readonly redisService: RedisService) { }

    @MessagePattern({ cmd: 'get_cache' })
    async getCache(key: string) {
        return this.redisService.get(key);
    }

    @MessagePattern({ cmd: 'set_cache' })
    async setCache({ key, value, ttl }: { key: string; value: any; ttl?: number }) {
        return this.redisService.set(key, value, ttl);
    }
}
