import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { AuthUser } from '../../common/decorators/auth-user.decorator';
import { AuthUserInterceptor } from '../../common/interceptors/auth-user-interceptor';

import { UserDto } from './dto/UserDto';
import { UserLoginDto } from './dto/UserLoginDto';
import { LoginPayloadDto } from './dto/LoginPayloadDto';
import { CrmUserEntity } from '../../common/entities/crm.user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  /**
   * 로그인 처리
   * @param userLoginDto 
   * @returns Promise<LoginPayloadDto>
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async userLogin(
    @Body() userLoginDto: UserLoginDto,
  ): Promise<LoginPayloadDto> {
    const userEntity = await this.authService.validateUser(userLoginDto);

    const token = await this.authService.createToken(userEntity);
    return new LoginPayloadDto(userEntity.toDto(), token);
  }

  /**
   * 로그인 여부 체크
   * @param user 
   * @returns Promise<CrmUserEntity>
   */
  @Get('check-login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @UseInterceptors(AuthUserInterceptor)
  async getCurrentUser(@AuthUser() user: CrmUserEntity): Promise<CrmUserEntity> {
    return user.toDto();
  }
}
