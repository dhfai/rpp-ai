import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { ConversationService } from './conversation.service';

@Resolver()
export class ConversationResolver {
  constructor(private readonly conversationService: ConversationService) {}

  @Mutation(() => String)
  async endConversation(@Args('sessionId') sessionId: string, @Args('userId') userId: string): Promise<string> {
    await this.conversationService.saveSessionToDatabase(sessionId, userId);
    return `Session ${sessionId} has been saved to MongoDB`;
  }
}
