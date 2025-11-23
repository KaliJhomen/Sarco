import { IsString, IsNumber, IsOptional, IsBoolean, IsDateString, IsArray, ArrayNotEmpty, IsInt} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  descripcion?: string | null;

  @ApiProperty({default:0})
  @IsNumber()
  stock: number;

  @ApiProperty({required:false})
  @IsString()
  @IsOptional()
  imagen?: string | null; 

  @ApiProperty({ required:false })
  @IsNumber()
  @IsOptional()
  precioTope?: number | null; 

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  precioVenta?: number | null;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  estado?: boolean | null; 

  @ApiProperty({ required: false, type: String, format: 'date' })
  @IsOptional()
  @IsDateString()
  fechaIngreso?: string | null;

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumber()
  garantiaFabrica?: number | null; 

  @ApiProperty({required:false})
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

