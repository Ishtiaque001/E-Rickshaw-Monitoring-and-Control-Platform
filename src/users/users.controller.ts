import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import type { AuthenticatedRequest } from '../auth/guards/jwt-auth.guard.js';
import { UserRole } from './entities/user.entity.js';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@ApiTags('Users')
@ApiBearerAuth()
@ApiResponse({
  status: 401,
  description: 'Missing or invalid token, or account unavailable.',
})
@ApiResponse({
  status: 403,
  description: 'ADMIN role required.',
})
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a user account',
    description: 'ADMIN only. Records an audit entry.',
  })
  @ApiResponse({
    status: 201,
    description: 'Account created. Password hash is excluded.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid account details.',
  })
  @ApiResponse({
    status: 409,
    description: 'Email already exists.',
  })
  create(
    @Body() dto: CreateUserDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.usersService.create(dto, request.user);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all user accounts',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns all users without password hashes.',
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a user account by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Full UUID of the target user',
    schema: { type: 'string', format: 'uuid' },
  })
  @ApiResponse({
    status: 200,
    description: 'User found. Password hash is excluded.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid UUID.',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id/deactivate')
  @ApiOperation({
    summary: 'Deactivate a user account',
    description: 'Requires no request body. Records an audit entry.',
  })
  @ApiParam({
    name: 'id',
    description: 'Full UUID of the target user',
    schema: { type: 'string', format: 'uuid' },
  })
  @ApiResponse({
    status: 200,
    description: 'Account deactivated.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid UUID.',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  deactivate(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.usersService.deactivate(id, request.user);
  }

  @Patch(':id/activate')
  @ApiOperation({
    summary: 'Activate a user account',
    description: 'Requires no request body. Records an audit entry.',
  })
  @ApiParam({
    name: 'id',
    description: 'Full UUID of the target user',
    schema: { type: 'string', format: 'uuid' },
  })
  @ApiResponse({
    status: 200,
    description: 'Account activated.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid UUID.',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  activate(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.usersService.activate(id, request.user);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a user account',
    description:
      'Updates supplied fields. Records an audit entry.',
  })
  @ApiParam({
    name: 'id',
    description: 'Full UUID of the target user',
    schema: { type: 'string', format: 'uuid' },
  })
  @ApiResponse({
    status: 200,
    description: 'Account updated. Password hash is excluded.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid UUID, invalid fields or empty update.',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  @ApiResponse({
    status: 409,
    description: 'Email already exists.',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.usersService.update(id, dto, request.user);
  }
}
