import { Global, HttpModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { ConfigService } from './services/config.service';
import { GeneratorService } from './services/generator.service';
import { ValidatorService } from './services/validator.service';

const providers = [
  ConfigService,
  ValidatorService,
  GeneratorService,
];

@Global()
@Module({
  providers,
  imports: [
    HttpModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secretOrPrivateKey: configService.get('JWT_SECRET_KEY'),
        signOptions: {
          expiresIn: configService.getNumber('JWT_EXPIRATION_TIME'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [...providers, HttpModule, JwtModule],
})
export class SharedModule {}
