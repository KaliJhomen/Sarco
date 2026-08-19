import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, Min, IsOptional } from "class-validator";

export class CreateCarritoDto {
  @ApiProperty({description: 'ID del producto a agregar' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idProducto!: number;

  @ApiPropertyOptional({description: 'Cantidad del producto' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  cantidad!: number;
}