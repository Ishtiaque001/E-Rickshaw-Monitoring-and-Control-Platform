import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
} from '@nestjs/common';

import type { Response } from 'express';
import { MulterError } from 'multer';

@Catch(MulterError)
export class MulterExceptionFilter implements ExceptionFilter
{
  catch(exception: MulterError,host: ArgumentsHost,) {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception.code === 'LIMIT_FILE_SIZE') {
      return response.status(413).json({
        statusCode: 413,
        message: 'File size must not exceed 2 MB',
      });
    }

    return response.status(400).json({
      statusCode: 400,
      message: 'File upload failed',
    });
  }
}
