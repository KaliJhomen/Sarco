import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favoritos } from './entities/favoritos.entity';
import { FavoritosItem } from '../favoritos-item/entities/favoritos-item.entity';
import { randomUUID } from 'crypto';
import { Producto } from '../producto/entities/producto.entity';
import { Cliente } from '../cliente/entities/cliente.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class FavoritosService {
  constructor(
    @InjectRepository(Favoritos)
    private readonly favoritesRepository: Repository<Favoritos>,
    @InjectRepository(FavoritosItem)
    private readonly favoritesItemRepository: Repository<FavoritosItem>,
    @InjectRepository(Producto)
    private readonly productRepository: Repository<Producto>,
    @InjectRepository(Cliente)
    private readonly clientRepository: Repository<Cliente>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private async findClienteByUserId(idUser: number): Promise<Cliente> {
    const user = await this.userRepository.findOne({ where: { id: idUser } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    let cliente = await this.clientRepository.findOne({ where: { email: user.email } });
    if (!cliente) {
      cliente = this.clientRepository.create({
        nombre: user.name,
        email: user.email,
      });
      cliente = await this.clientRepository.save(cliente);
    }
    return cliente;
  }

  private async getOrCreateFavorites(idUser: number) {
    const cliente = await this.findClienteByUserId(idUser);

    let favoritos = await this.favoritesRepository.findOne({
      where: { cliente: { idCliente: cliente.idCliente } },
      relations: ['items'],
    });

    if (!favoritos) {
      favoritos = this.favoritesRepository.create({
        cliente,
        items: [],
      });
      favoritos = await this.favoritesRepository.save(favoritos);
    }

    return favoritos;
  }

  async findByUserId({
    idUser,
    sessionToken,
  }: {
    idUser?: number;
    sessionToken?: string;
  }) {
    if (!idUser && !sessionToken) {
      throw new BadRequestException('Se requiere un ID de usuario o un token de sesión');
    }

    let favoritos: Favoritos | null = null;

    if (idUser) {
      const cliente = await this.findClienteByUserId(idUser);
      favoritos = await this.favoritesRepository.findOne({
        where: { cliente: { idCliente: cliente.idCliente } },
        relations: ['items', 'items.producto'],
      });
    } else if (sessionToken) {
      favoritos = await this.favoritesRepository.findOne({
        where: { sessionToken },
        relations: ['items', 'items.producto'],
      });
    }

    if (!favoritos) {
      return [];
    }

    return favoritos.items.map(item => item.producto);
  }

  async addToFavorites(
    ident: { idUser?: number, sessionToken?: string },
    idProducto: number
  ) {
    const { idUser, sessionToken } = ident;
    if (!idUser && !sessionToken) {
      throw new BadRequestException('Se requiere un ID de usuario o un token de sesión');
    }

    const product = await this.productRepository.findOne({ where: { idProducto } });
    if (!product) {
      throw new NotFoundException(`Producto con ID ${idProducto} no encontrado`);
    }

    let favorites: Favoritos | null = null;

    if (idUser) {
      favorites = await this.getOrCreateFavorites(idUser);
    } else if (sessionToken) {
      favorites = await this.favoritesRepository.findOne({
        where: { sessionToken },
        relations: ['items', 'items.producto'],
      });
      if (!favorites) {
        favorites = this.favoritesRepository.create({
          sessionToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
        favorites = await this.favoritesRepository.save(favorites);
        favorites.items = [];
      }
    }

    if (!favorites) throw new NotFoundException('No se pudo obtener o crear los favoritos');

    const existingItem = await this.favoritesItemRepository.findOne({
      where: {
        favoritos: { idFavoritos: favorites.idFavoritos },
        producto: { idProducto },
      },
      relations: ['producto'],
    });

    if (existingItem) {
      return existingItem;
    }

    const newItem = this.favoritesItemRepository.create({
      favoritos: favorites,
      producto: product,
    });

    return this.favoritesItemRepository.save(newItem);
  }

  async removeFromFavorites(
    ident: { idUser?: number, sessionToken?: string },
    idProducto: number
  ) {
    const { idUser, sessionToken } = ident;
    if (!idUser && !sessionToken) {
      throw new BadRequestException('Se requiere un ID de usuario o un token de sesión');
    }

    let favorites: Favoritos | null = null;

    if (idUser) {
      const cliente = await this.findClienteByUserId(idUser);
      favorites = await this.favoritesRepository.findOne({
        where: { cliente: { idCliente: cliente.idCliente } },
      });
    } else if (sessionToken) {
      favorites = await this.favoritesRepository.findOne({
        where: { sessionToken },
      });
    }

    if (!favorites) {
      throw new NotFoundException('Favoritos no encontrados');
    }

    const existingItem = await this.favoritesItemRepository.findOne({
      where: {
        favoritos: { idFavoritos: favorites.idFavoritos },
        producto: { idProducto },
      },
    });

    if (!existingItem) {
      throw new NotFoundException(`El producto con ID ${idProducto} no está en favoritos`);
    }

    return this.favoritesItemRepository.remove(existingItem);
  }

  async clearFavorites(idUser: number) {
    const cliente = await this.findClienteByUserId(idUser);

    let favoritos = await this.favoritesRepository.findOne({
      where: { cliente: { idCliente: cliente.idCliente } },
      relations: ['items'],
    });

    if (!favoritos) {
      favoritos = this.favoritesRepository.create({ cliente, items: [] });
      favoritos = await this.favoritesRepository.save(favoritos);
    }

    await this.favoritesItemRepository.delete({
      favoritos: { idFavoritos: favoritos.idFavoritos },
    });

    return { message: 'Favoritos limpiados' };
  }

  async mergeGuestFavorites(idUser: number, sessionToken: string) {
    const guestFavorites = await this.favoritesRepository.findOne({
      where: { sessionToken },
      relations: ['items', 'items.producto'],
    });

    if (!guestFavorites) return;

    const cliente = await this.findClienteByUserId(idUser);

    const userFavorites = await this.favoritesRepository.findOne({
      where: { cliente: { idCliente: cliente.idCliente } },
      relations: ['items', 'items.producto'],
    });

    if (!userFavorites) {
      guestFavorites.cliente = cliente;
      guestFavorites.sessionToken = null;
      guestFavorites.expiresAt = null;
      await this.favoritesRepository.save(guestFavorites);
      return;
    }

    for (const item of guestFavorites.items) {
      const existingItem = userFavorites.items.find(
        i => i.producto.idProducto === item.producto.idProducto,
      );

      if (existingItem) {
        await this.favoritesItemRepository.save(existingItem);
      } else {
        item.favoritos = userFavorites;
        await this.favoritesItemRepository.save(item);
      }
    }

    await this.favoritesRepository.remove(guestFavorites);
  }

  async generateShareFavoritesLink(
    ident: { idUser?: number; sessionToken?: string },
  ) {
    const { idUser, sessionToken } = ident;
    let favorites: Favoritos | null = null;

    if (idUser) {
      const cliente = await this.findClienteByUserId(idUser);
      favorites = await this.favoritesRepository.findOne({
        where: { cliente: { idCliente: cliente.idCliente } },
        relations: ['items', 'items.producto'],
      });
    } else if (sessionToken) {
      favorites = await this.favoritesRepository.findOne({
        where: { sessionToken },
        relations: ['items', 'items.producto'],
      });
    }

    if (!favorites) {
      throw new NotFoundException('Favoritos no encontrados');
    }

    if (!favorites.items.length) {
      throw new BadRequestException('Los favoritos están vacíos');
    }

    if (!favorites.shareToken) {
      favorites.shareToken = randomUUID();
      await this.favoritesRepository.save(favorites);
    }
    return { url: favorites.shareToken };
  }

  async findByShareToken(shareToken: string) {
    const favorites = await this.favoritesRepository.findOne({
      where: { shareToken },
      relations: ['items', 'items.producto'],
    });

    if (!favorites) {
      throw new NotFoundException('Favoritos compartidos no encontrados');
    }

    return {
      idFavorites: favorites.idFavoritos,
      items: favorites.items,
    };
  }
}
