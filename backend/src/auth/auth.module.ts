import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ClienteModule } from '../cliente/cliente.module';
import { CarritoModule } from '../carrito/carrito.module';
import { FavoritosModule } from '../favoritos/favoritos.module';



@Module({
  imports: [
    ClienteModule,
    CarritoModule,
    FavoritosModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
