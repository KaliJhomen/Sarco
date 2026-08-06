import { Controller, Get, Post, Delete, Body, Param, Req, UseGuards, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';
import { FavoritosItemService } from './favoritos-item.service';
import { AuthGuard } from '../auth/guard/auth.guard';
import { CreateFavoritosItemDto } from './dto/create-favoritos-item.dto';

@ApiTags('FavoritosItem')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('favoritos-item')
export class FavoritosItemController {
  constructor(private readonly favoritosItemService: FavoritosItemService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener favoritos del usuario autenticado' })
  getFavorites(@Req() req: any) {
    const idUser = req.user?.idUser;
    if (!idUser) throw new BadRequestException('Usuario no autenticado');
    return this.favoritosItemService.findByUserId({ idUser });
  }

  @Post()
  @ApiOperation({ summary: 'Agregar producto a favoritos del usuario autenticado' })
  @ApiBody({ type: CreateFavoritosItemDto })
  addToFavorites(@Req() req: any, @Body() body: CreateFavoritosItemDto) {
    const idUser = req.user?.idUser;
    if (!idUser) throw new BadRequestException('Usuario no autenticado');
    if (!body?.idProducto) throw new BadRequestException('idProducto es requerido');
    return this.favoritosItemService.addToFavorites({ idUser }, Number(body.idProducto));
  }

  @Delete(':idProducto')
  @ApiOperation({ summary: 'Eliminar favorito del usuario autenticado' })
  @ApiParam({ name: 'idProducto', type: Number })
  removeFromFavorites(
    @Req() req: any,
    @Param('idProducto', ParseIntPipe) idProducto: number,
  ) {
    const idUser = req.user?.idUser;
    if (!idUser) throw new BadRequestException('Usuario no autenticado');
    return this.favoritosItemService.removeFromFavorites({ idUser }, idProducto);
  }
}
