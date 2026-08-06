import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, Min, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";

export class AddPedidoDetalleDto {
  @ApiProperty({ description: 'ID del producto', example: 1 })
  @IsInt()
  @Type(() => Number)
  idProducto: number;

  @ApiProperty({ description: 'Cantidad del producto', example: 2, minimum: 1 })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  quantity: number;

  @ApiPropertyOptional({ description: 'Token de sesión para usuarios no registrados' })
  @IsOptional()
  @IsString()
  sessionToken?: string;
}