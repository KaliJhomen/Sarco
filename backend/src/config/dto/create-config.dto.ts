import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateConfigDto {

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  valor: string;

  @IsString()
  @IsOptional()
  description?: string;
}