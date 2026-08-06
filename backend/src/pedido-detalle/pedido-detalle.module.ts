import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PedidoDetalleService } from './pedido-detalle.service';
import { PedidoDetalleController } from './pedido-detalle.controller';
import { PedidoDetalle } from './entities/pedido-detalle.entity';
import { Pedido } from '../pedido/entities/pedido.entity';
import { User } from '../user/entities/user.entity';
import { Producto } from '../producto/entities/producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PedidoDetalle, Pedido, Producto, User])],
  controllers: [PedidoDetalleController],
  providers: [PedidoDetalleService],
  exports: [PedidoDetalleService],
})
export class PedidoDetalleModule {}