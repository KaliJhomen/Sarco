import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString, IsEmail } from "class-validator";
import { Transform, Type } from "class-transformer";

export class CreateClienteDto {

@ApiPropertyOptional({ description: 'Id del estado del cliente' })
@IsOptional()
@Type(() => Number)
@IsNumber()
idEstadoCliente?: number | null;

@ApiPropertyOptional({ description: 'Nombres del cliente' })
@IsOptional()
@IsString()
@Transform(({ value }) => (value === undefined || value === '' ? null : String(value).trim()))
nombre?: string | null;

@ApiPropertyOptional({ description: 'Login del cliente' })
@IsString()
@IsOptional()
@Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
login?: string | null;

@ApiPropertyOptional({ description: 'Email del cliente' })
@IsOptional()
@IsEmail()
@IsString()
@Transform(({ value }) => (value === undefined || value === '' ? null : String(value).trim()))
email?: string | null;

@ApiPropertyOptional({ description: 'Contraseña del cliente' })
@IsString()
@IsOptional()
@Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
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

@ApiPropertyOptional({ description: 'Ciudad del cliente' })
@IsOptional()
@IsString()
@Transform(({ value }) => (value === undefined || value === '' ? null : String(value).trim()))
ciudad?: string | null;

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

@ApiPropertyOptional({ description: 'Imagen de perfil del cliente' })
@IsOptional()
@IsString()
@Transform(({ value }) => (value === undefined || value === '' ? null : String(value).trim()))
imagen?: string | null;

@ApiPropertyOptional({ description: 'Imagen de fondo del cliente' })
@IsOptional()
@IsString()
@Transform(({ value }) => (value === undefined || value === '' ? null : String(value).trim()))
fondo?: string | null;
}