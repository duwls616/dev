'use strict';

import {
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { UtilsService } from '../services/utils.service';
import { AbstractDto } from '../dto/AbstractDto';

export abstract class AbstractEntity<T extends AbstractDto = AbstractDto> {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    type: 'datetime2',
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'datetime2',
    name: 'updated_at',
  })
  updatedAt: Date;

  abstract dtoClass: new (entity: AbstractEntity, options?: any) => T;

  toDto(options?: any) {
    return UtilsService.toDto(this.dtoClass, this, options);
  }
}
