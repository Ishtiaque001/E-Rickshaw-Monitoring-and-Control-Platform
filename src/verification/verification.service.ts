
import {
  Injectable,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { License } from '../licenses/entities/license.entity.js';
import { LicenseStatus } from '../licenses/entities/license.entity.js';

import { VerificationLog } from './entities/verification-log.entity.js';

@Injectable()
export class VerificationService {

  constructor(
    @InjectRepository(License)
    private licenseRepository: Repository<License>,

    @InjectRepository(VerificationLog)
    private logRepository: Repository<VerificationLog>,
  ) {}

  async verifyLicense(token: string) {

    const license = await this.licenseRepository.findOne({
      where: {
        verificationToken: token,
      },
    });

    if (!license) {
      return {
        valid: false,
        result: 'NOT_FOUND',
        message: 'License not found',
      };
    }

    let result = 'VALID';

    const today = new Date().toISOString().slice(0, 10);

    if (license.status === LicenseStatus.SUSPENDED) {
      result = 'SUSPENDED';
    }
    else if (license.status === LicenseStatus.CANCELLED) {
      result = 'CANCELLED';
    }
    else if (license.expiryDate < today) {
      result = 'EXPIRED';
    }

    await this.logRepository.save({
      licenseId: license.id,
      verifiedBy: null,
      result: result,
    });

    return {
      valid: result === 'VALID',
      result: result,
      licenseNumber: license.licenseNumber,
      issueDate: license.issueDate,
      expiryDate: license.expiryDate,
      status: license.status,
    };
  }
}
