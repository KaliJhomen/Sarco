import { PartialType } from '@nestjs/swagger';
import { CreatePedidoDetalleDto } from './create-pedido-detalle.dto';

export class UpdatePedidoDetalleDto extends PartialType(CreatePedidoDetalleDto) {}
