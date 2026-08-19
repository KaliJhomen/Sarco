import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

import {Type} from "class-transformer";

export class CreateFavoritosDto {
  @ApiProperty({description: 'ID del producto a agregar' })
  @Type(() => Number)
  @IsInt()
  idProducto!: number;
}