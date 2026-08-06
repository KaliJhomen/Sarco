import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FavoritosItem } from './entities/favoritos-item.entity';
import { Favoritos } from '../favoritos/entities/favoritos.entity';
import { Producto } from '../producto/entities/producto.entity';
import { Cliente } from '../cliente/entities/cliente.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class FavoritosItemService {
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

  private async getOrCreateFavorites({ idUser, sessionToken }: { idUser?: number, sessionToken?: string }): Promise<Favoritos> {
    if (idUser) {
      const cliente = await this.findClienteByUserId(idUser);
      let favorites = await this.favoritesRepository.findOne({ where: { cliente: { idCliente: cliente.idCliente } } });
      if (favorites) return favorites;
      favorites = this.favoritesRepository.create({ cliente });
      return this.favoritesRepository.save(favorites);
    } else if (sessionToken) {
      let favorites = await this.favoritesRepository.findOne({ where: { sessionToken } });
      if (favorites) return favorites;
      favorites = this.favoritesRepository.create({ sessionToken });
      return this.favoritesRepository.save(favorites);
    } else {
      throw new BadRequestException('Debe proporcionar idUser o sessionToken');
    }
  }

  async addToFavorites(
    { idUser, sessionToken }: { idUser?: number, sessionToken?: string },
    idProducto: number
  ) {
    if (!idUser && !sessionToken) {
      throw new BadRequestException('Debe proporcionar idUser o sessionToken');
    }

    const favorites = await this.getOrCreateFavorites({ idUser, sessionToken });
    const product = await this.productRepository.findOne({ where: { idProducto } });
    if (!product) throw new NotFoundException('Producto no encontrado');

    const existingItem = await this.favoritesItemRepository.findOne({
      where: {
        favoritos: { idFavoritos: favorites.idFavoritos },
        producto: { idProducto },
      },
    });
    if (existingItem) throw new ConflictException('El producto ya está en favoritos');

    const item = this.favoritesItemRepository.create({
      favoritos: favorites,
      producto: product,
    });
    return this.favoritesItemRepository.save(item);
  }

  async removeFromFavorites(params: { idUser?: number, sessionToken?: string }, idProducto: number) {
    const { idUser, sessionToken } = params;
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

  async findByUserId({ idUser, sessionToken }: { idUser?: number, sessionToken?: string }) {
    if (!idUser && !sessionToken) {
      throw new BadRequestException('Debe proporcionar idUser o sessionToken');
    }

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
      return {
        idUser,
        sessionToken,
        idFavorites: null,
        items: [],
      };
    }

    const items = favorites.items || [];
    return {
      idUser,
      sessionToken,
      idFavorites: favorites.idFavoritos,
      items,
    };
  }
}
