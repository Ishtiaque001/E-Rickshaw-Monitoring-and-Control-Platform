import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { Roles } from './decorators/roles.decorator.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { RolesGuard } from './guards/roles.guard.js';
import { UserRole } from '../users/entities/user.entity.js';
import type { AuthenticatedRequest } from './guards/jwt-auth.guard.js';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Log in to an active account',
    description: 'Available to ADMIN, OPERATOR and VERIFIER accounts.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Login successful. Returns access_token, token_type, expires_in and user.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request body.',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials or inactive account.',
  })
  @ApiResponse({
    status: 500,
    description: 'Unexpected login failure.',
  })
  async login(@Body() login: LoginDto) {
    return await this.authService.login(login);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OPERATOR, UserRole.VERIFIER)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get your current profile',
  })
  @ApiResponse({
    status: 200,
    description:
      'Returns the authenticated account profile without its password hash.',
  })
  @ApiResponse({
    status: 401,
    description: 'Missing or invalid token, or account unavailable.',
  })
  @ApiResponse({
    status: 403,
    description: 'Account role is not allowed.',
  })
  getProfile(@Req() req: AuthenticatedRequest) {
    return req.user;
  }
}