import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user object when credentials are valid', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
        name: 'Test User',
        role: 'user' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;

      mockUsersService.findByEmail.mockResolvedValue(mockUser);

      const result = await service.validateUser(
        'test@example.com',
        'password123',
      );
      expect(result).toBeDefined();
      expect(result).not.toHaveProperty('password');
    });

    it('should return null when credentials are invalid', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
        name: 'Test User',
        role: 'user' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;

      mockUsersService.findByEmail.mockResolvedValue(mockUser);

      const result = await service.validateUser(
        'test@example.com',
        'wrongpassword',
      );
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token when credentials are valid', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
        name: 'Test User',
        role: 'user' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;

      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('test-token');

      const result = await service.login('test@example.com', 'password123');
      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('user');
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
        name: 'Test User',
        role: 'user' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;

      mockUsersService.findByEmail.mockResolvedValue(mockUser);

      await expect(
        service.login('test@example.com', 'wrongpassword'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should create new user when email is not taken', async () => {
      const newUser = {
        name: 'New User',
        email: 'new@example.com',
        password: 'password123',
      };

      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue({
        ...newUser,
        id: '1',
        role: 'user' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User);

      const result = await service.register(
        newUser.name,
        newUser.email,
        newUser.password,
      );
      expect(result).toBeDefined();
      expect(result).not.toHaveProperty('password');
    });

    it('should throw ConflictException when email is already taken', async () => {
      const existingUser = {
        name: 'Existing User',
        email: 'existing@example.com',
        password: 'password123',
        role: 'user' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;

      mockUsersService.findByEmail.mockResolvedValue(existingUser);

      await expect(
        service.register(
          existingUser.name,
          existingUser.email,
          existingUser.password,
        ),
      ).rejects.toThrow(ConflictException);
    });
  });
});
