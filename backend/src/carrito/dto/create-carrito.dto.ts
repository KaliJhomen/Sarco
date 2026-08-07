import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, Min, IsOptional, IsString } from "class-validator";

export class CreateCarritoDto {
  @ApiProperty({description: 'ID del producto a agregar' })
  @IsInt()
  @Min(1)
  idProducto!: number;

  @ApiPropertyOptional({description: 'Cantidad del producto' })
  @IsInt()
  @Min(1)
  @IsOptional()
  cantidad!: number;

  @ApiPropertyOptional({description: 'Token de sesión para carritos de invitados' })
  @IsString()
  @IsOptional()
  sessionToken!: string | null;
}