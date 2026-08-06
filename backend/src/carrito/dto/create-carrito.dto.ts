import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, Min, IsOptional, IsString } from "class-validator";

export class CreateCarritoDto {
  @ApiProperty({description: 'ID del producto a agregar' })
  @IsInt()
  idProducto: number;

  @ApiPropertyOptional({description: 'Cantidad del producto' })
  @IsInt()
  @Min(1)
  @IsOptional()
  quantity?: number = 1;

  @ApiPropertyOptional({description: 'Token de sesión para carritos de invitados' })
  @IsString()
  @IsOptional()
  sessionToken?: string;
}