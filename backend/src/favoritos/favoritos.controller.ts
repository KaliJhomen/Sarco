import { Controller, Post, Delete, Get, Param, Body } from '@nestjs/common';
import { FavoritosService } from './favoritos.service';

@Controller('favoritos')
export class FavoritosController {
  constructor(private readonly favoritosService: FavoritosService) {}

  @Post()
  async addFavorito(@Body() body: { userId: number; idProducto: number }) {
    return this.favoritosService.addFavorito(body.userId, body.idProducto);
  }

  @Delete(':idProducto')
  async removeFavorito(@Param('idProducto') idProducto: number, @Body('userId') userId: number) {
    return this.favoritosService.removeFavorito(userId, idProducto);
  }

  @Get(':idUser')
  async getFavoritos(@Param('idUser') idUser: number) {
    return this.favoritosService.getFavoritos(idUser);
  }
}