import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { unlink } from 'node:fs/promises';
import { relative } from 'node:path';

import { Document } from './entities/document.entity.js';
import { Application } from '../application/entities/application.entity.js';
import { ApplicationStatus } from '../application/enums/application-status.enum.js';
import { UploadDocumentDto } from './dtos/upload-document.dto.js';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
  ) {}

  // UPLOAD DOCUMENT
  async upload(
    applicationId: number,
    dto: UploadDocumentDto,
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const application = await this.applicationRepository.findOne({
      where: { id: applicationId },
    });

    if (!application) {
      await unlink(file.path).catch(() => undefined);
      throw new NotFoundException('Application not found');
    }

    if (application.status !== ApplicationStatus.PENDING) {
      await unlink(file.path).catch(() => undefined);
      throw new ConflictException(
        'Documents can only be uploaded to pending applications',
      );
    }

    const document = this.documentRepository.create({
      application,
      documentType: dto.documentType,
      filePath: relative(process.cwd(), file.path),
      mimeType: file.mimetype,
    });

    try {
      return await this.documentRepository.save(document);
    } catch (error) {
      await unlink(file.path).catch(() => undefined);
      throw error;
    }
  }

  // LIST DOCUMENTS OF AN APPLICATION
  async findAll(applicationId: number) {
    const application = await this.applicationRepository.findOne({
      where: { id: applicationId },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    return this.documentRepository.find({
      where: {
        application: { id: applicationId },
      },
      order: {
        uploadedAt: 'DESC',
      },
    });
  }
}
