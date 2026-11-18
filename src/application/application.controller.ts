import {Controller,Get,Post,Put,Patch,Delete,Body,Param,Query,Req,ParseIntPipe,UseGuards,} from '@nestjs/common';
import {ApiTags,ApiBearerAuth,ApiOperation,ApiResponse,ApiQuery,} from '@nestjs/swagger';
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

@ApiTags('Applications')
@ApiBearerAuth()
@ApiResponse({
  status: 400,
  description: 'Invalid request body, query parameters or application ID.',
})
@ApiResponse({
  status: 401,
  description: 'Missing or invalid token, or inactive account.',
})
@Controller('applications')
@UseGuards(JwtAuthGuard)
export class ApplicationController {
  constructor(
    private readonly applicationsService: ApplicationService,
  ) {}

  
  @Post()
  @ApiOperation({
  summary: 'Create an application',
  description:
    'Creates a pending application. The submitting user comes from the token.',
  })
  @ApiResponse({
    status: 201,
    description: 'Application created successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Driver, rickshaw or submitting user not found.',
  })
  create(
    @Body() dto: CreateApplicationDto,
    @Req() req: AuthenticatedRequest,
    
  ) {
    const submittedById = req.user.id

    return this.applicationsService.create(
      dto,submittedById,
    );
  }

  @Get()
  @ApiOperation({
  summary: 'List applications',
  description: 'Supports status filtering, driver search and pagination.',
})
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search by driver name or phone.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    schema: { type: 'integer', minimum: 1, default: 1 },
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    schema: {
      type: 'integer',
      minimum: 1,
      maximum: 100,
      default: 10,
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Returns applications and pagination metadata.',
  })
  findAll(@Query() query: QueryApplicationDto) {
    return this.applicationsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an application by ID' })
  @ApiResponse({ status: 200, description: 'Application found.' })
  @ApiResponse({ status: 404, description: 'Application not found.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.applicationsService.findOne(id);
  }

  @Put(':id')
  @Patch(':id')
  @ApiOperation({
  summary: 'Update a pending application',
})
  @ApiResponse({
    status: 200,
    description: 'Application updated successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Application, driver or rickshaw not found.',
  })
  @ApiResponse({
    status: 409,
    description: 'Only pending applications can be edited.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateApplicationDto,
  ) {
    return this.applicationsService.update(id, dto);
  }


  @Delete(':id')
  @ApiOperation({ summary: 'Cancel a pending application' })
  @ApiResponse({
    status: 200,
    description: 'Pending application deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'Application not found.' })
  @ApiResponse({
    status: 409,
    description: 'Only pending applications can be cancelled.',
  })

  remove(@Param('id', ParseIntPipe) id: number) {
    return this.applicationsService.remove(id);
  }
  @Patch(':id/approve')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)

  @ApiOperation({
  summary: 'Approve an application',
  description:
    'ADMIN only. Application must be pending and have supporting documents.',
})
  @ApiResponse({ status: 200, description: 'Application approved.' })
  @ApiResponse({ status: 403, description: 'ADMIN role required.' })
  @ApiResponse({
    status: 404,
    description: 'Application or reviewing user not found.',
  })
  @ApiResponse({
    status: 409,
    description: 'Only pending applications can be approved.',
  })

  approve(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,) 
  {
    const reviewedById = req.user.id
    return this.applicationsService.approve(id,reviewedById,);
  }

  @Patch(':id/reject')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)

  @ApiOperation({
  summary: 'Reject an application',
  description: 'ADMIN only. A rejection reason is required.',
})
  @ApiResponse({ status: 200, description: 'Application rejected.' })
  @ApiResponse({ status: 403, description: 'ADMIN role required.' })
  @ApiResponse({
    status: 404,
    description: 'Application or reviewing user not found.',
  })
  @ApiResponse({
    status: 409,
    description: 'Only pending applications can be rejected.',
  })

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
