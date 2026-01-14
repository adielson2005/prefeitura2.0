import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { TimeRecordsService } from './time-records.service';

class RegisterPunchDto {
  userId: string;
  punchType: 'ENTRADA' | 'INTERVALO' | 'RETORNO' | 'SAIDA';
  location?: {
    latitude: number;
    longitude: number;
    name?: string;
  };
  notes?: string;
}

@Controller('time-records')
export class TimeRecordsController {
  constructor(private readonly timeRecordsService: TimeRecordsService) {}

  @Post('punch')
  registerPunch(@Body() dto: RegisterPunchDto) {
    return this.timeRecordsService.registerPunch(
      dto.userId,
      dto.punchType,
      dto.location,
      dto.notes,
    );
  }

  @Get('user/:userId')
  getUserRecords(
    @Param('userId') userId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.timeRecordsService.getUserRecords(
      userId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get('all')
  getAllRecords(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.timeRecordsService.getAllRecords(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get('stats/today')
  getTodayStats(@Query('userId') userId?: string) {
    return this.timeRecordsService.getTodayStats(userId);
  }

  @Post('approve')
  approveRecord(
    @Body() dto: { recordId: string; approverId: string; notes?: string },
  ) {
    return this.timeRecordsService.approveRecord(
      dto.recordId,
      dto.approverId,
      dto.notes,
    );
  }

  @Post('reject')
  rejectRecord(
    @Body() dto: { recordId: string; approverId: string; reason: string },
  ) {
    return this.timeRecordsService.rejectRecord(
      dto.recordId,
      dto.approverId,
      dto.reason,
    );
  }
}
