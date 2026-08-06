import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { Transform, Type } from "class-transformer";

export class CreateFavoritosItemDto {
  @ApiProperty({ description: 'ID del producto favorito', example: 1 })
  @IsNumber()
  idProducto: number;

}