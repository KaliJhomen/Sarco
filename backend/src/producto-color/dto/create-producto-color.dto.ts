import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateProductoColorDto {
  @ApiProperty()
  @IsInt()
  idProducto!: number;

  @ApiProperty()
  @IsInt()
  idColor!: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  stock!: number | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  imagen!: string | null;
}