import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import {
  IsEmail, IsEnum, IsInt, IsOptional,
  IsString, Matches, ValidateIf, MaxLength,
} from 'class-validator';

import { TipoEntrega } from '../entities/pedido.entity'

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;
const optTrim = ({ value }: { value: unknown }) =>
  value == null || value === '' ? null : String(value).trim();

export class CreatePedidoDto {

  @ApiProperty({ description: 'ID del carrito a convertir en pedido' })
  @Type(() => Number)
  @IsInt()
  idCarrito!: number;

  @ApiProperty({ description: 'Tipo de entrega', enum: TipoEntrega })
  @IsEnum(TipoEntrega)
  tipoEntrega!: TipoEntrega;

  @ApiProperty({ description: 'Nombre de quien recibe/retira' })
  @Transform(trim)
  @IsString()
  @MaxLength(100)
  nombre!: string;

  @ApiProperty({ description: 'Teléfono de contacto' })
  @Transform(trim)
  @IsString()
  @MaxLength(20)
  telefono!: string;

  @ApiPropertyOptional({ description: 'Email del cliente' })
  @Transform(trim)
  @IsEmail()
  email!: string;

  // ----- Solo aplican si es delivery -----
  @ValidateIf((o) => o.tipoEntrega === TipoEntrega.DELIVERY)
  @Transform(trim)
  @IsString()
  @MaxLength(60)
  departamento!: string;

  @ValidateIf((o) => o.tipoEntrega === TipoEntrega.DELIVERY)
  @Transform(trim)
  @IsString()
  @MaxLength(60)
  provincia!: string;

  @ValidateIf((o) => o.tipoEntrega === TipoEntrega.DELIVERY)
  @Transform(trim)
  @IsString()
  @MaxLength(60)
  distrito!: string;

  @ValidateIf((o) => o.tipoEntrega === TipoEntrega.DELIVERY)
  @Transform(trim)
  @IsString()
  @MaxLength(100)
  ciudad!: string;

  @ValidateIf((o) => o.tipoEntrega === TipoEntrega.DELIVERY)
  @Transform(trim)
  @IsString()
  @MaxLength(255)
  direccion!: string;

  @ApiPropertyOptional({ description: 'Referencia del domicilio' })
  @IsOptional()
  @Transform(optTrim)
  @IsString()
  @MaxLength(255)
  referencia?: string | null;
}
