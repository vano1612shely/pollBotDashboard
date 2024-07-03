import {
  Body,
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageEntity, MessageType } from './entities/message.entity';
import { ClientEntity } from '../client/entities/client.entity';
import { ResultsEntity } from './entities/results.entity';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createMessageDto: CreateMessageDto) {
    return await this.messagesService.create(createMessageDto);
  }

  @Get('/')
  async getAll(
    @Query('per_page') per_page: number | null,
    @Query('page') page: number | null,
    @Query('search') search: string | null,
  ): Promise<{ count: number; data: MessageEntity[] }> {
    return await this.messagesService.getAll(per_page, page, search);
  }

  @Get('/archived')
  async getArchived(
    @Query('per_page') per_page: number | null,
    @Query('page') page: number | null,
    @Query('search') search: string | null,
  ): Promise<{ count: number; data: MessageEntity[] }> {
    return await this.messagesService.getAll(per_page, page, search, true);
  }

  @Get('/results/:id')
  async getResults(
    @Query('per_page') per_page: number | null,
    @Query('page') page: number | null,
    @Query('search') search: string | null,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ count: number; data: ResultsEntity[] }> {
    return await this.messagesService.getResults(id, per_page, page, search);
  }
  @Get('/:id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return await this.messagesService.getById(id);
  }
  @Get('/byType/:type')
  async getByType(
    @Param('type', new ParseEnumPipe(MessageType)) type: MessageType,
  ) {
    return await this.messagesService.getByType(type);
  }

  @Post('/send/:id')
  async send(@Param('id', ParseIntPipe) id: number) {
    return await this.messagesService.sendMessage(id);
  }
  @Post('/archive/:id')
  async archive(@Param('id', ParseIntPipe) id: number) {
    return await this.messagesService.archive(id);
  }
}
