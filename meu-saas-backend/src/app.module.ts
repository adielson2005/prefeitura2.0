import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TimeRecordsModule } from './time-records/time-records.module';
import { SupabaseModule } from './supabase/supabase.module';
import { NotificationsModule } from './notifications/notifications.module';
import { UploadsModule } from './uploads/uploads.module';
import { PushModule } from './push/push.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SupabaseModule,
    AuthModule,
    UsersModule,
    TimeRecordsModule,
    NotificationsModule,
    UploadsModule,
    PushModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
