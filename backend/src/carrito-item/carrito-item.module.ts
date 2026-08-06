import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarritoItemService } from './carrito-item.service';
import { CarritoItemController } from './carrito-item.controller';
import { CarritoItem } from './entities/carrito-item.entity';
import { Cliente } from '../cliente/entities/cliente.entity';
import { Carrito } from '../carrito/entities/carrito.entity';
import { Producto } from '../producto/entities/producto.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CarritoItem, Producto, Cliente, Carrito, User])],
  controllers: [CarritoItemController],
  providers: [CarritoItemService],
  exports: [CarritoItemService],
})
export class CarritoItemModule {}