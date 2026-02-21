import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarritoItemService } from './carrito-item.service';
import { CarritoItemController } from './carrito-item.controller';
import { CarritoItem } from './entities/carrito-item.entity';
import { User} from '../user/entities/user.entity';
import { Carrito } from '../carrito/entities/carrito.entity';
import { Producto } from '../producto/entities/producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CarritoItem, Producto, User, Carrito])],
  controllers: [CarritoItemController],
  providers: [CarritoItemService],
  exports: [CarritoItemService],
})
export class CarritoItemModule {}