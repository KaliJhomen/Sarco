import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, IsEmail, MinLength } from 'class-validator';

export class CreateUsuarioDto {
  @ApiProperty()
  @IsString()
  nombre: string;

  @ApiProperty()
  @IsInt()
  idDocumento: number;

  @ApiProperty()
  @IsString()
  numeroDocumento: string;

  @ApiProperty()
  @IsInt()
  idCargo: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  direccion: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  telefono: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  login: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  clave: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imagen: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fondo: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  condicion?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  idTienda: number;
}