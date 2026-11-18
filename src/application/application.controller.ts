import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Req,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';

import { ApplicationService } from './application.service.js';

import { CreateApplicationDto } from './dtos/create-application.dto.js';
import { UpdateApplicationDto } from './dtos/update-application.dto.js';
import { QueryApplicationDto } from './dtos/query-application.dto.js';
import { RejectApplicationDto } from './dtos/reject-application.dto.js';

import type { AuthenticatedRequest } from '../auth/guards/jwt-auth.guard.js';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { UserRole } from '../users/entities/user.entity.js';




@Controller('applications')
@UseGuards(JwtAuthGuard)
export class ApplicationController {
  constructor(
    private readonly applicationsService: ApplicationService,
  ) {}

  // CREATE APPLICATION
  @Post()

  create(

    @Body() dto: CreateApplicationDto,
    @Req() req: AuthenticatedRequest,
    
  ) {
    const submittedById = req.user.id

    return this.applicationsService.create(
      dto,submittedById,
    );
  }

  // GET ALL APPLICATIONS
  @Get()
  findAll(@Query() query: QueryApplicationDto) {
    return this.applicationsService.findAll(query);
  }

  // GET SINGLE APPLICATION
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.applicationsService.findOne(id);
  }

  // UPDATE APPLICATION
  @Put(':id')
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateApplicationDto,
  ) {
    return this.applicationsService.update(id, dto);
  }

  // CANCEL APPLICATION
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.applicationsService.remove(id);
  }

  // ADMIN APPROVAL
  @Patch(':id/approve')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  approve(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    const reviewedById = req.user.id

    return this.applicationsService.approve(
      id,
      reviewedById,
    );
  }

  // ADMIN REJECTION
  @Patch(':id/reject')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  reject(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RejectApplicationDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const reviewedById = req.user.id;

    return this.applicationsService.reject(
      id,
      reviewedById,
      dto.rejectionReason,
    );
  }
}
