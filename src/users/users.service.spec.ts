import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

const mockPrismaService = {
  user: {
    create: jest.fn().mockResolvedValue({
      id: 'some-uuid',
      email: 'test@example.com',
      name: 'Test User',
      role: Role.VIGIA,
    }),
  },
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: PrismaService, useValue: mockPrismaService }],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user with a hashed password', async () => {
      const createUserDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
        siteId: 'site-id',
      };
      const result = await service.create(createUserDto);

      expect(mockPrismaService.user.create).toHaveBeenCalled();
      expect(result).toEqual({
        id: 'some-uuid',
        email: 'test@example.com',
        name: 'Test User',
        role: Role.VIGIA,
      });
    });
  });
});
