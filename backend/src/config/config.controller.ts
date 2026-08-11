import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ConfigService } from './config.service';

import { CreateConfigDto } from './dto/create-config.dto';
import { UpdateConfigDto } from './dto/update-config.dto';

@Controller('config')
export class ConfigController {

  constructor(private readonly configService: ConfigService) {}

  @Post()
  create(@Body() createConfigDto: CreateConfigDto) {
    return this.configService.create(createConfigDto);
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
    @Body() updateConfigDto: UpdateConfigDto,
  ) {
    return this.configService.update(key, updateConfigDto);
  }

  @Delete(':key')
  remove(@Param('key') key: string) {
    return this.configService.remove(key);
  }
}