
import {
  Controller,
  Get,
  Param,
} from '@nestjs/common';

import { VerificationService } from './verification.service.js';

@Controller('verify')
export class VerificationController {

  constructor(
    private readonly verificationService: VerificationService,
  ) {}

  @Get(':token')
  verifyLicense(
    @Param('token') token: string,
  ) {
    return this.verificationService.verifyLicense(token);
  }
}
