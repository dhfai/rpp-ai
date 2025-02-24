import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ValidationPipe } from '@nestjs/common';
import { rppService } from './rpp.service';
import { Rpp } from './dto/rpp.model';
import { CreateRppDto } from './dto/create-rpp.dto';

@Resolver()
export class rppResolver {
  constructor(private readonly rppService: rppService) {}

  @Mutation(() => Rpp)
  async generateRpp(
    @Args('input', { type: () => CreateRppDto }, new ValidationPipe()) input: CreateRppDto,
  ): Promise<Rpp> {
    return this.rppService.generateRpp(input);
  }

  @Query(() => [Rpp])
  async getAllrpp() {
    return this.rppService.getAllrpp();
  }

  @Mutation(() => String)
  async endrppSession(@Args('sessionId') sessionId: string): Promise<string> {
    await this.rppService.endrppSession(sessionId);
    return `Sesi ${sessionId} telah diakhiri dan data dipindahkan ke MongoDB`;
  }
}
