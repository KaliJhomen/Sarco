import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PedidoDetalleService } from './pedido-detalle.service';
import { PedidoDetalleController } from './pedido-detalle.controller';
import { PedidoDetalle } from './entities/pedido-detalle.entity';
import { Pedido } from '../pedido/entities/pedido.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Producto } from '../producto/entities/producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PedidoDetalle, Pedido, Producto, Usuario])],
  controllers: [PedidoDetalleController],
  providers: [PedidoDetalleService],
  exports: [PedidoDetalleService],
})
export class PedidoDetalleModule {}