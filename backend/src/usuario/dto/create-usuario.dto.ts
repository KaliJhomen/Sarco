import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, IsEmail, MinLength } from 'class-validator';

export class CreateUsuarioDto {
  @ApiProperty()
  @IsString()
  nombre!: string;

  @ApiPropertyOptional()
  @IsInt()
  idDocumento?: number | null;

  @ApiPropertyOptional()
  @IsString()
  documento?: string | null;
/*
  @ApiProperty()
  @IsInt()
  idRol!: number;
*/
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  direccion?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  telefono?: string | null;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsString()
  login!: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  clave!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imagen?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fondo?: string | null;
/*
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  condicion?: number;
*/
}