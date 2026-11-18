import {
  IsString,
  IsNotEmpty,
  Matches,
} from 'class-validator';

export class CreateOwnerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @Matches(/^01[3-9]\d{8}$/, {
    message: 'Enter a valid Bangladeshi mobile number',
  })
  phone: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  identityDocumentReference: string;
}
