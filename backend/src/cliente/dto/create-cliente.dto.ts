import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString, IsEmail, Matches } from "class-validator";
import { Transform, Type } from "class-transformer";

export class CreateClienteDto {

@ApiPropertyOptional({ description: 'Id del estado del cliente' })
@IsOptional()
@Type(() => Number)
@IsNumber()
idEstadoCliente?: number | null;

@ApiPropertyOptional({ description: 'Codigo ubigeo del cliente' })
@IsOptional()
@Transform(({ value }) => (value == null || value === '' ? null : String(value).trim()))
@Matches(/^\d{6}$/)
@IsString()
ubigeoCodigo?: string | null;

@ApiPropertyOptional({ description: 'Nombres del cliente' })
@IsOptional()
@IsString()
@Transform(({ value }) => (value == null || value === '' ? null : String(value).trim()))
nombre?: string | null;

@ApiPropertyOptional({ description: 'Email del cliente' })
@Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
@IsOptional()
@IsEmail()
email?: string | null;

@ApiPropertyOptional({ description: 'Contraseña del cliente' })
@Transform(({ value }) => (value == null || value === '' ? null : String(value).trim()))
@IsString()
@IsOptional()
clave?: string | null;

@ApiPropertyOptional({ description: 'Id del tipo de documento' })
@IsOptional()
@Type(() => Number)
@IsNumber()
idDocumento?: number | null;

@ApiPropertyOptional({ description: 'Número del documento' })
@IsOptional()
@IsString()
@Transform(({ value }) => (value === undefined || value === '' ? null : String(value).trim()))
numeroDocumento?: string | null

@ApiPropertyOptional({ description: 'Teléfono del cliente' })
@Transform(({ value }) => (value == null || value === '' ? null : String(value).trim()))
@IsOptional()
@IsString()
telefono?: string | null;

@ApiPropertyOptional({ description: 'Departamento del cliente' })
@IsOptional()
@IsString()
departamento?: string | null;

@ApiPropertyOptional({ description: 'Provincia del cliente' })
@IsOptional()
@IsString()
provincia?: string | null;

@ApiPropertyOptional({ description: 'Distrito del cliente' })
@IsOptional()
@IsString()
distrito?: string | null;

@ApiPropertyOptional({ description: 'Ciudad del cliente' })
@IsOptional()
@IsString()
ciudad?: string | null;

@ApiPropertyOptional({ description: 'Dirección del cliente' })
@Transform(({ value }) => (value == null || value === '' ? null : String(value).trim()))
@IsOptional()
@IsString()
direccion?: string | null;

@ApiPropertyOptional({ description: 'Referencia de la dirección' })
@Transform(({ value }) => (value == null || value === '' ? null : String(value).trim()))
@IsOptional()
@IsString()
referencia?: string | null;
}