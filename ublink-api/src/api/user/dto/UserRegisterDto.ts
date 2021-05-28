import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MinLength,
} from 'class-validator';
import { Trim } from '../../../common/decorators/transforms.decorator';

export class UserRegisterDto {
  @IsString()
  @IsNotEmpty()
  @Trim()
  readonly userId: string;

  @IsString()
  @IsNotEmpty()
  @Trim()
  readonly userNm: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @Trim()
  readonly email: string;

  @IsString()
  @MinLength(6)
  readonly password: string;
}
