import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat, ChatDocument } from '../schemas/chat.schema';

@Injectable()
export class ChatService {
  constructor(@InjectModel(Chat.name) private chatModel: Model<ChatDocument>) {}

  async saveChat(sessionId: string, userMessage: string, botResponse: string, isSessionEnded = false): Promise<Chat> {
    const chat = new this.chatModel({ sessionId, userMessage, botResponse, isSessionEnded });
    return chat.save();
  }

  async getChatsBySession(sessionId: string): Promise<Chat[]> {
    return this.chatModel.find({ sessionId }).exec();
  }

  async endSession(sessionId: string): Promise<void> {
    await this.chatModel.updateMany({ sessionId }, { isSessionEnded: true });
  }
}
