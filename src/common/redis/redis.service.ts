import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
    });

    this.redis.on('connect', () => console.log('✅ Redis connected'));
    this.redis.on('error', (err) => console.error('❌ Redis error:', err));
  }

  /**
   * Menyimpan pesan percakapan ke Redis (cache sementara).
   */
  async addMessage(sessionId: string, role: 'user' | 'assistant', content: string): Promise<void> {
    const key = `session:${sessionId}`;
    const sessionData = await this.getSession(sessionId);

    sessionData.messages.push({ role, content });

  
    await this.redis.set(key, JSON.stringify(sessionData), 'EX', 60);
  }

  /**
   * Mengambil data percakapan dari Redis berdasarkan sessionId.
   */
  async getSession(sessionId: string): Promise<{ messages: any[], createdAt: string }> {
    const key = `session:${sessionId}`;
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : { messages: [], createdAt: new Date().toISOString() };
  }

  /**
   * Mengakhiri sesi percakapan dan memindahkan data ke MongoDB.
   */
  async endSession(sessionId: string): Promise<any> {
    const key = `session:${sessionId}`;
    const data = await this.redis.get(key);
    if (!data) return null;

    const parsedData = JSON.parse(data);
    await this.redis.del(key);

    return parsedData;
  }

  /**
   * Menutup koneksi Redis saat aplikasi dimatikan.
   */
  onModuleInit() {
    console.log('🔵 RedisService initialized');
  }

  onModuleDestroy() {
    console.log('🛑 Closing Redis connection');
    this.redis.quit();
  }
}
