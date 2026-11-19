import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsOptional,
} from 'class-validator';

export class UpdateLicenseDto {

  @ApiPropertyOptional({
    example: '2028-11-19',
    description: 'New license expiry date',
  })
  @IsOptional()
  @IsDateString()
  expiryDate?: string;
}
