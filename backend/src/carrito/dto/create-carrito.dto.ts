import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, Min, IsOptional } from "class-validator";

export class CreateCarritoDto {
  @ApiProperty({ example: 123, description: 'ID del producto a agregar' })
  @IsInt()
  idProducto: number;

  @ApiPropertyOptional({ example: 1, description: 'Cantidad del producto' })
  @IsInt()
  @Min(1)
  @IsOptional()
  quantity?: number = 1;
}