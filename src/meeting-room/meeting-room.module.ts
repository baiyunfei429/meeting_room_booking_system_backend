import { Module } from '@nestjs/common';
import { MeetingRoomService } from './meeting-room.service.js';
import { MeetingRoomController } from './meeting-room.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingRoom } from './entities/meeting-room.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([MeetingRoom])
  ],
  controllers: [MeetingRoomController],
  providers: [MeetingRoomService],
})
export class MeetingRoomModule {}
