import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import {
  IsArray, ArrayNotEmpty, IsEmail, IsEnum, IsInt, IsOptional,
  IsString, Matches, Min, ValidateIf, ValidateNested,
} from 'class-validator';

export enum TipoEntrega {
  DELIVERY = 'delivery',
  RECOJO = 'recojo',
}

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;
const optTrim = ({ value }: { value: unknown }) =>
  value == null || value === '' ? null : String(value).trim();

class PedidoItemDto {
  @ApiProperty({ description: 'ID del producto' })
  @Type(() => Number)
  @IsInt()
  idProducto!: number;

  @ApiProperty({ description: 'Cantidad del producto' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  cantidad!: number;
}

export class CreatePedidoDto {

  @ApiPropertyOptional({ description: 'Codigo ubigeo del cliente' })
  @IsOptional()
  @Transform(({ value }) => (value == null || value === '' ? null : String(value).trim()))
  @Matches(/^\d{6}$/)
  @IsString()
  ubigeoCodigo?: string | null;

  @ApiProperty({ description: 'Tipo de entrega', enum: TipoEntrega })
  @IsEnum(TipoEntrega)
  tipoEntrega!: TipoEntrega;

  @ApiProperty({ description: 'Nombre de quien recibe/retira' })
  @Transform(trim)
  @IsString()
  nombre!: string;

  @ApiProperty({ description: 'Teléfono de contacto' })
  @Transform(trim)
  @IsString()
  telefono!: string;

  @ApiPropertyOptional({ description: 'Email del cliente' })
  @Transform(trim)
  @IsEmail()
  email!: string;

  // ----- Solo aplican si es delivery -----
  @ValidateIf((o) => o.tipoEntrega === TipoEntrega.DELIVERY)
  @Transform(trim)
  @IsString()
  departamento!: string;

  @ValidateIf((o) => o.tipoEntrega === TipoEntrega.DELIVERY)
  @Transform(trim)
  @IsString()
  provincia!: string;

  @ValidateIf((o) => o.tipoEntrega === TipoEntrega.DELIVERY)
  @Transform(trim)
  @IsString()
  distrito!: string;

  @ValidateIf((o) => o.tipoEntrega === TipoEntrega.DELIVERY)
  @Transform(trim)
  @IsString()
  ciudad!: string;

  @ValidateIf((o) => o.tipoEntrega === TipoEntrega.DELIVERY)
  @Transform(trim)
  @IsString()
  direccion!: string;

  @ApiPropertyOptional({ description: 'Referencia del domicilio' })
  @IsOptional()
  @Transform(optTrim)
  @IsString()
  referencia?: string | null;
  
  @ApiProperty({ type: [PedidoItemDto], description: 'Items del pedido' })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PedidoItemDto)
  items!: PedidoItemDto[];
}