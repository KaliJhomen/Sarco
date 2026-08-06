import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoritosItemService } from './favoritos-item.service';
import { FavoritosItemController } from './favoritos-item.controller';
import { FavoritosItem } from './entities/favoritos-item.entity';
import { Cliente } from '../cliente/entities/cliente.entity';
import { Favoritos } from '../favoritos/entities/favoritos.entity';
import { Producto } from '../producto/entities/producto.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FavoritosItem, Producto, Cliente, Favoritos, User])],
  controllers: [FavoritosItemController],
  providers: [FavoritosItemService],
  exports: [FavoritosItemService],
})
export class FavoritosItemModule {}