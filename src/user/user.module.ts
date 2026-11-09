import { Module } from '@nestjs/common';
import { UserService } from './user.service.js';
import { UserController } from './user.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { Role } from './entities/role.entity.js';
import { Permission } from './entities/permission.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Permission])
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
