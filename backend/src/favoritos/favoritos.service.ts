import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favoritos } from './entities/favoritos.entity';
import { FavoritosItem } from './entities/favoritos-item.entity';
import { randomUUID } from 'crypto';
import { Producto } from '../producto/entities/producto.entity';

type FavoritesIdent = { idUsuario?: number; sessionToken?: string | null };

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
    const { idUsuario, sessionToken } = ident;
    if (idUsuario) return this.getFavoritesByUser(idUsuario);
    if (sessionToken) return this.getFavoritesBySession(sessionToken);
    return null;
  }

  private async findOrCreateFavorites(ident: FavoritesIdent): Promise<Favoritos> {
    const favoritos = await this.findFavorites(ident);
    if (favoritos) return favoritos;

    const { idUsuario, sessionToken } = ident;
    if (idUsuario) return this.createFavorites(idUsuario);
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

  private async getFavoritesByUser(idUsuario: number): Promise<Favoritos | null> {
    return this.favoritesRepository.findOne({
      where: { usuario: { idUsuario } },
      relations: ['items', 'items.producto'],
    });
  }

  private async getFavoritesBySession(sessionToken: string): Promise<Favoritos | null> {
    return this.favoritesRepository.findOne({
      where: { sessionToken },
      relations: ['items', 'items.producto'],
    });
  }

  private async createFavorites(idUsuario: number): Promise<Favoritos> {
    return this.favoritesRepository.save(
      this.favoritesRepository.create({
        sessionToken: null,
        shareToken: null,
        expiresAt: null,
        usuario: { idUsuario },
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
  async findByUserId(ident: FavoritesIdent) {
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

  async mergeGuestFavorites(idUsuario: number, sessionToken: string) {
    const guestFavorites = await this.getFavoritesBySession(sessionToken);
    if (!guestFavorites) return;

    const userFavorites = await this.getFavoritesByUser(idUsuario);

    if (!userFavorites) {
      guestFavorites.usuario = { idUsuario } as any;
      guestFavorites.sessionToken = null;
      guestFavorites.expiresAt = null;
      await this.favoritesRepository.save(guestFavorites);
      return;
    }

    for (const item of guestFavorites.items) {
      const existingItem = userFavorites.items.find(
        i => i.producto.idProducto === item.producto.idProducto,
      );

      if (!existingItem) {
        item.favoritos = userFavorites;
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