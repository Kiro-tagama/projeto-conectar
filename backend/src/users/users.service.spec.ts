import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'user' as const,
      };

      const expectedUser = {
        id: '1',
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.create.mockReturnValue(expectedUser);
      mockRepository.save.mockResolvedValue(expectedUser);

      const result = await service.create(userData);
      expect(result).toEqual(expectedUser);
      expect(repository.create).toHaveBeenCalledWith(userData);
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('findByEmail', () => {
    it('should return user when email exists', async () => {
      const email = 'test@example.com';
      const expectedUser = {
        id: '1',
        name: 'Test User',
        email,
        role: 'user' as const,
      };

      mockRepository.findOne.mockResolvedValue(expectedUser);

      const result = await service.findByEmail(email);
      expect(result).toEqual(expectedUser);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { email } });
    });

    it('should return null when email does not exist', async () => {
      const email = 'nonexistent@example.com';
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail(email);
      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should return user when id exists', async () => {
      const id = '1';
      const expectedUser = {
        id,
        name: 'Test User',
        email: 'test@example.com',
        role: 'user' as const,
      };

      mockRepository.findOne.mockResolvedValue(expectedUser);

      const result = await service.findById(id);
      expect(result).toEqual(expectedUser);
    });

    it('should throw NotFoundException when id does not exist', async () => {
      const id = 'nonexistent';
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findById(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update user when id exists', async () => {
      const id = '1';
      const updateData = { name: 'Updated Name' };
      const existingUser = {
        id,
        name: 'Test User',
        email: 'test@example.com',
        role: 'user' as const,
      };
      const updatedUser = { ...existingUser, ...updateData };

      mockRepository.findOne.mockResolvedValue(existingUser);
      mockRepository.update.mockResolvedValue({ affected: 1 });
      mockRepository.findOne.mockResolvedValue(updatedUser);

      const result = await service.update(id, updateData);
      expect(result).toEqual(updatedUser);
    });

    it('should throw NotFoundException when id does not exist', async () => {
      const id = 'nonexistent';
      const updateData = { name: 'Updated Name' };
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(id, updateData)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove user when id exists', async () => {
      const id = '1';
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(id);
      expect(repository.delete).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException when id does not exist', async () => {
      const id = 'nonexistent';
      mockRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove(id)).rejects.toThrow(NotFoundException);
    });
  });
});
