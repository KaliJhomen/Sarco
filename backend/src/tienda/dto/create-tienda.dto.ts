import { IsString, IsOptional, MaxLength} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTiendaDto {
  @ApiProperty()
  @IsString()
  @MaxLength(250)
  nombre: string;

  @ApiProperty()
  @IsString()
  @MaxLength(250)
  direccion: string;

  @ApiProperty({ required: false, type: String, description: 'Condición como bigint' })
  @IsOptional()
  @IsString()
  condicion?: string;
}
