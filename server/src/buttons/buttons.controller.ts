import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ButtonsService } from './buttons.service';
import { CreateButtonDto } from './dto/create-button.dto';
import { ResultsEntity } from '../messages/entities/results.entity';
import { ButtonEntity } from './entities/button.entity';

@Controller('buttons')
export class ButtonsController {
  constructor(private readonly buttonsService: ButtonsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() data: CreateButtonDto) {
    return await this.buttonsService.create(data);
  }

  @Get()
  async getAll(
    @Query('per_page') per_page: number | null,
    @Query('page') page: number | null,
    @Query('search') search: string | null,
  ): Promise<{ count: number; data: ButtonEntity[] }> {
    return await this.buttonsService.getAll(per_page, page, search);
  }

  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    return await this.buttonsService.getById(id);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.buttonsService.delete(id);
  }
}
