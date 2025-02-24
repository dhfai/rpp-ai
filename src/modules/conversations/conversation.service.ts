import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Conversation } from './conversation.schema';
import { RedisService } from '../../common/redis/redis.service';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversation.name) private conversationModel: Model<Conversation>,
    private readonly redisService: RedisService,
  ) {}

  async saveSessionToDatabase(sessionId: string, userId: string): Promise<void> {
    const sessionData = await this.redisService.endSession(sessionId);
    if (!sessionData) return;

    await this.conversationModel.create({
      userId,
      messages: sessionData.messages,
      createdAt: sessionData.createdAt,
    });

    console.log(`💾 Session ${sessionId} saved to MongoDB`);
  }
}
