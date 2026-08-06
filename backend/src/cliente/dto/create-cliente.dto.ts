import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { Transform, Type } from "class-transformer";

export class CreateClienteDto {
@ApiPropertyOptional({ description: 'Nombres del cliente' })
@IsOptional()
@IsString()
@Transform(({ value }) => (value === undefined || value === '' ? null : String(value).trim()))
nombre?: string | null;

@ApiPropertyOptional({ description: 'Id del tipo de documento' })
@IsOptional()
@Type(() => Number)
@IsNumber()
idDocumento?: number | null;

@ApiProperty({ description: 'Número del documento' })
@IsString()
@Transform(({ value }) => String(value).trim())
numeroDocumento: string

@ApiPropertyOptional({ description: 'Dirección del cliente' })
@IsOptional()
@IsString()
@Transform(({ value }) => (value === undefined || value === '' ? null : String(value).trim()))
direccion?: string | null;

@ApiPropertyOptional({ description: 'Referencia de la dirección' })
@IsOptional()
@IsString()
@Transform(({ value }) => (value === undefined || value === '' ? null : String(value).trim()))
referencia?: string | null;

@ApiPropertyOptional({ description: 'Dirección del DNI' })
@IsOptional()
@IsString()
@Transform(({ value }) => (value === undefined || value === '' ? null : String(value).trim()))
direccionDni?: string | null;

@ApiPropertyOptional({ description: 'Teléfono del cliente' })
@IsOptional()
@IsString()
@Transform(({ value }) => (value === undefined || value === '' ? null : String(value).trim()))
telefono?: string | null;

@ApiPropertyOptional({ description: 'Email del cliente' })
@IsOptional()
@IsString()
@Transform(({ value }) => (value === undefined || value === '' ? null : String(value).trim()))
email?: string | null;

@ApiPropertyOptional({ description: 'Id del estado del cliente' })
@IsOptional()
@Type(() => Number)
@IsNumber()
idEstadoCliente?: number | null;
}