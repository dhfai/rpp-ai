import { Field, InputType } from "@nestjs/graphql";
import { IsString, Length } from "class-validator";

@InputType()
export class CreateRppDto {
    @Field()
    @IsString()
    @Length(5, 100, { message: 'Judul harus diantara 5 dan 100 karakter' })
    title: string;
}