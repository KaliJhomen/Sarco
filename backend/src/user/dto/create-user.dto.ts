import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsInt, IsBoolean, IsOptional, IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  nombre!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  idDocumento?: number | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  numeroDocumento?: string | null;
  
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  idCargo?: number | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  direccion?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  telefono?: string | null;

  @ApiProperty()
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

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  condicion?: boolean | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  idTienda?: number | null;

  @ApiProperty()
  @IsString()
  rol!: string;
}