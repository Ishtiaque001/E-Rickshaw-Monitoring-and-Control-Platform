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

import {ApiBearerAuth,ApiBody,ApiConsumes,ApiOperation,ApiParam,ApiResponse,ApiTags,
} from '@nestjs/swagger';

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
  @ApiTags('Documents')
  @ApiBearerAuth()
  @ApiParam({
    name: 'applicationId',
    type: Number,
    example: 1,
    description: 'Numeric ID of the application',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid application ID or request data.',
  })
  @ApiResponse({
    status: 401,
    description: 'Missing or invalid token, or inactive account.',
  })

@Controller('applications/:applicationId/documents')
@UseGuards(JwtAuthGuard)
export class DocumentController {
  constructor(
    private readonly documentsService: DocumentService,
  ) {}

  @Post()
  @ApiOperation({
  summary: 'Upload a supporting document',
  description:
    'Upload a JPG, JPEG, PNG or PDF, up to 2 MB. The application must be pending.',
})
@ApiConsumes('multipart/form-data')
@ApiBody({
  required: true,
  schema: {
    type: 'object',
    required: ['documentType', 'file'],
    properties: {
      documentType: {
        type: 'string',
        minLength: 2,
        maxLength: 100,
        example: 'IDENTITY_DOCUMENT',
      },
      file: {
        type: 'string',
        format: 'binary',
        description: 'JPG, JPEG, PNG or PDF file, up to 2 MB',
      },
    },
  },
})
@ApiResponse({
  status: 201,
  description: 'Document uploaded and its details saved.',
})
@ApiResponse({
  status: 404,
  description: 'Application not found.',
})
@ApiResponse({
  status: 409,
  description: 'Documents can only be uploaded to pending applications.',
})
@ApiResponse({
  status: 413,
  description: 'File size exceeds 2 MB.',
})

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

  @Get()
  @ApiOperation({
  summary: 'List documents for an application',
})
@ApiResponse({
  status: 200,
  description: 'Returns documents, newest first.',
})
@ApiResponse({
  status: 404,
  description: 'Application not found.',
})
  findAll(
    @Param('applicationId', ParseIntPipe) applicationId: number,) {
    return this.documentsService.findAll(applicationId);
  }
}
