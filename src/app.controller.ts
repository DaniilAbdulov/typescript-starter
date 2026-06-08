import {
  Body,
  Controller,
  Get,
  Param,
  ParseFloatPipe,
  Post,
} from '@nestjs/common';
import {AppService} from './app.service';
import * as usersDto from './types/users.dto';
import {ZodValidationPipe} from './pipes/ZodValidationPipe';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get(':id')
  getById(@Param('id', ParseFloatPipe) id: number) {
    console.log(`id: ${id}`);

    return this.appService.getById(id);
  }

  @Post()
  createUser(
    @Body(new ZodValidationPipe(usersDto.UserSchema)) body: usersDto.User,
  ) {
    console.log(`body`, body);
    return body;
  }
}
