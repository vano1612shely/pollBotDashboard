import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity, MessageType } from './entities/message.entity';
import { And, Like, Not, Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { BotsService } from '../bots/bots.service';
import { ResultsEntity } from './entities/results.entity';
import { ClientService } from '../client/client.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    @InjectRepository(ResultsEntity)
    private readonly resultsRepository: Repository<ResultsEntity>,
    @Inject(forwardRef(() => BotsService))
    private readonly botsService: BotsService,
    private readonly clienService: ClientService,
  ) {}

  async create(createMessageDto: CreateMessageDto) {
    if (
      createMessageDto.type === MessageType.StartU ||
      createMessageDto.type === MessageType.StartA
    ) {
      const check = await this.messageRepository.findOne({
        where: {
          type: createMessageDto.type,
        },
      });
      if (check) {
        await this.messageRepository.update(
          { id: check.id },
          {
            name: createMessageDto.type,
            ...createMessageDto,
          },
        );
        return check;
      }
    }
    return await this.messageRepository.save({
      name: createMessageDto.name
        ? createMessageDto.name
        : createMessageDto.type,
      ...createMessageDto,
    });
  }

  async getByType(type: MessageType): Promise<MessageEntity[]> {
    const messages = await this.messageRepository.find({
      where: { type: type, archived: false },
    });
    return messages;
  }
  async getById(id: number): Promise<MessageEntity> {
    const messages = await this.messageRepository.findOne({
      where: { id: id },
      relations: {
        results: {
          message: true,
          client: true,
        },
      },
    });
    return messages;
  }

  async getAll(
    per_page: number = 10,
    page: number = 1,
    search: string | null = null,
    archived: boolean = false,
  ): Promise<{ count: number; data: MessageEntity[] }> {
    const skip = (page - 1) * per_page;
    const count = await this.messageRepository.count({
      where: {
        type: And(Not(MessageType.StartA), Not(MessageType.StartU)),
        archived: archived,
      },
    });
    const messages = await this.messageRepository.find({
      where: {
        name: Like(`%${search ?? ''}%`),
        type: And(Not(MessageType.StartA), Not(MessageType.StartU)),
        archived: archived,
      },
      take: per_page,
      skip: skip,
      order: { id: 'desc' },
    });
    return { count: count, data: messages };
  }

  async getResults(
    id: number,
    per_page: number = 10,
    page: number = 1,
    search: string | null = null,
  ): Promise<{ count: number; data: ResultsEntity[] }> {
    const skip = (page - 1) * per_page;
    const count = await this.resultsRepository.count({
      where: { message_id: id },
    });
    const results = await this.resultsRepository.find({
      where: {
        message_id: id,
        client: {
          username: Like(`%${search ?? ''}%`),
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

  async sendMessage(id: number) {
    const message = await this.messageRepository.findOne({ where: { id: id } });
    if (!message || message.is_send) {
      throw new BadRequestException('Повідомлення не знайдено');
    }
    const res = await this.botsService.sendMessage(message);
    if (res) {
      await this.messageRepository.update(
        { id: id },
        {
          is_send: true,
        },
      );
    }
    return res;
  }

  async saveResult(message_id: number, telegram_id: number, result: string) {
    const message = await this.messageRepository.findOne({
      where: { id: message_id },
    });
    if (!message) {
      throw new BadRequestException('Повідомлення не знайдено');
    }
    const user = await this.clienService.findOneByTelegramId(telegram_id);
    if (!user) {
      throw new BadRequestException('Користувача не знайдено');
    }
    const check = await this.resultsRepository.findOne({
      where: {
        message_id: message_id,
        client_id: user.id,
      },
    });
    if (check) {
      return await this.resultsRepository.update(
        {
          message_id: message_id,
          client_id: user.id,
        },
        {
          result: result,
        },
      );
    }
    return await this.resultsRepository.save({
      message: message,
      client: user,
      result: result,
    });
  }

  async archive(id: number) {
    try {
      const msg = await this.messageRepository.findOne({
        where: { id: id },
      });
      await this.messageRepository.update(
        {
          id: id,
        },
        { archived: !msg.archived },
      );
      return true;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
