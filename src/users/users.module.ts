import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [UsersController],
  // Disponibilizamos o UsersService e o PrismaService para este módulo
  providers: [UsersService, PrismaService],
  exports: [UsersService], // Exportamos para que outros módulos possam usar
})
export class UsersModule {}
