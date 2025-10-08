import { Global, Module } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisService } from './redis.service';

@Global() // makes it available everywhere without importing
@Module({
    providers: [
        {
            provide: 'REDIS_CLIENT',
            useFactory: async () => {
                const redis = new Redis({
                    host: '127.0.0.1',
                    port: 6379,
                });

                redis.on('connect', () => console.log('✅ Connected to Redis'));
                redis.on('error', (err) => console.error('❌ Redis error:', err));

                return redis;
            },
        },
        RedisService,
    ],
    exports: ['REDIS_CLIENT', RedisService],
})
export class RedisModule { }
