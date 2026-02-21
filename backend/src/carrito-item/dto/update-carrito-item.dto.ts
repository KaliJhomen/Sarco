import { PartialType } from '@nestjs/swagger';
import { CreateCarritoDto } from './create-carrito-item.dto';

export class UpdateCarritoDto extends PartialType(CreateCarritoDto) {}
