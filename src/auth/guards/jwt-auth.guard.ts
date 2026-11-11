import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import { Repository } from 'typeorm';
import type { Request } from 'express';
import { User } from '../../users/entities/user.entity.js';

export type AuthenticatedRequest = Request & {
  user: Pick<User, 'id' | 'name' | 'email' | 'role' | 'isActive'>;
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<AuthenticatedRequest>();

    const authorization = request.headers.authorization;
    const parts = authorization?.trim().split(/\s+/);

    if (
      !parts ||
      parts.length !== 2 ||
      parts[0].toLowerCase() !== 'bearer'
    ) {
      throw new UnauthorizedException('Bearer token required');
    }

    let userId: string;

    try {
      const payload = await this.jwtService.verifyAsync<{ sub?: unknown }>(
        parts[1],
        {
          secret: this.configService.getOrThrow<string>('JWT_SECRET'),
          algorithms: ['HS256'],
        },
      );

      if (typeof payload.sub !== 'string' || !isUUID(payload.sub)) {
        throw new UnauthorizedException();
      }

      userId = payload.sub;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const user = await this.usersRepository.findOneBy({ id: userId });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Account unavailable');
    }

    request.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    };

    return true;
  }
}