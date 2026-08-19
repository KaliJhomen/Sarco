import { IsString, IsBoolean, MaxLength} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMarcaDto {
    @ApiProperty()
    @IsString()
    @MaxLength(20)
    nombre: string;

    @ApiProperty()
    @IsBoolean()
    estado: boolean;
}
