import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favoritos } from './entities/favoritos.entity';
import { FavoritosItem } from './entities/favoritos-item.entity';
import { randomUUID } from 'crypto';
import { Producto } from '../producto/entities/producto.entity';

type FavoritesIdent = { idCliente?: number; sessionToken?: string | null };

@Injectable()
export class FavoritosService {
  constructor(
    @InjectRepository(Favoritos)
    private readonly favoritesRepository: Repository<Favoritos>,
    @InjectRepository(FavoritosItem)
    private readonly favoritesItemRepository: Repository<FavoritosItem>,
    @InjectRepository(Producto)
    private readonly productRepository: Repository<Producto>,
  ) {}

  ///
  /// PRIVADOS
  ///
  private async findFavorites(ident: FavoritesIdent): Promise<Favoritos | null> {
    const { idCliente, sessionToken } = ident;
    if (idCliente) return this.getFavoritesByClient(idCliente);
    if (sessionToken) return this.getFavoritesBySession(sessionToken);
    return null;
  }

  private async findOrCreateFavorites(ident: FavoritesIdent): Promise<Favoritos> {
    const favoritos = await this.findFavorites(ident);
    if (favoritos) return favoritos;

    const { idCliente, sessionToken } = ident;
    if (idCliente) return this.createFavorites(idCliente);
    if (sessionToken) return this.createGuestFavorites(sessionToken);

    throw new NotFoundException('No se pudo crear los favoritos');
  }

  private async findFavoritesItem(favoritos: Favoritos, idProducto: number): Promise<FavoritosItem | null> {
    return this.favoritesItemRepository.findOne({
      where: {
        favoritos: { idFavoritos: favoritos.idFavoritos },
        producto: { idProducto },
      },
    });
  }

  private async getFavoritesByClient(idCliente: number): Promise<Favoritos | null> {
    return this.favoritesRepository.findOne({
      where: { cliente: { idCliente } },
      relations: ['items', 'items.producto'],
    });
  }

  private async getFavoritesBySession(sessionToken: string): Promise<Favoritos | null> {
    return this.favoritesRepository.findOne({
      where: { sessionToken },
      relations: ['items', 'items.producto'],
    });
  }

  private async createFavorites(idCliente: number): Promise<Favoritos> {
    return this.favoritesRepository.save(
      this.favoritesRepository.create({
        sessionToken: null,
        shareToken: null,
        expiresAt: null,
        cliente: { idCliente },
        items: [],
      })
    );
  }

  private async createGuestFavorites(sessionToken: string): Promise<Favoritos> {
    return this.favoritesRepository.save(
      this.favoritesRepository.create({
        sessionToken,
        shareToken: null,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        items: [],
      })
    );
  }

  ///
  /// PÚBLICOS
  ///
  async findByClientId(ident: FavoritesIdent) {
    const favoritos = await this.findFavorites(ident);
    if (!favoritos) return { items: [] };
    return { items: favoritos.items.map(item => item.producto) };
  }

  async addToFavorites(ident: FavoritesIdent, idProducto: number) {
    const product = await this.productRepository.findOne({ where: { idProducto } });
    if (!product) {
      throw new NotFoundException(`Producto con ID ${idProducto} no encontrado`);
    }

    const favoritos = await this.findOrCreateFavorites(ident);
    const existingItem = await this.findFavoritesItem(favoritos, idProducto);

    if (existingItem) return existingItem;

    return this.favoritesItemRepository.save(
      this.favoritesItemRepository.create({
        favoritos,
        producto: product,
      })
    );
  }

  async removeFromFavorites(ident: FavoritesIdent, idProducto: number) {
    const favoritos = await this.findFavorites(ident);
    if (!favoritos) throw new NotFoundException('Favoritos no encontrados');

    const item = await this.findFavoritesItem(favoritos, idProducto);
    if (!item) throw new NotFoundException(`El producto con ID ${idProducto} no está en favoritos`);

    return this.favoritesItemRepository.remove(item);
  }

  async clearFavorites(ident: FavoritesIdent) {
    const favoritos = await this.findFavorites(ident);
    if (!favoritos) throw new NotFoundException('Favoritos no encontrados');

    await this.favoritesItemRepository.delete({
      favoritos: { idFavoritos: favoritos.idFavoritos },
    });

    return { message: 'Favoritos limpiados' };
  }

  async mergeGuestFavorites(idCliente: number, sessionToken: string) {
    const guestFavorites = await this.getFavoritesBySession(sessionToken);
    if (!guestFavorites) return;

    const clientFavorites = await this.getFavoritesByClient(idCliente);

    if (!clientFavorites) {
      guestFavorites.cliente = { idCliente } as any;
      guestFavorites.sessionToken = null;
      guestFavorites.expiresAt = null;
      await this.favoritesRepository.save(guestFavorites);
      return;
    }

    for (const item of guestFavorites.items) {
      const existingItem = clientFavorites.items.find(
        i => i.producto.idProducto === item.producto.idProducto,
      );

      if (!existingItem) {
        item.favoritos = clientFavorites;
        await this.favoritesItemRepository.save(item);
      }
    }

    await this.favoritesRepository.remove(guestFavorites);
  }

  async generateShareFavoritesLink(ident: FavoritesIdent) {
    const favoritos = await this.findFavorites(ident);
    if (!favoritos) throw new NotFoundException('Favoritos no encontrados');
    if (!favoritos.items.length) throw new BadRequestException('Los favoritos están vacíos');

    if (!favoritos.shareToken) {
      favoritos.shareToken = randomUUID();
      await this.favoritesRepository.save(favoritos);
    }

    return { url: favoritos.shareToken };
  }

  async findByShareToken(shareToken: string) {
    const favoritos = await this.favoritesRepository.findOne({
      where: { shareToken },
      relations: ['items', 'items.producto'],
    });

    if (!favoritos) throw new NotFoundException('Favoritos compartidos no encontrados');

    return {
      idFavoritos: favoritos.idFavoritos,
      items: favoritos.items.map(item => item.producto),
    };
  }
}