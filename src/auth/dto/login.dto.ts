import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    format: 'email',
    maxLength: 150,
    description: 'Email of an existing active account',
  })
  @IsEmail()
  @MaxLength(150)
  email: string;

  @ApiProperty({
    format: 'password',
    minLength: 8,
    maxLength: 72,
    writeOnly: true,
    description: 'Your account password; maximum 72 UTF-8 bytes',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password: string;
}