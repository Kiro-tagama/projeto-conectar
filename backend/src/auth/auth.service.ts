import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      console.log('Usuário não encontrado');
      return null;
    }

    if (!user.password || !password) {
      console.log('Senha ou hash nulos');
      return null;
    }

    try {
      // Compara a senha com o hash
      const isPasswordValid = await bcrypt.compare(
        password.toString(),
        user.password,
      );

      if (!isPasswordValid) {
        return null;
      }

      const { password: _, ...result } = user;
      return result;
    } catch (error) {
      console.error('Erro ao comparar senhas:', error);
      return null;
    }
  }

  async login(loginDto: LoginDto) {
    console.log('🔐 Tentativa de login para:', loginDto.email);

    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      console.log('❌ Login falhou para:', loginDto.email);
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    // Atualiza a data do último login
    await this.usersService.update(user.id, { lastLoginAt: new Date() });

    console.log('✅ Login bem-sucedido para:', user.email);
    const payload = { sub: user.id };
    console.log('🎟️ Token payload gerado:', payload);

    const token = this.jwtService.sign(payload);
    console.log('🔑 Token JWT gerado:', token);

    return {
      access_token: token,
      user,
    };
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);

    if (existingUser) {
      throw new ConflictException('Email já existe');
    }

    const user = await this.usersService.create(registerDto);

    return user;
  }
}
