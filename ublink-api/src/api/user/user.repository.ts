import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { CrmUserEntity } from '../../common/entities/crm.user.entity';

@EntityRepository(CrmUserEntity)
export class UserRepository extends Repository<CrmUserEntity> {}
