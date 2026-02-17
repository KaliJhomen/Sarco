// filepath: backend/src/favorito/favorito.controller.ts
import { Controller, Post, Delete, Get, Param, Body } from '@nestjs/common';
import { FavoritosService } from './favoritos.service';

@Controller('favoritos')
export class FavoritosController {
  constructor(private readonly favoritosService: FavoritosService) {}

  @Post()
  async addFavorito(@Body() body: { userId: number; productoId: number }) {
    return this.favoritosService.addFavorito(body.userId, body.productoId);
  }

  @Delete(':productoId')
  async removeFavorito(@Param('productoId') productoId: number, @Body('userId') userId: number) {
    return this.favoritosService.removeFavorito(userId, productoId);
  }

  @Get(':userId')
  async getFavoritos(@Param('userId') userId: number) {
    return this.favoritosService.getFavoritos(userId);
  }
}