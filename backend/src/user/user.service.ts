import { InternalServerErrorException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, // Cambiado a minúscula para seguir las convenciones
  ) {}

  // Crear un nuevo usuario
  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(createUserDto); // Crea una nueva instancia del usuario
    return this.userRepository.save(newUser); // Guarda el usuario en la base de datos
  }

  // Buscar un usuario por su email
  async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  // Obtener todos los usuarios
  async findAll(): Promise<User[]> {
    try {
      return await this.userRepository.find();
    } catch (error) {
      console.error('Error al consultar la base de datos:', error);
      throw new InternalServerErrorException('Error al consultar la base de datos.');
    }
  }

  // Buscar un usuario por su ID
  async findOne(idUser: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ idUser });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${idUser} no encontrado`);
    }
    return user;
  }

  // Actualizar un usuario por su ID
  async update(idUser: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.preload({
      idUser,
      ...updateUserDto,
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${idUser} no encontrado`);
    }

    return this.userRepository.save(user); // Guarda los cambios en la base de datos
  }

  // Eliminar un usuario por su ID
  async remove(idUser: number): Promise<void> {
    const user = await this.userRepository.findOneBy({ idUser });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${idUser} no encontrado`);
    }

    await this.userRepository.remove(user); // Elimina el usuario de la base de datos
  }
}
