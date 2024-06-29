import { IsString } from 'class-validator';

export class CreateBotDto {
  @IsString()
  token: string;

  @IsString()
  chat_id: string;
}
