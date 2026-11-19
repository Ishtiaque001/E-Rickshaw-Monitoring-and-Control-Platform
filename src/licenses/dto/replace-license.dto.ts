
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class ReplaceLicenseDto {

  @ApiProperty({
    example: '2028-11-19',
    description: 'Replacement expiry date',
  })
  @IsDateString()
  expiryDate!: string;
}
