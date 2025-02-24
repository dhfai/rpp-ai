import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChatDocument = Chat & Document;

@Schema({ timestamps: true }) // Tambahkan timestamps untuk createdAt & updatedAt
export class Chat {
  @Prop({ required: true })
  sessionId: string;

  @Prop({ required: true })
  userMessage: string;

  @Prop({ required: true })
  botResponse: string;

  @Prop({ default: false }) // Menandakan apakah sesi sudah berakhir
  isSessionEnded: boolean;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
