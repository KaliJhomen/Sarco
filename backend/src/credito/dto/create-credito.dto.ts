import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsInt, IsOptional, IsString, Min } from "class-validator";

export class CreateCreditoDto {
  @ApiPropertyOptional({ description: 'Id del usuario que crea el crédito', example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  idUsuario?: number | null;

  @ApiPropertyOptional({ description: 'Id del cliente garante (si aplica)', example: 2 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  idClienteGarante?: number | null;

  @ApiPropertyOptional({ description: 'Id del cliente que recibe el crédito', example: 3 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  idCliente?: number | null;

  @ApiPropertyOptional({ description: 'Id del método de pago', example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  idMetodoPago?: number | null;

  @ApiPropertyOptional({ description: 'Número total de cuotas', example: 12 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  numCuotas?: number | null;

  @ApiPropertyOptional({ description: 'Número de cuotas restantes', example: 12 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  numCuotasRestante?: number | null;

  @ApiPropertyOptional({ description: 'Fecha de inicio del crédito (YYYY-MM-DD)', example: '2024-01-01' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  fechaInicio?: Date | null;

  @ApiPropertyOptional({ description: 'Fecha final del crédito (YYYY-MM-DD)', example: '2024-12-31' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  fechaFinal?: Date | null;

  @ApiPropertyOptional({ description: 'Id del estado del crédito', example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  idEstadoCredito?: number | null;

  @ApiPropertyOptional({ description: 'Garantía extendida del crédito (si aplica)', example: '2025-12-31' })
  @IsString()
  @IsOptional()
  garantiaExtendidaCredito?: string | null;

  @ApiPropertyOptional({ description: 'Garantía de tienda del crédito (si aplica)', example: '2025-12-31' })
  @IsString()
  @IsOptional()
  garantiaTienda?: string | null;

  @ApiPropertyOptional({ description: 'Período de pago del crédito', example: 'Mensual' })
  @IsString()
  @IsOptional()
  periodoPago?: string | null;

  @ApiPropertyOptional({ description: 'Tasa de interés aplicada al crédito', example: '5.5' })
  @IsString()
  @IsOptional()
  interes?: string | null;

  @ApiPropertyOptional({ description: 'Monto inicial del crédito', example: '1000.00' })
  @IsString()
  @IsOptional()
  inicial?: string | null;

  @ApiPropertyOptional({ description: 'Monto por cuota del crédito', example: '100.00' })
  @IsString()
  @IsOptional()
  montoCuota?: string | null;

  @ApiPropertyOptional({ description: 'Monto total de la deuda', example: '1200.00' })
  @IsString()
  @IsOptional()
  montoDeuda?: string | null;

  @ApiPropertyOptional({ description: 'Monto base de la deuda (si aplica)', example: '1000.00' })
  @IsString()
  @IsOptional()
  montoDeudaBase?: string | null;

  @ApiPropertyOptional({ description: 'Monto restante de la deuda', example: '1200.00' })
  @IsString()
  @IsOptional()
  montoDeudaRestante?: string | null;

  @ApiPropertyOptional({ description: 'Id del comprobante asociado (si aplica)', example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  idComprobante?: number | null;

  @ApiPropertyOptional({ description: 'Id del registro que crea el crédito (si aplica)', example: 1 })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  registrar?: number | null;

  @ApiPropertyOptional({ description: 'Id de la tienda donde se crea el crédito', example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  idTienda?: number | null;

  @ApiPropertyOptional({ description: 'Justificación del crédito (si aplica)', example: 'Cliente recurrente' })
  @IsString()
  @IsOptional()
  justificacion?: string | null;
}
