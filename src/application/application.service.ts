import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import {
  Repository,
  DataSource,
} from 'typeorm';

import { Application } from './entities/application.entity.js';
import { Document } from '../document/entities/document.entity.js';
import { ApplicationStatus } from './enums/application-status.enum.js';
import { CreateApplicationDto } from './dtos/create-application.dto.js';
import { UpdateApplicationDto } from './dtos/update-application.dto.js';
import { QueryApplicationDto } from './dtos/query-application.dto.js';

import { Driver } from '../driver/entities/driver.entites.js';
import { User } from '../users/entities/user.entity.js';
import { Rickshaw } from '../rickshaws/rickshaw.entity.js';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,

    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,

    @InjectRepository(Rickshaw)
    private readonly rickshawRepository: Repository<Rickshaw>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,

    private readonly dataSource: DataSource,
  ) {}

  // CREATE APPLICATION
  async create(
    dto: CreateApplicationDto,
    submittedById: string,
  ) {
    const driver = await this.driverRepository.findOne({
      where: { id: dto.driverId },
    });

    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    const rickshaw = await this.rickshawRepository.findOne({
      where: { id: dto.rickshawId },
    });

    if (!rickshaw) {
      throw new NotFoundException('Rickshaw not found');
    }

    const submitter = await this.usersRepository.findOne({
      where: { id: submittedById },
    });

    if (!submitter) {
      throw new NotFoundException('Submitting user not found');
    }

    const application = this.applicationRepository.create({
      driver,
      rickshaw,
      submittedBy: submitter,
      status: ApplicationStatus.PENDING,
      rejectionReason: null,
    });

    const saved = await this.applicationRepository.save(application);

    return this.findOne(saved.id);
  }

  // GET ALL APPLICATIONS
  async findAll(query: QueryApplicationDto) {
    const {
      status,
      search,
      page = 1,
      limit = 10,
    } = query;

    const qb = this.applicationRepository
      .createQueryBuilder('application')
      .leftJoinAndSelect('application.driver', 'driver')
      .leftJoinAndSelect('application.rickshaw', 'rickshaw');

    if (status) {
      qb.andWhere('application.status = :status', {
        status,
      });
    }

    if (search) {
      qb.andWhere(
        '(driver.name ILIKE :search OR driver.phone ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    const [data, total] = await qb
      .orderBy('application.submittedAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // GET ONE APPLICATION
  async findOne(id: number) {
    const application = await this.applicationRepository.findOne({
      where: { id },
      relations: {
        driver: true,
        rickshaw: true,
      },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    return application;
  }

  // UPDATE APPLICATION
  async update(id: number, dto: UpdateApplicationDto) {
    const application = await this.applicationRepository.findOne({
      where: { id },
      relations: {
        driver: true,
        rickshaw: true,
      },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (application.status !== ApplicationStatus.PENDING) {
      throw new ConflictException(
        'Only pending applications can be edited',
      );
    }

    if (dto.driverId !== undefined) {
      const driver = await this.driverRepository.findOne({
        where: { id: dto.driverId },
      });

      if (!driver) {
        throw new NotFoundException('Driver not found');
      }

      application.driver = driver;
    }

    if (dto.rickshawId !== undefined) {
      const rickshaw = await this.rickshawRepository.findOne({
        where: { id: dto.rickshawId },
      });

      if (!rickshaw) {
        throw new NotFoundException('Rickshaw not found');
      }

      application.rickshaw = rickshaw;
    }

    const saved = await this.applicationRepository.save(application);

    return this.findOne(saved.id);
  }

  // DELETE / CANCEL PENDING APPLICATION
  async remove(id: number) {
    const application = await this.applicationRepository.findOne({
      where: { id },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (application.status !== ApplicationStatus.PENDING) {
      throw new ConflictException(
        'Only pending applications can be cancelled',
      );
    }

    await this.applicationRepository.remove(application);

    return {
      message: 'Application cancelled successfully',
    };
  }

  // ADMIN APPROVAL
  async approve(id: number, reviewedById: string) {
    await this.dataSource.transaction(async (manager) => {
      const appRepo = manager.getRepository(Application);
      const userRepo = manager.getRepository(User);
      const docRepo = manager.getRepository(Document);

      const application = await appRepo.findOne({
        where: { id },
        relations: {
          driver: true,
          rickshaw: true,
        },
        lock: { mode: 'pessimistic_write' },
      });

      if (!application) {
        throw new NotFoundException('Application not found');
      }

      if (application.status !== ApplicationStatus.PENDING) {
        throw new ConflictException(
          'Only pending applications can be approved',
        );
      }

      const reviewer = await userRepo.findOne({
        where: { id: reviewedById },
      });

      if (!reviewer) {
        throw new NotFoundException('Admin user not found');
      }

      if (!application.driver || !application.rickshaw) {
        throw new BadRequestException(
          'Application is missing its driver or rickshaw',
        );
      }

      // Basic document eligibility rule:
      // Require at least one supporting document before approval.
      const documentCount = await docRepo.count({
        where: {
          application: { id },
        },
      });

      if (documentCount < 1) {
        throw new BadRequestException(
          'Upload at least one supporting document before approval',
        );
      }

      application.status = ApplicationStatus.APPROVED;
      application.reviewedBy = reviewer;
      application.rejectionReason = null;

      await appRepo.save(application);
    });

    return this.findOne(id);
  }

  // ADMIN REJECTION
  async reject(
    id: number,
    reviewedById: string,
    rejectionReason: string,
  ) {
    await this.dataSource.transaction(async (manager) => {
      const appRepo = manager.getRepository(Application);
      const userRepo = manager.getRepository(User);

      const application = await appRepo.findOne({
        where: { id },
        lock: { mode: 'pessimistic_write' },
      });

      if (!application) {
        throw new NotFoundException('Application not found');
      }

      if (application.status !== ApplicationStatus.PENDING) {
        throw new ConflictException(
          'Only pending applications can be rejected',
        );
      }

      const reviewer = await userRepo.findOne({
        where: { id: reviewedById },
      });

      if (!reviewer) {
        throw new NotFoundException('Admin user not found');
      }

      application.status = ApplicationStatus.REJECTED;
      application.reviewedBy = reviewer;
      application.rejectionReason = rejectionReason;

      await appRepo.save(application);
    });

    return this.findOne(id);
  }
}
