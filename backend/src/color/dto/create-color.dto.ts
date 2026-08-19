import { IsNotEmpty, IsString, MaxLength} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class CreateColorDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  nombre!: string;

  @ApiProperty()
  @IsNotEmpty()  
  @IsString()
  @MaxLength(7)
  codigoHex!: string;

}