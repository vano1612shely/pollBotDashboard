import {
  IsArray,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { MessageType } from '../entities/message.entity';
export class CreateMessageDto {
  @IsString()
  name: string;
  @IsString()
  message: string;

  @IsEnum(MessageType)
  type: MessageType;

  @IsArray()
  @IsOptional()
  buttons: any[][];

  @IsString()
  thx_message: string;
}
