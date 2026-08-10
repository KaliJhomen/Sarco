import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PedidoService } from './pedido.service';
import { PedidoDetalle } from '../pedido-detalle/entities/pedido-detalle.entity';
import { PedidoController } from './pedido.controller';
import { Producto } from '../producto/entities/producto.entity';
import { Usuario } from '../usuario/entities/usuario.entity'; 
import { Pedido } from './entities/pedido.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Pedido, PedidoDetalle, Producto, Usuario])],
  controllers: [PedidoController],
  providers: [PedidoService],
  exports: [PedidoService],
})
export class PedidoModule {}