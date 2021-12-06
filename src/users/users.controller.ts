import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Auth0Guard } from '../auth/auth0.guard';
import { PaginationOptions } from '../common/pagination-options.interface';

@Controller('users/')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Body() paginationOptions: PaginationOptions) {
    return this.usersService.findAll(paginationOptions);
  }

  @UseGuards(Auth0Guard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
