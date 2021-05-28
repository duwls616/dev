'use strict';

import { IsString } from 'class-validator';

export class UserLoginDto {
  @IsString()
  readonly userId: string;

  @IsString()
  readonly password: string;
}
