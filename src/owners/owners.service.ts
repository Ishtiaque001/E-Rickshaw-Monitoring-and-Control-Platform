import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError, ILike } from 'typeorm';

import { Owner } from './owner.entity.js';
import { Rickshaw } from '../rickshaws/rickshaw.entity.js';
import { UpdateOwnerDto } from './dto/update-owner.dto.js';
import { CreateOwnerDto } from './dto/create-owner.dto.js';
import { OwnerQueryDto } from './dto/owner-query.dto.js';

@Injectable()
export class OwnersService {
  
constructor(
  @InjectRepository(Owner)
  private readonly ownersRepository: Repository<Owner>,

  @InjectRepository(Rickshaw)
  private readonly rickshawsRepository: Repository<Rickshaw>,
    ) {}


  async create(createOwnerDto: CreateOwnerDto): Promise<Owner> {
    const owner = this.ownersRepository.create(createOwnerDto);

    try {
      return await this.ownersRepository.save(owner);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error.driverError as { code?: string }).code === '23505'
      ) {
        throw new ConflictException(
          'An owner with this phone number already exists',
        );
      }

      throw error;
    }
  }

    async findAll(query: OwnerQueryDto = new OwnerQueryDto()) {
    const { search, page = 1, limit = 10 } = query;

    const searchTerm = search?.trim();

    const [data, total] = await this.ownersRepository.findAndCount({
        where: searchTerm
        ? [
            { name: ILike(`%${searchTerm}%`) },
            { phone: ILike(`%${searchTerm}%`) },
            ]
        : {},

        order: {
        createdAt: 'DESC',
        },

        skip: (page - 1) * limit,
        take: limit,
    });

    return {
        data,
        meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        },
    };
    }


    async update(
    id: number,
    updateOwnerDto: Partial<UpdateOwnerDto>,
    ): Promise<Owner> {

    const owner = await this.findOne(id);

    Object.assign(owner, updateOwnerDto);

    try {
      return await this.ownersRepository.save(owner);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error.driverError as { code?: string }).code === '23505'
      ) {
        throw new ConflictException(
          'An owner with this phone number already exists',
        );
      }

      throw error;
    }
  }

  async findOne(id: number): Promise<Owner> {
    const owner = await this.ownersRepository.findOneBy({
      id,
    });

    if (!owner) {
      throw new NotFoundException(
        `Owner with ID ${id} not found`,
      );
    }

    return owner;
  }


async remove(id: number): Promise<{ message: string }> {
  const owner = await this.findOne(id);

  const rickshawCount = await this.rickshawsRepository.countBy({
    ownerId: id,
  });


  if (rickshawCount > 0) {
    throw new ConflictException(
      'Cannot delete owner because registered Rickshaws exist',
    );
  }

  try {
    await this.ownersRepository.remove(owner);
  } catch (error) {
    if (
      error instanceof QueryFailedError &&
      (error.driverError as { code?: string }).code === '23503'
    ) {
      throw new ConflictException(
        'Cannot delete owner because another record references them',
      );
    }

    throw error;
  }

  return {
    message: 'Owner deleted successfully',
  };
}


async findRickshaws(id: number): Promise<Rickshaw[]> {
  await this.findOne(id);

  return await this.rickshawsRepository.find({
    where: {
      ownerId: id,
    },
    order: {
      createdAt: 'DESC',
    },
  });
}



}
