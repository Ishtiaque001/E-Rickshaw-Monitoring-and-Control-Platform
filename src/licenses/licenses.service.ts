import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
 
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { randomBytes, randomInt } from 'crypto';
import { License, LicenseStatus } from './entities/license.entity.js';
import { Application } from '../application/entities/application.entity.js';
import { ApplicationStatus } from '../application/enums/application-status.enum.js';

import { CreateLicenseDto } from './dto/create-license.dto.js';
import { UpdateLicenseDto } from './dto/update-license.dto.js';
import { ReplaceLicenseDto } from './dto/replace-license.dto.js';
import { VerificationLog } from '../verification/entities/verification-log.entity.js';


@Injectable()
export class LicensesService {
constructor(
  @InjectRepository(License)
  private licenseRepository: Repository<License>,

  @InjectRepository(VerificationLog)
  private verificationLogRepository: Repository<VerificationLog>,

  @InjectDataSource()
  private dataSource: DataSource,
) {}
  // 1. Issue a new license
 async issueLicense(dto: CreateLicenseDto) {
  return this.dataSource.transaction(async (manager) => {

    const applicationRepository =
      manager.getRepository(Application);

    const licenseRepository =
      manager.getRepository(License);

    const application = await applicationRepository
      .createQueryBuilder('application')
      .setLock('pessimistic_write')
      .where('application.id = :id', {
        id: dto.applicationId,
      })
      .getOne();

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (application.status !== ApplicationStatus.PENDING) {
      throw new BadRequestException(
        'Application is not eligible for license issuance',
      );
    }

    const existingLicense = await licenseRepository.findOne({
      where: { applicationId: dto.applicationId },
    });

    if (existingLicense) {
      throw new ConflictException(
        'License already exists for this application',
      );
    }

    if (new Date(dto.expiryDate) <= new Date(dto.issueDate)) {
      throw new BadRequestException(
        'Expiry date must be after issue date',
      );
    }

    const license = licenseRepository.create({
      applicationId: application.id,
      licenseNumber: `ERMCP-${Date.now()}-${randomInt(1000, 9999)}`,
      verificationToken: randomBytes(32).toString('hex'),
      issueDate: dto.issueDate,
      expiryDate: dto.expiryDate,
      status: LicenseStatus.ACTIVE,
    });

    const savedLicense = await licenseRepository.save(license);

    application.status = ApplicationStatus.APPROVED;
    await applicationRepository.save(application);

    return savedLicense;
  });
}

  // 2. Get all licenses with pagination
  async findAll(page = 1, limit = 10) {
    if (
      !Number.isInteger(page) ||
      !Number.isInteger(limit) ||
      page < 1 ||
      limit < 1 ||
      limit > 100
    ) {
      throw new BadRequestException(
        'Invalid page or limit value',
      );
    }

    const [data, total] =
      await this.licenseRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
        order: { id: 'DESC' },
      });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // 3. Get one license
  async findOne(id: number) {
    const license = await this.licenseRepository.findOne({
      where: { id },
    });

    if (!license) {
      throw new NotFoundException('License not found');
    }

    return license;
  }


async update(
  id: number,
  dto: UpdateLicenseDto | ReplaceLicenseDto,
) {
  const license = await this.findOne(id);

  if (!dto.expiryDate) {
    throw new BadRequestException(
      'Expiry date is required',
    );
  }

  const newExpiryDate = new Date(dto.expiryDate);
  const issueDate = new Date(license.issueDate);

  if (newExpiryDate <= issueDate) {
    throw new BadRequestException(
      'Expiry date must be after issue date',
    );
  }

  license.expiryDate = dto.expiryDate;

  return this.licenseRepository.save(license);
}


  // 5. Remove a license

async remove(id: number) {
  const license = await this.findOne(id);

  const verificationCount =
    await this.verificationLogRepository.count({
      where: { licenseId: id },
    });

  if (verificationCount > 0) {
    throw new ConflictException(
      'Cannot delete license because verification logs exist. Cancel the license instead.',
    );
  }

  await this.licenseRepository.remove(license);

  return {
    message: 'License deleted successfully',
  };
}


  // 6. Suspend a license
  async suspend(id: number) {
    const license = await this.findOne(id);

    if (license.status === LicenseStatus.CANCELLED) {
      throw new BadRequestException(
        'Cancelled license cannot be suspended',
      );
    }

    license.status = LicenseStatus.SUSPENDED;

    return this.licenseRepository.save(license);
  }

  // 7. Cancel a license
  async cancel(id: number) {
    const license = await this.findOne(id);

    if (license.status === LicenseStatus.CANCELLED) {
      throw new BadRequestException(
        'License is already cancelled',
      );
    }

    license.status = LicenseStatus.CANCELLED;

    return this.licenseRepository.save(license);
  }
}