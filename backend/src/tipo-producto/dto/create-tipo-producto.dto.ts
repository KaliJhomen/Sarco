import { IsString, IsOptional, IsBoolean, IsArray, ArrayNotEmpty, IsInt} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTipoProductoDto {
  @ApiProperty()
  @IsString()
  nombre: string;

  @ApiProperty()
  @IsBoolean()
  estado?: boolean; 
  //Relacion
  @ApiProperty({ type: [Number] })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({each:true})
  idSubCategorias: number[];
}
