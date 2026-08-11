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
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const newUser = this.userRepository.create(createUserDto);
      return await this.userRepository.save(newUser);
    } catch (error) {
      throw new InternalServerErrorException('Ocurrió un error al guardar el usuario');
    }
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.userRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('Error al consultar la base de datos.');
    }
  }

  async findOne(idUser: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ idUser });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${idUser} no encontrado`);
    }
    return user;
  }

  async update(idUser: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.preload({
      idUser,
      ...updateUserDto,
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${idUser} no encontrado`);
    }

    return this.userRepository.save(user);
  }

  async remove(idUser: number) {
    const user = await this.userRepository.findOneBy({ idUser });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${idUser} no encontrado`);
    }

    await this.userRepository.remove(user);
    return { message: `Usuario con ID ${idUser} eliminado correctamente` };
  }
}
