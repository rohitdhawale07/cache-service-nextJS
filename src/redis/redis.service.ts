import { Inject, Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
    private readonly logger = new Logger(RedisService.name);

    constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) { }

    async get(key: string) {
        const value = await this.redis.get(key);
        if (value) {
            this.logger.debug(`Fetched data for key: ${key}`);
            return JSON.parse(value);
        }
        this.logger.debug(`No cache found for key: ${key}`);
        return null;
    }

    async set(key: string, value: any, ttl = 60) {
        await this.redis.set(key, JSON.stringify(value), 'EX', ttl);
        this.logger.debug(`Stored data with key: ${key}`);
        return true;
    }
}
