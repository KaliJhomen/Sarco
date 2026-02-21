import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  HttpException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favoritos } from './entities/favoritos.entity';
import { User } from 'src/user/entities/user.entity';
import { Producto } from 'src/producto/entities/producto.entity';

@Injectable()
export class FavoritosService {
  private readonly logger = new Logger(FavoritosService.name);

  constructor(
    @InjectRepository(Favoritos)
    private readonly favoritosRepository: Repository<Favoritos>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) {}

  private validateId(value: number, field: string) {
    if (!Number.isInteger(value) || value <= 0) {
      this.logger.warn(`[validateId] ${field} inválido: ${value}`);
      throw new BadRequestException(`${field} inválido`);
    }
  }

  async addFavorito(idUser: number, idProducto: number): Promise<Favoritos> {
    this.logger.log(`[addFavorito] inicio idUser=${idUser} idProducto=${idProducto}`);
    try {
      this.validateId(idUser, 'idUser');
      this.validateId(idProducto, 'idProducto');

      const user = await this.userRepository.findOne({ where: { idUser } });
      if (!user) {
        this.logger.warn(`[addFavorito] Usuario no encontrado idUser=${idUser}`);
        throw new NotFoundException('Usuario no encontrado');
      }

      const producto = await this.productoRepository.findOne({ where: { idProducto } });
      if (!producto) {
        this.logger.warn(`[addFavorito] Producto no encontrado idProducto=${idProducto}`);
        throw new NotFoundException('Producto no encontrado');
      }

      const alreadyExists = await this.favoritosRepository.findOne({
        where: { usuario: { idUser }, producto: { idProducto } },
      });

      if (alreadyExists) {
        this.logger.warn(`[addFavorito] Duplicado idUser=${idUser} idProducto=${idProducto}`);
        throw new ConflictException('El producto ya está en favoritos');
      }

      const favorito = this.favoritosRepository.create({
        usuario: user,
        producto,
      });

      const saved = await this.favoritosRepository.save(favorito);
      this.logger.log(`[addFavorito] ok idFavorito=${(saved as any)?.idFavorito ?? 'N/A'}`);
      return saved;
    } catch (error: any) {
      this.logger.error(
        `[addFavorito] error idUser=${idUser} idProducto=${idProducto} message=${error?.message}`,
        error?.stack,
      );
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Error interno al agregar favorito');
    }
  }

  async removeFavorito(idUser: number, idProducto: number): Promise<void> {
    this.logger.log(`[removeFavorito] inicio idUser=${idUser} idProducto=${idProducto}`);
    try {
      this.validateId(idUser, 'idUser');
      this.validateId(idProducto, 'idProducto');

      const favorito = await this.favoritosRepository.findOne({
        where: { usuario: { idUser }, producto: { idProducto } },
      });

      if (!favorito) {
        this.logger.warn(`[removeFavorito] Favorito no encontrado idUser=${idUser} idProducto=${idProducto}`);
        throw new NotFoundException('Favorito no encontrado');
      }

      await this.favoritosRepository.remove(favorito);
      this.logger.log(`[removeFavorito] ok idUser=${idUser} idProducto=${idProducto}`);
    } catch (error: any) {
      this.logger.error(
        `[removeFavorito] error idUser=${idUser} idProducto=${idProducto} message=${error?.message}`,
        error?.stack,
      );
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Error interno al eliminar favorito');
    }
  }

  async getFavoritos(idUser: number): Promise<Favoritos[]> {
    this.logger.log(`[getFavoritos] inicio idUser=${idUser}`);
    try {
      this.validateId(idUser, 'idUser');

      const favoritos = await this.favoritosRepository.find({
        where: { usuario: { idUser } },
        relations: ['producto'],
        order: { idFavoritos: 'DESC' as const },
      });

      this.logger.log(`[getFavoritos] ok idUser=${idUser} total=${favoritos.length}`);
      return favoritos;
    } catch (error: any) {
      this.logger.error(
        `[getFavoritos] error idUser=${idUser} message=${error?.message}`,
        error?.stack,
      );
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Error interno al obtener favoritos');
    }
  }
}