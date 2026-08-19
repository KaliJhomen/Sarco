import { Transform, Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { MaxLength, IsInt, IsEmail, IsString, MinLength, IsOptional} from "class-validator";
export class RegisterDto {
@ApiProperty()
@IsString()
@MaxLength(255)
@MinLength(1)
nombre!: string;

@ApiProperty()
@Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
@MaxLength(255)
@IsEmail()
email!: string;

@ApiPropertyOptional()
@IsOptional()
@Transform(({ value }) => (value == null || value === '' ? null : String(value).trim()))
@IsString()
@MaxLength(255)
@MinLength(9)
telefono?: string | null;

@ApiPropertyOptional()
@Transform(({ value }) => (value == null || value === '' || Number(value) <= 0 ? null : Number(value))) 
@IsOptional()
@IsInt()
idDocumento?: number | null;
    
@ApiPropertyOptional()
@Transform(({ value }) => (value == null || value === '' ? null : String(value).trim()))
@IsOptional()
@IsString()
@MaxLength(255)
@MinLength(1)
numeroDocumento?: string | null;
    
@ApiProperty()
@Transform(({value}) => value == null ? value : String(value).trim())
@IsString()
@MaxLength(255)
@MinLength(8)
clave!: string;
}
