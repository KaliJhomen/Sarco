import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoritosService } from './favoritos.service';
import { FavoritosController } from './favoritos.controller';
import { Favoritos } from './entities/favoritos.entity';
import { User } from 'src/user/entities/user.entity';
import { Producto } from 'src/producto/entities/producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Favoritos, User, Producto])],
  controllers: [FavoritosController],
  providers: [FavoritosService],
  exports: [FavoritosService], // Ensure the service is exported if used elsewhere
})
export class FavoritosModule {}