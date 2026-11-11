import { Controller, Get, Post, Body, Patch, Param, Delete, Query, DefaultValuePipe, Put } from '@nestjs/common';
import { MeetingRoomService } from './meeting-room.service.js';
import { CreateMeetingRoomDto } from './dto/create-meeting-room.dto.js';
import { UpdateMeetingRoomDto } from './dto/update-meeting-room.dto.js';
import { generateParseIntPipe } from '../utils.js';

@Controller('meeting-room')
export class MeetingRoomController {
  constructor(private readonly meetingRoomService: MeetingRoomService) { }

  @Post('create')
  create(@Body() createMeetingRoomDto: CreateMeetingRoomDto) {
    return this.meetingRoomService.create(createMeetingRoomDto);
  }

  @Get('list')
  async list(
    @Query('pageNo', new DefaultValuePipe(1), generateParseIntPipe('pageNo')) pageNo: number,
    @Query('pageSize', new DefaultValuePipe(2), generateParseIntPipe('pageSize')) pageSize: number,
    @Query('name') name: string,
    @Query('capacity') capacity: number,
    @Query('equipment') equipment: string
  ) {
    return await this.meetingRoomService.find(pageNo, pageSize, name, capacity, equipment);
  }

  @Get(':id')
  async find(@Param('id') id: number) {
    return await this.meetingRoomService.findById(id);
  }

  @Put('update')
  async update(@Body() meetingRoomDto: UpdateMeetingRoomDto) {
    return await this.meetingRoomService.update(meetingRoomDto);
  }
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this.meetingRoomService.delete(id);
  }

}
