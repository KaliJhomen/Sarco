import { IsString, IsBoolean, IsInt, MaxLength} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubCategoriaDto {
  @ApiProperty()
  @IsString()
  @MaxLength(25)
  nombre!: string;

  @ApiProperty()
  @IsInt()   
  idCategoria!: number;

  @ApiProperty({ type: Boolean, description: 'Estado' })
  @IsBoolean()
  estado!: boolean;
}
