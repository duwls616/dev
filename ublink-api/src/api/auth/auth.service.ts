import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { CrmUserEntity } from '../../common/entities/crm.user.entity';
import { UserDto } from './dto/UserDto';
import { TokenPayloadDto } from './dto/TokenPayloadDto';
import { UserLoginDto } from './dto/UserLoginDto';
import { UserService } from '../user/user.service';
import { UtilsService } from '../../common/services/utils.service';
import { ConfigService } from '../../shared/services/config.service';
import { UserNotFoundException } from '../../common/exceptions/user-not-found.exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * 사용자 인증 체크
   * @param userLoginDto: UserLoginDto 
   * @returns Promise<CrmUserEntity>
   */
  async validateUser(userLoginDto: UserLoginDto): Promise<CrmUserEntity> {
    const user = await this.userService.findOne({
      userId: userLoginDto.userId,
    });
    const isPasswordValid = await UtilsService.validateHash(
      userLoginDto.password,
      user && user.password,
    );
    if (!user || !isPasswordValid) {
      throw new UserNotFoundException();
    }
    return user;
  }

  /**
   * jwt토큰 생성 및 반환
   * @param user: CrmUserEntity | UserDto 
   * @returns Promise<TokenPayloadDto>
   */
  async createToken(user: CrmUserEntity | UserDto): Promise<TokenPayloadDto> {
    return new TokenPayloadDto({
      expiresIn: this.configService.getNumber('JWT_EXPIRATION_TIME'),
      accessToken: await this.jwtService.signAsync({ id: user.id }),
    });
  }
}
