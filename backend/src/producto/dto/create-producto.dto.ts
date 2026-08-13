import { Type } from 'class-transformer';
import { Matches, IsString, IsOptional, IsBoolean, IsDateString, IsArray, ArrayNotEmpty, IsInt, Min, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductoDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  modelo!: string;
  
  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idMarca!: number;

  @ApiPropertyOptional({ required: false })
  @IsString()
  @IsOptional()
  descripcion!: string | null;

  @ApiProperty({default:0})
  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock!: number;

  @ApiPropertyOptional({ required:false })
  @IsString()
  @IsOptional()
  imagen!: string | null; 

  @ApiPropertyOptional({ required:false })
  @IsString()
  @Matches(/^\d+(\.\d{1,2})?$/)
  @IsOptional()
  precioTope!: string | null; 

  @ApiPropertyOptional({ required: false })
  @Matches(/^\d+(\.\d{1,2})?$/)
  @IsString()
  @IsOptional()
  precioVenta!: string | null;

  @ApiPropertyOptional({ required: false })
  @IsBoolean()
  @IsOptional()
  estado!: boolean | null; 

  @ApiPropertyOptional({ required: false, type: String, format: 'date' })
  @IsOptional()
  @IsDateString()
  fechaIngreso!: string | null;

  @ApiPropertyOptional({ required: false, type: Number })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(0)
  garantiaFabrica!: number | null; 

  @ApiPropertyOptional({required:false})
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(0)
  descuento?: number | null;

  //Relacion
  @ApiProperty({ type: [Number] })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({each:true})
  @Min(1, { each: true })
  idTiposProducto?: number[]; 

}
