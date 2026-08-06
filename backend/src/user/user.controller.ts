import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') idUser: string) {
    return this.userService.findOne(+idUser);
  }

  @Patch(':id')
  update(@Param('id') idUser: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+idUser, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') idUser: string) {
    return this.userService.remove(+idUser);
  }
}
