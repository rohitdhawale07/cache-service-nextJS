import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  private cache = new Map<string, any>();

  // Fetch from cache
  @MessagePattern({ cmd: 'get_cache' })
  handleGetCache(@Payload() key: string) {
    const data = this.cache.get(key);
    if (data) {
      this.logger.debug(` Cache HIT for key: ${key}`);
    } else {
      this.logger.debug(` Cache MISS for key: ${key}`);
    }
    return data || null;
  }

  // Store in cache
  @MessagePattern({ cmd: 'set_cache' })
  handleSetCache(@Payload() payload: { key: string; value: any }) {
    this.cache.set(payload.key, payload.value);
    this.logger.debug(`🆕 Stored data in cache for key: ${payload.key}`);
    return true;
  }
}
