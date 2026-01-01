import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    return this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
      select: { id: true, name: true, email: true, role: true },
    });
  }

  findAll(siteId: string) {
    return this.prisma.user.findMany({
      where: { siteId },
      select: { id: true, name: true, email: true, role: true },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true, siteId: true },
    });
    if (!user) {
      throw new NotFoundException(`Usuário com ID "${id}" não encontrado.`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    // Garante que o usuário existe antes de tentar atualizar
    await this.findOne(id);

    // Se uma nova senha for fornecida, faz o hash dela
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: { id: true, name: true, email: true, role: true },
    });
  }

  remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  // Adicionado para o serviço de autenticação
  findOneByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}
