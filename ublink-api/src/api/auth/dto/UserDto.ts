'use strict';

import { AbstractDto } from '../../../common/dto/AbstractDto';
import { CrmUserEntity } from '../../../common/entities/crm.user.entity';

export class UserDto extends AbstractDto {
  userId: string;
  userNm: string;
  email: string;

  constructor(user: CrmUserEntity) {
    super(user);
    this.userId = user.userId;
    this.userNm = user.userNm;
    this.email = user.email;
  }
}
