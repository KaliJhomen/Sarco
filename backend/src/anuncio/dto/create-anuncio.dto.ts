import { IsString, IsOptional, IsBoolean, IsInt, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateAnuncioDto {
  @ApiProperty()
  @IsString()
  titulo: string;
  
  @ApiProperty()
  @IsString()
  imagen: string;
  
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl()
  urlDestino?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  orden?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  estado?: boolean;
}
