import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { CrmUserEntity } from '../entities/crm.user.entity';
import { ContextService } from '../services/context.service';

@Injectable()
export class AuthUserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    // console.log('AuthUserInterceptor request');
    // console.log(request.user);

    const user = <CrmUserEntity>request.user;
    ContextService.setAuthUser(user);

    return next.handle();
  }
}
