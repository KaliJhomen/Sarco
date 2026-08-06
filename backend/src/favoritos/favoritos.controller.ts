import { Controller, Get, Param, Post, Delete, UseGuards, Req, BadRequestException, Query, ParseIntPipe, Body } from '@nestjs/common';
import { FavoritosService } from './favoritos.service';
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { GuestGuard } from '../auth/guard/guest.guard';
import { CreateFavoritosDto } from './dto/create-favoritos.dto';

@ApiTags('Favoritos')
@Controller('favoritos')
export class FavoritosController {
  constructor(private readonly favoritosService: FavoritosService) {}

  @UseGuards(GuestGuard)
  @Get()
  @ApiOperation({ summary: 'Obtener favoritos de un usuario o invitado' })
  @ApiQuery({ name: 'sessionToken', required: false, type: String })
  async getFavoritos(@Req() req: any, @Query('sessionToken') sessionToken?: string) {
    const idUser = req.user?.id;
    if (!idUser && !sessionToken) throw new BadRequestException('Debe estar autenticado o enviar sessionToken');
    return this.favoritosService.findByUserId({ idUser, sessionToken });
  }

  @UseGuards(GuestGuard)
  @Post()
  @ApiOperation({ summary: 'Agregar producto a favoritos' })
  @ApiBody({ type: CreateFavoritosDto })
  async addToFavorites(@Req() req: any, @Body() body: CreateFavoritosDto) {
    const idUser = req.user?.id;
    const sessionToken = idUser ? undefined : body.sessionToken;
    if (!idUser && !sessionToken) throw new BadRequestException('Debe estar autenticado o enviar sessionToken');
    return this.favoritosService.addToFavorites(
      { idUser, sessionToken },
      body.idProducto,
    );
  }

  @UseGuards(GuestGuard)
  @Delete(':idUser')
  @ApiOperation({ summary: 'Limpiar favoritos' })
  async clearFavoritos(@Param('idUser') idUser: number) {
    return this.favoritosService.clearFavorites(+idUser);
  }

  @UseGuards(GuestGuard)
  @Get('shared/:token')
  @ApiOperation({ summary: 'Obtener favoritos compartido' })
  @ApiParam({
    name: 'token',
    description: 'Token de favoritos compartido',
    type: String,
    required: true,
  })
  getSharedFavorites(@Param('token') token: string) {
    return this.favoritosService.findByShareToken(token);
  }

  @UseGuards(GuestGuard)
  @Post('share')
  @ApiOperation({ summary: 'Generar link para compartir favoritos' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        idUser: { type: 'number' },
        sessionToken: { type: 'string' },
      },
    },
  })
  async generateShareLink(@Body() ident: { idUser?: number; sessionToken?: string }) {
    return this.favoritosService.generateShareFavoritesLink(ident);
  }
}
