import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateOwnerDto {
  @ApiProperty({
    example: 'Shahriar Ahmed',
    description: 'Full name of the rickshaw owner',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '01712345678',
    description: 'Unique 11-digit Bangladeshi mobile number',
    pattern: '^01[3-9]\\d{8}$',
  })
  @IsString()
  @Matches(/^01[3-9]\d{8}$/, {
    message: 'Phone must be an 11-digit Bangladeshi mobile number',
  })
  phone: string;

  @ApiProperty({
    example: 'Aftabnagar, Dhaka',
    description: 'Current address of the owner',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    example: 'NID-2026-001',
    description: 'Reference to the owner identity document (not a file upload)',
  })
  @IsString()
  @IsNotEmpty()
  identityDocumentReference: string;
}
