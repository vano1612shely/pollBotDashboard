import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientEntity } from './entities/client.entity';
import { ResultsEntity } from '../messages/entities/results.entity';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get()
  async findAll(
    @Query('per_page') per_page: number | null,
    @Query('page') page: number | null,
    @Query('search') search: string | null,
  ): Promise<{ count: number; data: ClientEntity[] }> {
    const perPage = per_page ? Number(per_page) : 10; // Default value - 10
    const pageNumber = page ? Number(page) : 1; // Default value - 1
    return await this.clientService.findAll(perPage, pageNumber, search);
  }
  @Get('/withMessage')
  async getWithMessage() {
    return await this.clientService.getAllClientsWithLastMessage();
  }
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ClientEntity> {
    return await this.clientService.findOne(+id);
  }
  @Get('/results/:id')
  async getResults(
    @Query('per_page') per_page: number | null,
    @Query('page') page: number | null,
    @Query('search') search: string | null,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ count: number; data: ResultsEntity[] }> {
    return await this.clientService.getResults(id, per_page, page, search);
  }

  @Patch('/activeStatus/:id')
  async setStatus(
    @Param('id') id: string,
    @Body() data: { activeStatus: boolean },
  ): Promise<ClientEntity> {
    return await this.clientService.setStatus(+id, data.activeStatus);
  }

  @Patch('/customName/:id')
  async setName(
    @Param('id') id: string,
    @Body() data: { name: string },
  ): Promise<ClientEntity> {
    return await this.clientService.setCustomName(+id, data.name);
  }

  @Delete('/:id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    return await this.clientService.delete(id);
  }
}
