  import { Controller, Get, Param, Post, Delete, UseGuards, BadRequestException, Body, ParseIntPipe } from '@nestjs/common';
  import { FavoritosService } from './favoritos.service';
  import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
  import { GuestGuard } from '../auth/guard/guest.guard';
  import { CreateFavoritosDto } from './dto/create-favoritos.dto';
  import { Identity } from 'src/auth/decorators/identity.decorator';
  @ApiTags('Favoritos')
  @Controller('favoritos')
  export class FavoritosController {
    constructor(private readonly favoritosService: FavoritosService) {}

    @UseGuards(GuestGuard)
    @Get()
    @ApiOperation({ summary: 'Obtener favoritos de un cliente o invitado' })
    async getFavoritos(@Identity('id') idCliente: number, @Identity('sessionToken') sessionToken: string){
      if (!idCliente && !sessionToken) throw new BadRequestException('Debe estar autenticado o enviar sessionToken');
      return this.favoritosService.findByClientId({ idCliente, sessionToken });
    }

    @UseGuards(GuestGuard)
    @Post()
    @ApiOperation({ summary: 'Agregar producto a favoritos' })
    @ApiBody({ type: CreateFavoritosDto })
    async addToFavorites(@Identity('id') idCliente: number, @Identity('sessionToken') sessionToken: string, @Body() body: CreateFavoritosDto) {
      if (!idCliente && !sessionToken) throw new BadRequestException('Debe estar autenticado o enviar sessionToken');
      return this.favoritosService.addToFavorites(
        { idCliente, sessionToken },
        body.idProducto,
      );
    }

    @Delete('clear')
    @UseGuards(GuestGuard)
    @ApiOperation({ summary: 'Limpiar favoritos' })
    async clearFavoritos(@Identity('id') idCliente: number, @Identity('sessionToken') sessionToken: string){
      if (!idCliente && !sessionToken) throw new BadRequestException('Debe estar autenticado o enviar sessionToken');
      return this.favoritosService.clearFavorites({ idCliente, sessionToken });
    }

    @Delete(':idProducto')
    @UseGuards(GuestGuard)
    @ApiOperation({ summary: 'Eliminar producto de favoritos (cliente o invitado)' })
    @ApiParam({ name: 'idProducto', type: Number })
    async removeFromFavorites(
      @Identity('id') idCliente: number, @Identity('sessionToken') sessionToken: string,
      @Param('idProducto', ParseIntPipe) idProducto: number,
    ) {
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
