import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from "class-transformer";
import { IsEmail, IsString, MinLength, IsOptional, MaxLength } from "class-validator";

export class LoginDto {
    
@ApiProperty()
@Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
@MaxLength(255)
@IsEmail()
email!: string;

@ApiProperty()
@Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
@IsString()
@MaxLength(255)
@MinLength(8, {message:"La contraseña debe tener al menos 8 caracteres"})
clave!: string;

@ApiPropertyOptional()
@IsOptional()
@IsString()
sessionToken?: string;
}