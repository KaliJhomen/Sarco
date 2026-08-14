import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsNumber, IsOptional, IsString, IsEmail, Matches, MinLength } from "class-validator";
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
  nombre?: string | null;

  @ApiPropertyOptional({ description: 'Email del cliente' })
  @Transform(({ value }) =>
    value == null || value === '' || typeof value === 'object'
      ? null
      : String(value).trim().toLowerCase(),
  )
  @IsOptional()
  @IsEmail()
  email?: string | null;

  @ApiPropertyOptional({ description: 'Contraseña del cliente' })
  @Transform(toNullIfEmpty)
  @IsString()
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
  @Transform(toNullIfEmpty)
  numeroDocumento?: string | null;

  @ApiPropertyOptional({ description: 'Teléfono del cliente' })
  @Transform(toNullIfEmpty)
  @IsOptional()
  @IsString()
  telefono?: string | null;

  @ApiPropertyOptional({ description: 'Departamento del cliente' })
  @Transform(toNullIfEmpty)
  @IsOptional()
  @IsString()
  departamento?: string | null;

  @ApiPropertyOptional({ description: 'Provincia del cliente' })
  @Transform(toNullIfEmpty)
  @IsOptional()
  @IsString()
  provincia?: string | null;

  @ApiPropertyOptional({ description: 'Distrito del cliente' })
  @Transform(toNullIfEmpty)
  @IsOptional()
  @IsString()
  distrito?: string | null;

  @ApiPropertyOptional({ description: 'Ciudad del cliente' })
  @Transform(toNullIfEmpty)
  @IsOptional()
  @IsString()
  ciudad?: string | null;

  @ApiPropertyOptional({ description: 'Dirección del cliente' })
  @Transform(toNullIfEmpty)
  @IsOptional()
  @IsString()
  direccion?: string | null;

  @ApiPropertyOptional({ description: 'Referencia de la dirección' })
  @Transform(toNullIfEmpty)
  @IsOptional()
  @IsString()
  referencia?: string | null;
}