import { Module } from '@nestjs/common';
import { StatisticService } from './statistic.service.js';
import { StatisticController } from './statistic.controller.js';

@Module({
  providers: [StatisticService],
  controllers: [StatisticController]
})
export class StatisticModule {}
