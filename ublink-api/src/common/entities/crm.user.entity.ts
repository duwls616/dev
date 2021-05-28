import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../entities-abstract/abstract.entity';
import { UserDto } from '../../api/auth/dto/UserDto';

@Entity({ name: 'CRM_USER' })
export class CrmUserEntity extends AbstractEntity<UserDto> {
  @Column({ unique: true, nullable: true })
  userId: string;

  @Column({ nullable: true })
  userNm: string;

  @Column({ nullable: true })
  password: string;

  @Column({ unique: true, nullable: true })
  email: string;

  dtoClass = UserDto;
}
