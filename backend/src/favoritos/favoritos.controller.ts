  import { Controller, Get, Param, Post, Delete, UseGuards, Req, BadRequestException, Query, Body, ParseIntPipe } from '@nestjs/common';
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
    @ApiOperation({ summary: 'Obtener favoritos de un cliente o invitado' })
    @ApiQuery({ name: 'sessionToken', required: false, type: String })
    async getFavoritos(@Req() req: any, @Query('sessionToken') sessionToken?: string) {
      const idCliente= req.cliente?.id;
      if (!idCliente && !sessionToken) throw new BadRequestException('Debe estar autenticado o enviar sessionToken');
      return this.favoritosService.findByClientId({ idCliente, sessionToken });
    }

    @UseGuards(GuestGuard)
    @Post()
    @ApiOperation({ summary: 'Agregar producto a favoritos' })
    @ApiBody({ type: CreateFavoritosDto })
    async addToFavorites(@Req() req: any, @Body() body: CreateFavoritosDto) {
      const idCliente = req.cliente?.id;
      const sessionToken = idCliente ? undefined : body.sessionToken;
      if (!idCliente && !sessionToken) throw new BadRequestException('Debe estar autenticado o enviar sessionToken');
      return this.favoritosService.addToFavorites(
        { idCliente, sessionToken },
        body.idProducto,
      );
    }

    @Delete('clear')
    @UseGuards(GuestGuard)
    @ApiOperation({ summary: 'Limpiar favoritos' })
    async clearFavoritos(@Req() req: any, @Query('sessionToken') sessionToken?: string) {
      const idCliente = req.cliente?.id;
      if (!idCliente && !sessionToken) throw new BadRequestException('Debe estar autenticado o enviar sessionToken');
      return this.favoritosService.clearFavorites({ idCliente, sessionToken });
    }

    @Delete(':idProducto')
    @UseGuards(GuestGuard)
    @ApiOperation({ summary: 'Eliminar producto de favoritos (cliente o invitado)' })
    @ApiParam({ name: 'idProducto', type: Number })
    async removeFromFavorites(
      @Req() req: any,
      @Param('idProducto', ParseIntPipe) idProducto: number,
      @Query('sessionToken') sessionToken?: string,
    ) {
      const idCliente = req.cliente?.id;
      if (!idCliente && !sessionToken) throw new BadRequestException('Debe estar autenticado o enviar sessionToken');
      return this.favoritosService.removeFromFavorites(
        { idCliente, sessionToken },
        idProducto,
      );
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
          idCliente: { type: 'number' },
          sessionToken: { type: 'string' },
        },
      },
    })
    async generateShareLink(@Body() ident: { idCliente?: number; sessionToken?: string }) {
      return this.favoritosService.generateShareFavoritesLink(ident);
    }
  }
