import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsInt, IsBoolean, IsOptional, IsEmail, MinLength, MaxLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @MaxLength(255)
  nombre!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  idDocumento?: number | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  numeroDocumento?: string | null;
  
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  idCargo?: number | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  direccion?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  telefono?: string | null;

  @ApiProperty()
  @IsEmail()
  @MaxLength(255)
  email!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(255)
  login!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(255)
  @MinLength(6)
  clave!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  imagen?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  fondo?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  condicion?: boolean | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  idTienda?: number | null;

  @ApiProperty()
  @MaxLength(255)
  @IsString()
  rol!: string;
}