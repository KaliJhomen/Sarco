import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarritoService } from './carrito.service';
import { CarritoController } from './carrito.controller';
import { Carrito } from './entities/carrito.entity';
import { CarritoItem } from '../carrito-item/entities/carrito-item.entity';
import { Producto } from '../producto/entities/producto.entity';
import { User } from '../user/entities/user.entity'; // <- misma ruta que en service

@Module({
  imports: [TypeOrmModule.forFeature([Carrito, CarritoItem, Producto, User])],
  controllers: [CarritoController],
  providers: [CarritoService],
  exports: [CarritoService],
})
export class CarritoModule {}