import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsDateString,
  Min,
} from 'class-validator';

export class CreateLicenseDto {

  @ApiProperty({
    example: 1,
    description: 'ID of an existing application',
  })
  @IsInt()
  @Min(1)
  applicationId!: number;

  @ApiProperty({
    example: '2026-11-19',
    description: 'License issue date',
  })
  @IsDateString()
  issueDate!: string;

  @ApiProperty({
    example: '2027-11-19',
    description: 'License expiry date',
  })
  @IsDateString()
  expiryDate!: string;
}
