import { IsString, IsBoolean, IsNumber} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubCategoriaDto {
  @ApiProperty()
  @IsString()
  nombre: string;

  @ApiProperty()
  @IsNumber()   
  idCategoria: number;

  @ApiProperty({ type: Boolean, description: 'Estado' })
  @IsBoolean()
  estado: boolean;
}
