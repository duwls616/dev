import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { contextMiddleware } from './middlewares';
import { UserModule } from './api/user/user.module';
import { AuthModule } from './api/auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { ConfigService } from './shared/services/config.service';
import { ChannelController } from 'api/channel/channel.controller';
import { ChannelService } from 'api/channel/channel.service';
import { ChannelModule } from 'api/channel/channel.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    ChannelModule,
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ConfigService) =>
        configService.typeOrmConfig,
      inject: [ConfigService],
    }),
    ChannelModule,
  ],
  controllers: [ChannelController],
  providers: [ChannelService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
    consumer.apply(contextMiddleware).forRoutes('*');
  }
}