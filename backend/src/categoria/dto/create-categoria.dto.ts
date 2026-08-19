import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateCategoriaDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(25)
  nombre!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  estado!: boolean;
}