import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { SupabaseModule } from '../supabase/supabase.module';
import { PushModule } from '../push/push.module';

@Module({
  imports: [SupabaseModule, PushModule],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
