import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Conversation extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ type: [{ role: String, content: String }] })
  messages: { role: 'user' | 'assistant'; content: string }[];

  @Prop({ default: new Date().toISOString() })
  createdAt: string;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
