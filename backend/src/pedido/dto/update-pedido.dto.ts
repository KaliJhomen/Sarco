import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EstadoPedido } from '../entities/pedido.entity';
import { Transform } from 'class-transformer'
const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;
const optTrim = ({ value }: { value: unknown }) =>
  value == null || value === '' ? null : String(value).trim();
export class UpdatePedidoDto {
  // estado: el cliente solo puede enviar CANCELADO; el admin cualquier transición
  @ApiPropertyOptional({ description: 'Nuevo estado del pedido', enum: EstadoPedido })
  @IsOptional()
  @IsEnum(EstadoPedido)
  estado?: EstadoPedido;

  // ---- Dirección/referencia editable por el cliente ----
  @ApiPropertyOptional({ description: 'Departamento (solo delivery)' })
  @IsOptional()
  @Transform(trim)
  @IsString()
  departamento?: string;
  
  @ApiPropertyOptional({ description: 'Referencia del domicilio' })
  @IsOptional()
  @Transform(optTrim)
  @IsString()
  referencia?: string | null;

  // provincia, distrito, ciudad, direccion
  @ApiPropertyOptional({ description: 'Provincia (solo delivery)' })
    @IsOptional()
    @Transform(trim)
    @IsString()
    provincia?: string;

    @ApiPropertyOptional({ description: 'Distrito (solo delivery)' })
    @IsOptional()
    @Transform(trim)
    @IsString()
    distrito?: string;

    @ApiPropertyOptional({ description: 'Ciudad (solo delivery)' })
    @IsOptional()
    @Transform(trim)
    @IsString()
    ciudad?: string;

    @ApiPropertyOptional({ description: 'Dirección de entrega (solo delivery)' })
    @IsOptional()
    @Transform(trim)
    @IsString()
    direccion?: string;
}
