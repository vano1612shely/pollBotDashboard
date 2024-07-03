import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ChatMessageType } from '../entities/chat.entity';

export class CreateChatMessageDto {
  @IsString()
  message: string;

  @IsEnum(ChatMessageType)
  type: ChatMessageType;

  @IsNumber()
  client_telegram_id: number;

  @IsNumber()
  @IsOptional()
  telegram_message_id?: number;
}
