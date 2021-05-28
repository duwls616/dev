import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';

import { CrmUserEntity } from '../entities/crm.user.entity';
import { UtilsService } from '../services/utils.service';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<CrmUserEntity> {
  listenTo() {
    return CrmUserEntity;
  }
  beforeInsert(event: InsertEvent<CrmUserEntity>) {
    if (event.entity.password) {
      event.entity.password = UtilsService.generateHash(
        event.entity.password,
      );
    }
  }
  beforeUpdate(event: UpdateEvent<CrmUserEntity>) {
    if (event.entity.password !== event.databaseEntity.password) {
      event.entity.password = UtilsService.generateHash(
        event.entity.password,
      );
    }
  }
}
