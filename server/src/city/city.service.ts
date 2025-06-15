import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CityEntity } from './entities/city.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(CityEntity)
    private readonly cityRepository: Repository<CityEntity>,
  ) {}

  async create(createCityDto: CreateCityDto): Promise<CityEntity> {
    try {
      const city = this.cityRepository.create(createCityDto);
      return await this.cityRepository.save(city);
    } catch (error) {
      if (error.code === '23505') {
        // Duplicate key error
        throw new ConflictException('Місто з такою назвою вже існує');
      }
      throw error;
    }
  }

  async findAll(): Promise<CityEntity[]> {
    return await this.cityRepository.find({
      relations: ['clients'],
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<CityEntity> {
    const city = await this.cityRepository.findOne({
      where: { id },
      relations: ['clients'],
    });

    if (!city) {
      throw new NotFoundException('Місто не знайдено');
    }

    return city;
  }

  async findByName(name: string): Promise<CityEntity> {
    const city = await this.cityRepository.findOne({
      where: { name },
      relations: ['clients'],
    });

    if (!city) {
      throw new NotFoundException('Місто не знайдено');
    }

    return city;
  }

  async update(id: number, updateCityDto: UpdateCityDto): Promise<CityEntity> {
    const city = await this.findOne(id);

    try {
      Object.assign(city, updateCityDto);
      return await this.cityRepository.save(city);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Місто з такою назвою вже існує');
      }
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    const city = await this.findOne(id);

    if (city.clients && city.clients.length > 0) {
      throw new ConflictException(
        "Неможливо видалити місто, оскільки до нього прив'язані клієнти",
      );
    }

    await this.cityRepository.remove(city);
  }
  async getClientsCount(id: number): Promise<number> {
    const city = await this.findOne(id);
    return city.clients ? city.clients.length : 0;
  }
}
