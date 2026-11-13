import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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
import { StatisticModule } from './statistic/statistic.module.js';
import { AuthModule } from './auth/auth.module';
import path from 'path';
import { utilities, WINSTON_MODULE_NEST_PROVIDER, WinstonModule, WinstonLogger } from 'nest-winston';
import winston from 'winston';
import { CustomTypeOrmLogger } from './CustomTypeOrmLogger.js';
import 'winston-daily-rotate-file';

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
      useFactory(configService: ConfigService, logger: WinstonLogger) {
        return {
          type: "mysql",
          host: configService.get('mysql_server_host'),
          port: configService.get('mysql_server_port'),
          username: configService.get('mysql_server_username'),
          password: configService.get('mysql_server_password'),
          database: configService.get('mysql_server_database'),
          synchronize: true,
          logging: true,
          logger: new CustomTypeOrmLogger(logger),
          entities: [User, Role, Permission, MeetingRoom, Booking],
          poolSize: 10,
          extra: {
            authPlugin: 'sha256_password',
          }
        }
      },
      inject: [ConfigService, WINSTON_MODULE_NEST_PROVIDER]
    }),
    WinstonModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        level: 'debug',
        transports: [
          // new winston.transports.File({
          //   filename: `${process.cwd()}/log`,
          // }),
          new winston.transports.DailyRotateFile({
            level: configService.get('winston_log_level'),
            dirname: configService.get('winston_log_dirname'),
            filename: configService.get('winston_log_filename'),
            datePattern: configService.get('winston_log_date_pattern'),
            maxSize: configService.get('winston_log_max_size')
          }),
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.timestamp(),
              utilities.format.nestLike(),
            ),
          }),
          // 单独的日志服务
          new winston.transports.Http({
            host: 'localhost',
            port: 3002,
            path: '/log'
          })
        ],
      }),
      inject: [ConfigService]
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: 'src/.env'
      envFilePath: path.join(__dirname, '.env')
    }),
    UserModule,
    RedisModule,
    EmailModule,
    MeetingRoomModule,
    BookingModule,
    StatisticModule,
    AuthModule
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
export class AppModule { }
