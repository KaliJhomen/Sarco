import { IsString, IsBoolean} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMarcaDto {
    @ApiProperty()
    @IsString()
    nombre: string;

    @ApiProperty()
    @IsBoolean()
    estado: boolean;
}
