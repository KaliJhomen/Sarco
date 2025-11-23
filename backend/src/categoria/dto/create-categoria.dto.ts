import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsString } from "class-validator";

export class CreateCategoriaDto {
  @ApiProperty()
  @IsString()
  nombre: string;

  @ApiProperty()
  @IsBoolean()
  estado?: boolean;
}