import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favoritos } from './entities/favoritos.entity';
import { FavoritosItem } from './entities/favoritos-item.entity';
import { Cliente } from '../cliente/entities/cliente.entity';
import { Producto } from '../producto/entities/producto.entity';
import { User } from '../user/entities/user.entity';
import { FavoritosService } from './favoritos.service';
import { FavoritosController } from './favoritos.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Favoritos, FavoritosItem, Cliente, Producto, User]),
  ],
  controllers: [FavoritosController],
  providers: [FavoritosService],
  exports: [FavoritosService],
})
export class FavoritosModule {}