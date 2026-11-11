import { Injectable,
      BadRequestException,
  ConflictException,
  NotFoundException,
 } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

import { AuditLogsService } from '../audit-logs/audit-logs.service.js';
import { AuditAction } from '../audit-logs/entities/audit-log.entity.js';
import { UserRole } from './entities/user.entity.js';

type AuditActor = {
  id: string;
  role: UserRole;
};
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto) {
    const name = this.validateName(dto.name);
    const passwordHash = await this.hashPassword(dto.password);

    const user = this.usersRepository.create({
      name,
      email: dto.email.trim().toLowerCase(),
      passwordHash,
      role: dto.role,
      isActive: true,
    });

    try {
      const savedUser = await this.usersRepository.save(user);
      return this.toPublicUser(savedUser);
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async findAll(page = 1, limit = 10) {
    if (
      !Number.isSafeInteger(page) ||
      !Number.isSafeInteger(limit) ||
      page < 1 ||
      limit < 1 ||
      limit > 100
    ) {
      throw new BadRequestException(
        'Page must be a positive integer; limit must be between 1 and 100',
      );
    }

    const skip = (page - 1) * limit;

    if (!Number.isSafeInteger(skip)) {
      throw new BadRequestException('Page is too large');
    }

    const [users, total] = await this.usersRepository.findAndCount({
      skip,
      take: limit,
      order: {
        createdAt: 'DESC',
        id: 'DESC',
      },
    });

    return {
      data: users.map((user) => this.toPublicUser(user)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const user = await this.getUserOrFail(id);
    return this.toPublicUser(user);
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.getUserOrFail(id);

    const changes: Partial<User> = {};

    if (dto.name !== undefined) {
      changes.name = this.validateName(dto.name);
    }

    if (dto.email !== undefined) {
      changes.email = dto.email.trim().toLowerCase();
    }

    if (dto.role !== undefined) {
      changes.role = dto.role;
    }

    if (dto.password !== undefined) {
      changes.passwordHash = await this.hashPassword(dto.password);
    }

    if (Object.keys(changes).length === 0) {
      throw new BadRequestException('Provide at least one field to update');
    }

    try {
      const result = await this.usersRepository.update(id, changes);

      if (result.affected === 0) {
        throw new NotFoundException('User not found');
      }

      return await this.findOne(id);
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async deactivate(id: string) {
    await this.getUserOrFail(id);

    const result = await this.usersRepository.update(id, {
      isActive: false,
    });

    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }

    return this.findOne(id);
  }

  async activate(id: string) {
  await this.getUserOrFail(id);

  const result = await this.usersRepository.update(id, {
    isActive: true,
  });

  if (result.affected === 0) {
    throw new NotFoundException('User not found');
  }

  return this.findOne(id);
}

  private async getUserOrFail(id: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  private validateName(name: string): string {
    const trimmedName = name.trim();

    if (!trimmedName) {
      throw new BadRequestException('Name cannot be blank');
    }

    return trimmedName;
  }

  private async hashPassword(password: string): Promise<string> {
    if (Buffer.byteLength(password, 'utf8') > 72) {
      throw new BadRequestException('Password cannot exceed 72 UTF-8 bytes');
    }

    return bcrypt.hash(password, 12);
  }

  private toPublicUser(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private handleDatabaseError(error: unknown): never {
    if (error instanceof QueryFailedError) {
      const driverError = error.driverError as { code?: string };

      if (driverError.code === '23505') {
        throw new ConflictException('Email already exists');
      }
    }

    throw error;
  }
}