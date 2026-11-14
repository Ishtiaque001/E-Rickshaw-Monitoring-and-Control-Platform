
import {
  IsInt,
  IsDateString,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateLicenseDto {

  @IsInt()
  @Min(1)
  applicationId: number;

  @IsDateString()
  issueDate: string;

  @IsDateString()
  expiryDate: string;
}
