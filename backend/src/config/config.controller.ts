import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ConfigService } from './config.service';

import { CreateConfigDto } from './dto/create-config.dto';
import { UpdateConfigDto } from './dto/update-config.dto';

@Controller('config')
export class ConfigController {

  constructor(private readonly configService: ConfigService) {}

  @Post()
  create(@Body() dto: CreateConfigDto) {
    return this.configService.create(dto);
  }

  @Get()
  findAll() {
    return this.configService.findAll();
  }

  @Get(':key')
  findOne(@Param('key') key: string) {
    return this.configService.findOne(key);
  }

  @Patch(':key')
  update(
    @Param('key') key: string,
    @Body() dto: UpdateConfigDto,
  ) {
    return this.configService.update(key, dto);
  }

  @Delete(':key')
  remove(@Param('key') key: string) {
    return this.configService.remove(key);
  }
}