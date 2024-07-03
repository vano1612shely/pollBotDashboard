import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatMessageDto } from './dto/create-chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() data: CreateChatMessageDto) {
    console.log(data);
    return await this.chatService.create(data);
  }

  @Get(':id')
  async getMessagesByClient(@Param('id', ParseIntPipe) id: number) {
    return await this.chatService.getByClient(id);
  }

  @Get('/read/:id')
  async readMessages(@Param('id', ParseIntPipe) id: number) {
    return await this.chatService.readMessages(id);
  }
}
