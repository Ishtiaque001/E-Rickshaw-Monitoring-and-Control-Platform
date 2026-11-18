import {
  Controller,
  Post,
  Get,
  Param,
  ParseIntPipe,
  Body,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  UseFilters,
  BadRequestException,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { diskStorage } from 'multer';

import { extname, join } from 'node:path';
import { mkdirSync } from 'node:fs';
import { randomUUID } from 'node:crypto';

import { DocumentService } from './document.service.js';
import { UploadDocumentDto } from './dtos/upload-document.dto.js';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { MulterExceptionFilter } from './multer-exception.filter.js';

const MAX_FILE_SIZE = 2 * 1024 * 1024;

const allowedTypes: Record<string, string[]> = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'application/pdf': ['.pdf'],
};

@Controller('applications/:applicationId/documents')
@UseGuards(JwtAuthGuard)
export class DocumentController {
  constructor(
    private readonly documentsService: DocumentService,
  ) {}

  // UPLOAD FILE
  @Post()
  @UseFilters(MulterExceptionFilter)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, callback) => {
          const uploadDir = join(
            process.cwd(),
            'uploads',
            'documents',
          );

          mkdirSync(uploadDir, { recursive: true });

          callback(null, uploadDir);
        },

        filename: (_req, file, callback) => {
          const extension = extname(file.originalname).toLowerCase();

          callback(
            null,
            `${randomUUID()}${extension}`,
          );
        },
      }),

      limits: {
        fileSize: MAX_FILE_SIZE,
      },

      fileFilter: (_req, file, callback) => {
        const extension = extname(file.originalname).toLowerCase();

        const validExtensions = allowedTypes[file.mimetype];

        if (
          !validExtensions ||
          !validExtensions.includes(extension)
        ) {
          return callback(
            new BadRequestException(
              'Only JPG, JPEG, PNG and PDF files are allowed',
            ),
            false,
          );
        }

        callback(null, true);
      },
    }),
  )
  upload(
    @Param('applicationId', ParseIntPipe) applicationId: number,

    @Body() dto: UploadDocumentDto,

    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Please upload a valid file');
    }

    return this.documentsService.upload(
      applicationId,
      dto,
      file,
    );
  }

  // GET ALL DOCUMENTS FOR AN APPLICATION
  @Get()
  findAll(
    @Param('applicationId', ParseIntPipe) applicationId: number,
  ) {
    return this.documentsService.findAll(applicationId);
  }
}
