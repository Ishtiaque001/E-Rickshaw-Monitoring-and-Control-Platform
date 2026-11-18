import { Type } from "class-transformer";
import { 
    IsString,
    IsNotEmpty,
    Length,


 } from "class-validator";
 export class UploadDocumentDto{
    @IsString()
    @IsNotEmpty()
    @Length(2,100)
    documentType: string;

 }