import { Controller, Post, Body, Delete, Param, Put, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private service: UsersService) {}

  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @Get('tree')
  async getTree() {
    return this.service.getTree();
  }

  @Post()
  async create(@Body() data: CreateUserDto) {
    return this.service.create(data);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() data: UpdateUserDto) {
    return this.service.update(id, data.supervisorId);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.service.delete(+id);
  }
}