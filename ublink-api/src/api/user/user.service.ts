import { Injectable } from '@nestjs/common';
import { FindConditions } from 'typeorm';
import { UserRepository } from './user.repository';

import { UserRegisterDto } from './dto/UserRegisterDto';
import { CrmUserEntity } from '../../common/entities/crm.user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository
  ) {}

  findOne(findData: FindConditions<CrmUserEntity>): Promise<CrmUserEntity> {
    return this.userRepository.findOne(findData);
  }

  async createUser(userRegisterDto: UserRegisterDto): Promise<CrmUserEntity> {
    const user = this.userRepository.create(userRegisterDto);
    return this.userRepository.save(user);
  }
}
