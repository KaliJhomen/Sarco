import { IsString, IsNumber, IsOptional, IsBoolean, IsDateString} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTipoProductoDto {
  @ApiProperty()
  @IsString()
  nombre: string;

  @ApiProperty()
  @IsBoolean()
  estado?: boolean; 
}
