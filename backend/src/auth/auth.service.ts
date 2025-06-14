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
    console.log('Validando usuário:', email);
    const user = await this.usersService.findByEmail(email);
    console.log('Usuário encontrado:', user);

    if (!user) {
      console.log('Usuário não encontrado');
      return null;
    }

    console.log('Senha recebida:', password);
    console.log('Hash armazenado:', user.password);

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
      console.log('Senha válida:', isPasswordValid);

      if (!isPasswordValid) {
        console.log('Senha inválida');
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
    console.log('Tentando login:', loginDto.email);
    const user = await this.validateUser(loginDto.email, loginDto.password);
    console.log('Resultado da validação:', user);

    if (!user) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    console.log('Login bem-sucedido para:', user.email);

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async register(registerDto: RegisterDto) {
    console.log('Tentando registro:', registerDto.email);
    const existingUser = await this.usersService.findByEmail(registerDto.email);

    if (existingUser) {
      throw new ConflictException('Email já existe');
    }

    const user = await this.usersService.create(registerDto);

    console.log('Senha hasheada:', user.password);
    console.log('Usuário criado:', user.email);
    return user;
  }
}
