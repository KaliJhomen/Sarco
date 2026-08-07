import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString } from "class-validator";

import {Type} from "class-transformer";

export class CreateFavoritosDto {
  @ApiProperty({description: 'ID del producto a agregar' })
  @Type(() => Number)
  @IsInt()
  idProducto!: number;

  @ApiPropertyOptional({description: 'Token de sesión para carritos de invitados' })
  @IsString()
  @IsOptional()
  sessionToken!: string | null;
}