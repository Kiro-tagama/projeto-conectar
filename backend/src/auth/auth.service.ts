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
      return null;
    }

    if (!user.password || !password) {
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
      return null;
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    // Atualiza a data do último login
    await this.usersService.update(user.id, { lastLoginAt: new Date() });

    const payload = { sub: user.id };

    const token = this.jwtService.sign(payload);

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
