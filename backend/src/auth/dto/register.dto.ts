import { Transform, Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsEmail, IsString, MinLength, IsOptional} from "class-validator";
export class RegisterDto {
@ApiProperty()
@IsString()
@MinLength(1)
nombre!: string;

@ApiProperty()
@Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
@IsEmail()
email!: string;

@ApiPropertyOptional()
@IsOptional()
@Transform(({ value }) => (value == null || value === '' ? null : String(value).trim()))
@IsString()
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
@MinLength(1)
numeroDocumento?: string | null;
    
@ApiProperty()
@Transform(({value}) => value == null ? value : String(value).trim())
@IsString()
@MinLength(8)
clave!: string;
}
