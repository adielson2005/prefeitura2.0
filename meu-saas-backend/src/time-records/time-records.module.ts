import { Module } from '@nestjs/common';
import { TimeRecordsController } from './time-records.controller';
import { TimeRecordsService } from './time-records.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [TimeRecordsController],
  providers: [TimeRecordsService],
})
export class TimeRecordsModule {}
