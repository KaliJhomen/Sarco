import { IsString, IsNumber, IsOptional, IsBoolean, IsDateString, IsArray, ArrayNotEmpty, IsInt, Min} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductoDto {
  @ApiProperty()
  @IsString()
  nombre: string;

  @ApiProperty()
  @IsString()
  modelo: string;
  
  @ApiProperty()
  @IsNumber()
  idMarca: number;

  @ApiPropertyOptional({ required: false })
  @IsString()
  @IsOptional()
  descripcion?: string | null;

  @ApiProperty({default:0})
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiPropertyOptional({ required:false })
  @IsString()
  @IsOptional()
  imagen?: string | null; 

  @ApiPropertyOptional({ required:false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  precioTope?: number | null; 

  @ApiPropertyOptional({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  precioVenta?: number | null;

  @ApiPropertyOptional({ required: false })
  @IsBoolean()
  @IsOptional()
  estado?: boolean | null; 

  @ApiPropertyOptional({ required: false, type: String, format: 'date' })
  @IsOptional()
  @IsDateString()
  fechaIngreso?: string | null;

  @ApiPropertyOptional({ required: false, type: Number })
  @IsOptional()
  @IsNumber()
  garantiaFabrica?: number | null; 

  @ApiPropertyOptional({required:false})
  @IsNumber()
  @IsOptional()
  descuento?: number | null;

  //Relacion
  @ApiProperty({ type: [Number] })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({each:true})
  idTiposProducto: number[];
}

