import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getAll(@Query('userId') userId?: string) {
    if (userId) {
      return this.notificationsService.getUserNotifications(userId);
    }
    return this.notificationsService.getAllNotifications();
  }

  @Get('user/:userId')
  async getUserNotifications(@Param('userId') userId: string) {
    return this.notificationsService.getUserNotifications(userId);
  }

  @Post()
  async create(
    @Body()
    data: {
      title: string;
      message: string;
      type: 'INFO' | 'WARNING' | 'ALERT' | 'SUCCESS';
      userId?: string;
      actionUrl?: string;
    },
  ) {
    return this.notificationsService.createNotification(data);
  }

  @Put(':id/read')
  async markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }

  @Post('mark-all-read')
  async markAllAsRead(@Body('userId') userId: string) {
    return this.notificationsService.markAllAsRead(userId);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.notificationsService.deleteNotification(id);
  }
}
