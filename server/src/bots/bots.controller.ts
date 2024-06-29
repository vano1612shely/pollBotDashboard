import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BotsService } from './bots.service';
import { CreateBotDto } from './dto/create-bot.dto';
import { BotStatus } from './entities/bot.entity';

@Controller('bot')
export class BotsController {
  constructor(private readonly botsService: BotsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createBotDto: CreateBotDto, @Req() req) {
    return await this.botsService.createOrUpdate(createBotDto, req.user_id);
  }

  @Get('/start')
  async start(@Req() req) {
    return await this.botsService.start(req.user_id);
  }

  @Get('/stop')
  async stop(@Req() req) {
    return await this.botsService.stop(req.user_id);
  }

  @Get('/restart')
  async restart(@Req() req) {
    return await this.botsService.restart(req.user_id);
  }

  @Get()
  async getByUser(@Req() req) {
    return await this.botsService.findByUser(req.user_id);
  }
}
