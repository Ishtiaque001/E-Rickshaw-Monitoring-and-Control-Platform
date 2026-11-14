
import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';

import { LicensesService } from './licenses.service.js';
import { CreateLicenseDto } from './dto/create-license.dto.js';
import { UpdateLicenseDto } from './dto/update-license.dto.js';

// Import your team's JWT and role guards here.

@Controller('licenses')
export class LicensesController {

  constructor(
    private readonly licensesService: LicensesService,
  ) {}

  @Post('issue')
  issueLicense(
    @Body() dto: CreateLicenseDto,
  ) {
    return this.licensesService.issueLicense(
      dto.applicationId,
    );
  }

  @Get()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.licensesService.findAll(
      Number(page),
      Number(limit),
    );
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.licensesService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateLicenseDto,
  ) {
    return this.licensesService.update(id, dto);
  }

  @Patch(':id')
  partialUpdate(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateLicenseDto,
  ) {
    return this.licensesService.update(id, dto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.licensesService.remove(id);
  }

  @Patch(':id/suspend')
  suspend(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.licensesService.suspend(id);
  }

  @Patch(':id/cancel')
  cancel(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.licensesService.cancel(id);
  }
}
