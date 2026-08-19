import { IsString, IsOptional, IsBoolean, IsInt, IsUrl, MaxLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateAnuncioDto {
  @ApiProperty()
  @IsString()
  @MaxLength(255)
  titulo!: string;
  
  @ApiProperty()
  @IsString()
  @MaxLength(500)
  imagen!: string;
  
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl()
  @MaxLength(255)
  urlDestino?: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsInt()
  orden!: number;

  @ApiProperty({ required: true })
  @IsBoolean()
  estado!: boolean;
}
