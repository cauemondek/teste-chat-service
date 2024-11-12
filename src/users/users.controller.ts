import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../model/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly userServices: UsersService) {}

  @Post()
  create(@Body() user: User) {
    return this.userServices.create(user.name);
  }

  @Get()
  findAll() {
    return this.userServices.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userServices.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() user: User) {
    return this.userServices.update(+id, user.name);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userServices.remove(+id);
  }
}
