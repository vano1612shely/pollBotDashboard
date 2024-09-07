import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { MessageType } from '../entities/message.entity';
export class CreateMessageDto {
  @IsOptional()
  @IsString()
  name: string;
  @IsString()
  message: string;

  @IsString()
  @IsOptional()
  message_img?: string;

  @IsEnum(MessageType)
  type: MessageType;

  @IsArray()
  @IsOptional()
  buttons: any[][];

  @IsOptional()
  @IsString()
  thx_message: string;

  @IsString()
  @IsOptional()
  thx_img?: string;
}
