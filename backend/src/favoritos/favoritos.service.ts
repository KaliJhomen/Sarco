import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favoritos } from './entities/favoritos.entity';
import { User } from 'src/user/entities/user.entity';
import { Producto } from 'src/producto/entities/producto.entity';

@Injectable()
export class FavoritosService {
  constructor(
    @InjectRepository(Favoritos)
    private readonly favoritosRepository: Repository<Favoritos>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) {}

  // Agregar un producto a favoritos
  async addFavorito(idUser: number, idProducto: number): Promise<Favoritos> {
    // Buscar el usuario
    const user = await this.userRepository.findOne({ where: { idUser } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    // Buscar el producto
    const producto = await this.productoRepository.findOne({ where: { idProducto } });
    if (!producto) throw new NotFoundException('Producto no encontrado');

    // Crear y guardar el favorito
    const favorito = this.favoritosRepository.create({ usuario: user, producto: producto });
    return this.favoritosRepository.save(favorito);
  }

  // Eliminar un producto de favoritos
  async removeFavorito(idUser: number, idProducto: number): Promise<void> {
    // Buscar el favorito por usuario y producto
    const favorito = await this.favoritosRepository.findOne({
      where: { usuario: { idUser }, producto: { idProducto } },
      relations: ['usuario', 'producto'], 
    });
    if (!favorito) throw new NotFoundException('Favorito no encontrado');

    // Eliminar el favorito
    await this.favoritosRepository.remove(favorito);
  }

  // Obtener todos los favoritos de un usuario
  async getFavoritos(idUser: number): Promise<Favoritos[]> {
    // Buscar los favoritos del usuario
    return this.favoritosRepository.find({
      where: { usuario: { idUser } },
      relations: ['producto'], 
    });
  }
}