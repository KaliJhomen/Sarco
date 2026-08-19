import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsNumber, IsOptional, IsString, IsEmail, Matches, MinLength, MaxLength } from "class-validator";
import { Transform, Type } from "class-transformer";
const toNullIfEmpty = ({ value }: { value: unknown }) =>
  value == null || value === '' || typeof value === 'object'
    ? null
    : String(value).trim();

const toNullNumber = ({ value }: { value: unknown }) => {
  if (value == null || value === '' || typeof value === 'object') return null;
  const n = Number(value);
  return Number.isNaN(n) || n <= 0 ? null : n;
};
export class CreateClienteDto {
  @ApiPropertyOptional({ description: 'Id del estado del cliente' })
  @IsOptional()
  @Transform(toNullNumber)
  @IsInt()
  idEstadoCliente?: number | null;

  @ApiPropertyOptional({ description: 'Nombres del cliente' })
  @IsOptional()
  @IsString()
  @Transform(toNullIfEmpty)
  @MaxLength(255)
  nombre?: string | null;

  @ApiPropertyOptional({ description: 'Email del cliente' })
  @Transform(({ value }) =>
    value == null || value === '' || typeof value === 'object'
      ? null
      : String(value).trim().toLowerCase(),
  )
  @IsOptional()
  @MaxLength(255)
  @IsEmail()
  email?: string | null;

  @ApiPropertyOptional({ description: 'Contraseña del cliente' })
  @Transform(toNullIfEmpty)
  @IsString()
  @MaxLength(255)
  @IsOptional()
  clave?: string | null;

  @ApiPropertyOptional({ description: 'Id del tipo de documento' })
  @IsOptional()
  @Transform(toNullNumber)
  @IsInt()
  idDocumento?: number | null;

  @ApiPropertyOptional({ description: 'Número del documento' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  @Transform(toNullIfEmpty)
  numeroDocumento?: string | null;

  @ApiPropertyOptional({ description: 'Teléfono del cliente' })
  @Transform(toNullIfEmpty)
  @IsOptional()
  @MaxLength(255)
  @IsString()
  telefono?: string | null;

  @ApiPropertyOptional({ description: 'Departamento del cliente' })
  @Transform(toNullIfEmpty)
  @IsOptional()
  @MaxLength(60)
  @IsString()
  departamento?: string | null;

  @ApiPropertyOptional({ description: 'Provincia del cliente' })
  @Transform(toNullIfEmpty)
  @IsOptional()
  @MaxLength(60)
  @IsString()
  provincia?: string | null;

  @ApiPropertyOptional({ description: 'Distrito del cliente' })
  @Transform(toNullIfEmpty)
  @IsOptional()
  @MaxLength(60)
  @IsString()
  distrito?: string | null;

  @ApiPropertyOptional({ description: 'Ciudad del cliente' })
  @Transform(toNullIfEmpty)
  @IsOptional()
  @MaxLength(255)
  @IsString()
  ciudad?: string | null;

  @ApiPropertyOptional({ description: 'Dirección del cliente' })
  @Transform(toNullIfEmpty)
  @IsOptional()
  @MaxLength(255)
  @IsString()
  direccion?: string | null;

  @ApiPropertyOptional({ description: 'Referencia de la dirección' })
  @Transform(toNullIfEmpty)
  @IsOptional()
  @MaxLength(255)
  @IsString()
  referencia?: string | null;
}