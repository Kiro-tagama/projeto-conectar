import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Email já existe');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.usersRepository.save(user);
  }

  async findAll(params: {
    role?: 'user' | 'admin';
    sortBy?: 'name' | 'email' | 'createdAt';
    order?: 'ASC' | 'DESC';
  }) {
    const { role, sortBy = 'createdAt', order = 'DESC' } = params;

    const where: any = {};
    if (role) {
      where.role = role;
    }

    const [users, total] = await this.usersRepository.findAndCount({
      where,
      order: {
        [sortBy]: order,
      },
    });

    return {
      data: users,
      total,
    };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    console.log('📝 Iniciando atualização do usuário:', id);
    console.log('📦 Dados para atualização:', updateUserDto);

    const user = await this.findOne(id);

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      console.log(
        '📧 Verificando disponibilidade do novo email:',
        updateUserDto.email,
      );
      const existingUser = await this.findByEmail(updateUserDto.email);
      if (existingUser) {
        console.log('❌ Email já está em uso');
        throw new ConflictException('Email já existe');
      }
    }

    if (updateUserDto.password) {
      console.log('🔒 Atualizando senha do usuário');
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 12);
    }

    Object.assign(user, updateUserDto);
    const updatedUser = await this.usersRepository.save(user);
    console.log('✅ Usuário atualizado com sucesso:', {
      id: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role,
    });

    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }
}
