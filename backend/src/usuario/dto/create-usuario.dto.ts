import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, IsEmail, MinLength } from 'class-validator';

export class CreateUsuarioDto {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsInt()
  idDocument!: number;

  @ApiProperty()
  @IsString()
  document!: string;

  @ApiProperty()
  @IsInt()
  idRole!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsString()
  login!: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  image!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  background!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  condition?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  idStore!: number;
}