import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Rickshaw } from './rickshaw.entity.js';
import { Owner } from '../owners/owner.entity.js';
import { CreateRickshawDto } from './dto/create-rickshaw.dto.js';

@Injectable()
export class RickshawsService {
  constructor(
    @InjectRepository(Rickshaw)
    private readonly rickshawsRepository: Repository<Rickshaw>,

    @InjectRepository(Owner)
    private readonly ownersRepository: Repository<Owner>,
  ) {}

  // CREATE RICKSHAW
  async create(dto: CreateRickshawDto): Promise<Rickshaw> {
    const owner = await this.ownersRepository.findOneBy({
      id: dto.ownerId,
    });

    if (!owner) {
      throw new NotFoundException('Owner not found');
    }

    const rickshaw = this.rickshawsRepository.create(dto);

    return await this.rickshawsRepository.save(rickshaw);
  }

  // GET ALL RICKSHAWS
  async findAll(): Promise<Rickshaw[]> {
    return await this.rickshawsRepository.find();
  }
  async findOne(id: number): Promise<Rickshaw> {
  const rickshaw = await this.rickshawsRepository.findOneBy({
    id,
  });

  if (!rickshaw) {
    throw new NotFoundException(
      `Rickshaw with ID ${id} not found`,
    );
  }

  return rickshaw;
}
// UPDATE RICKSHAW
async update(
  id: number,
  dto: CreateRickshawDto,
): Promise<Rickshaw> {
  const rickshaw = await this.findOne(id);

  const owner = await this.ownersRepository.findOneBy({
    id: dto.ownerId,
  });

  if (!owner) {
    throw new NotFoundException('Owner not found');
  }

  Object.assign(rickshaw, dto);

  return await this.rickshawsRepository.save(rickshaw);
}
// DELETE RICKSHAW
async remove(id: number): Promise<{ message: string }> {
  const rickshaw = await this.findOne(id);

  await this.rickshawsRepository.remove(rickshaw);

  return {
    message: 'Rickshaw deleted successfully',
  };
}
}