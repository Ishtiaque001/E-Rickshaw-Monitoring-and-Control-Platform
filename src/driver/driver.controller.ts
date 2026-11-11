import { Controller } from '@nestjs/common';
import { DriverService } from './driver.service.js';

@Controller('driver')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}
}
