import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
  IsDate,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Nome completo do usuário',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Email do usuário',
    required: false,
  })
  @IsEmail({}, { message: 'Email inválido' })
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: '123456',
    description: 'Senha do usuário',
    minLength: 6,
    required: false,
  })
  @IsString()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  @IsOptional()
  password?: string;

  @ApiProperty({
    example: 'user',
    description: 'Papel do usuário (user ou admin)',
    enum: ['user', 'admin'],
    required: false,
  })
  @IsString()
  @IsEnum(['user', 'admin'])
  @IsOptional()
  role?: 'user' | 'admin';

  @ApiProperty({
    example: '2024-03-15T00:00:00.000Z',
    description: 'Data do último login do usuário',
    required: false,
  })
  @IsDate()
  @IsOptional()
  lastLoginAt?: Date;
}
