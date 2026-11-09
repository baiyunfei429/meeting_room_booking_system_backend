import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UserModule } from './user/user.module.js';
import { User } from './user/entities/user.entity.js';
import { Role } from './user/entities/role.entity.js';
import { Permission } from './user/entities/permission.entity.js';
import { RedisModule } from './redis/redis.module.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "123456",
      database: "meeting_room_booking_system",
      synchronize: true,
      logging: true,
      entities: [User, Role, Permission],
      poolSize: 10,
      extra: {
          authPlugin: 'sha256_password',
      }
    }),
    UserModule,
    RedisModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
