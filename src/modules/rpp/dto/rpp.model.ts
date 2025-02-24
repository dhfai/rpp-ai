import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Rpp {
  @Field(() => Int)
  id: number;

  @Field()
  sessionId: string; // ID untuk sesi percakapan

  @Field()
  title: string;

  @Field()
  content: string;
}
