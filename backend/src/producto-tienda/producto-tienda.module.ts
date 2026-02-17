import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductoTienda } from './entities/producto-tienda.entity';

import { ProductoTiendaService } from './producto-tienda.service';
import { ProductoTiendaController } from './producto-tienda.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProductoTienda])],

  controllers: [ProductoTiendaController],
  providers: [ProductoTiendaService],
})  
export class ProductoTiendaModule {}
