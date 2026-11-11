import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(login: LoginDto) {
    try {
      if (Buffer.byteLength(login.password, 'utf8') > 72) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const email = login.email.trim().toLowerCase();

      const user = await this.usersRepository
        .createQueryBuilder('user')
        .addSelect('user.passwordHash')
        .where('user.email = :email', { email })
        .getOne();

      console.log('Login lookup:', {
        found: Boolean(user),
        isActive: user?.isActive,
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const matchPass = await bcrypt.compare(
        login.password,
        user.passwordHash,
      );

      console.log('Password matches:', matchPass);

      if (!matchPass) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const payload = {
        sub: user.id,
        role: user.role,
      };

      const access_token = await this.jwtService.signAsync(payload);

      return {
        access_token,
        token_type: 'Bearer',
        expires_in: 3600,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new InternalServerErrorException('Login failed');
    }
  }
}
