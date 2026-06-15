import {
  Body,
  Controller,
  Get,
  Param,
  ParseFloatPipe,
  Post,
} from '@nestjs/common';
import * as usersDto from '../types/users.dto';
import {ZodValidationPipe} from '../pipes/ZodValidationPipe';
import {UsersService} from '../services/users.service';

@Controller()
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get(':id')
  getById(@Param('id', ParseFloatPipe) id: number) {
    return this.users.getById(id);
  }

  @Post()
  create(
    @Body(new ZodValidationPipe(usersDto.UserSchema))
    body: Omit<usersDto.User, 'id'>,
  ) {
    return this.users.create(body);
  }
}
