import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';

import { UserService } from './user.service';
import { UserDto } from '../auth/dto/UserDto';
import { UserRegisterDto } from './dto/UserRegisterDto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  async userRegister(
    @Body() userRegisterDto: UserRegisterDto
  ): Promise<UserDto> {
    const createdUser = await this.userService.createUser(userRegisterDto);
    return createdUser.toDto();
  }
}
