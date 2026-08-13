import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import {IsNumber, IsString, IsOptional} from 'class-validator'
import { CreateClienteDto } from './create-cliente.dto';
import { Transform, Type } from 'class-transformer'
export class UpdateClienteDto extends PartialType(CreateClienteDto) {

}
