import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientEntity } from './entities/client.entity';
import { Like, Repository } from 'typeorm';
import { ResultsEntity } from '../messages/entities/results.entity';
import { ChatEntity } from '../chat/entities/chat.entity';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(ClientEntity)
    private readonly clientRepository: Repository<ClientEntity>,
    @InjectRepository(ResultsEntity)
    private readonly resultsRepository: Repository<ResultsEntity>,

    @InjectRepository(ChatEntity)
    private readonly chatRepository: Repository<ChatEntity>,
  ) {}
  async create(createClientDto: CreateClientDto) {
    return await this.clientRepository.save(createClientDto);
  }

  async findAll(
    per_page: number = 10,
    page: number = 1,
    search: string | null = null,
  ): Promise<{ count: number; data: ClientEntity[] }> {
    const skip = (page - 1) * per_page;
    const count = await this.clientRepository.count({
      where: {},
    });
    const subscribers = await this.clientRepository.find({
      where: {
        username: Like(`%${search ?? ''}%`),
      },
      take: per_page,
      skip: skip,
      order: { created_at: 'desc', id: 'asc' },
    });
    return { count: count, data: subscribers };
  }

  async findOne(id: number) {
    if (!isNaN(id))
      return await this.clientRepository.findOne({
        where: { id: id },
        relations: {
          results: true,
        },
      });
  }

  async findAllByStatus(verified: true | false | 'all') {
    if (typeof verified === 'boolean') {
      return await this.clientRepository.find({
        where: { is_activated: verified },
      });
    }
    return await this.clientRepository.find();
  }

  async findOneByTelegramId(id: number) {
    return await this.clientRepository.findOne({ where: { telegram_id: id } });
  }

  async setStatus(id: number, activate: boolean) {
    await this.clientRepository.update({ id: id }, { is_activated: activate });
    return await this.clientRepository.findOne({ where: { id: id } });
  }

  async setCustomName(id: number, name: string) {
    await this.clientRepository.update({ id: id }, { custom_name: name });
    return await this.clientRepository.findOne({ where: { id: id } });
  }

  async getResults(
    id: number,
    per_page: number = 10,
    page: number = 1,
    search: string | null = null,
  ): Promise<{ count: number; data: ResultsEntity[] }> {
    const skip = (page - 1) * per_page;
    const count = await this.resultsRepository.count({
      where: { client_id: id },
    });
    const results = await this.resultsRepository.find({
      where: {
        client_id: id,
        message: {
          name: Like(`%${search ?? ''}%`),
        },
      },
      take: per_page,
      skip: skip,
      order: { id: 'desc' },
      relations: {
        message: true,
        client: true,
      },
    });
    return { count: count, data: results };
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.clientRepository.delete({ id: id });
      return true;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async getAllClientsWithLastMessage(): Promise<ClientEntity[]> {
    const clients = await this.clientRepository.find({
      order: {
        messages: { createdAt: 'asc' },
      },
      relations: { messages: true },
    });

    return clients;
  }
}
