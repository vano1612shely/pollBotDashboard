import { Injectable } from '@nestjs/common';
import { CreateButtonDto } from './dto/create-button.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ButtonEntity } from './entities/button.entity';
import { Like, Repository } from 'typeorm';
import { ResultsEntity } from '../messages/entities/results.entity';

@Injectable()
export class ButtonsService {
  constructor(
    @InjectRepository(ButtonEntity)
    private readonly buttonRepository: Repository<ButtonEntity>,
  ) {}
  async create(createButtonDto: CreateButtonDto) {
    return await this.buttonRepository.save(createButtonDto);
  }

  async getById(id: number) {
    return await this.buttonRepository.findOne({ where: { id: id } });
  }

  async getAll(
    per_page: number = 10,
    page: number = 1,
    search: string | null = null,
  ): Promise<{ count: number; data: ButtonEntity[] }> {
    const skip = (page - 1) * per_page;
    const count = await this.buttonRepository.count({
      where: {},
    });
    const results = await this.buttonRepository.find({
      where: {
        name: Like(`%${search ?? ''}%`),
      },
      take: per_page,
      skip: skip,
      order: { id: 'desc' },
    });
    return { count: count, data: results };
  }

  async delete(id: number) {
    return await this.buttonRepository.delete({ id: id });
  }
}
