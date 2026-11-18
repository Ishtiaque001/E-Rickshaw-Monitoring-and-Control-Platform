import {
  IsString,
  IsNotEmpty,
  Length,
} from 'class-validator';

export class RejectApplicationDto {
  @IsString()
  @IsNotEmpty()
  @Length(5, 500)
  rejectionReason: string;
}
