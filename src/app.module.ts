import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UserModule } from './user/user.module.js';
import { User } from './user/entities/user.entity.js';
import { Role } from './user/entities/role.entity.js';
import { Permission } from './user/entities/permission.entity.js';
import { RedisModule } from './redis/redis.module.js';
import { EmailModule } from './email/email.module.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { LoginGuard } from './login.guard.js';
import { PermissionGuard } from './permission.guard.js';
import { MeetingRoomModule } from './meeting-room/meeting-room.module.js';
import { MeetingRoom } from './meeting-room/entities/meeting-room.entity.js';
import { BookingModule } from './booking/booking.module.js';
import { Booking } from './booking/entities/booking.entity.js';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      useFactory(configService: ConfigService) {
        return {
          secret: configService.get('jwt_secret'),
          signOptions: {
            expiresIn: '30m' // 默认 30 分钟
          }
        }
      },
      inject: [ConfigService]
    }),
    TypeOrmModule.forRootAsync({
      useFactory(configService: ConfigService) {
        return {
          type: "mysql",
          host: configService.get('mysql_server_host'),
          port: configService.get('mysql_server_port'),
          username: configService.get('mysql_server_username'),
          password: configService.get('mysql_server_password'),
          database: configService.get('mysql_server_database'),
          synchronize: true,
          logging: true,
          entities: [User, Role, Permission, MeetingRoom, Booking],
          poolSize: 10,
          extra: {
              authPlugin: 'sha256_password',
          }
        }
      },
      inject: [ConfigService]
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'src/.env'
    }),
    UserModule,
    RedisModule,
    EmailModule,
    MeetingRoomModule,
    BookingModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: LoginGuard
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard
    }
  ],
})
export class AppModule {}
