import { Controller } from '@nestjs/common';
import { ApplicationService } from './application.service.js';

@Controller('application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}
}
