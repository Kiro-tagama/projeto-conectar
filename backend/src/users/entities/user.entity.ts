import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID único do usuário',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Nome completo do usuário',
  })
  @Column()
  name: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Email do usuário',
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    example: 'hashedPassword',
    description: 'Senha hasheada do usuário',
    writeOnly: true,
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  @Exclude()
  password: string;

  @ApiProperty({
    example: 'user',
    description: 'Papel do usuário (user ou admin)',
    enum: ['user', 'admin'],
  })
  @Column({ type: 'enum', enum: ['user', 'admin'], default: 'user' })
  role: 'user' | 'admin';

  @ApiProperty({
    example: '2024-03-15T00:00:00.000Z',
    description: 'Data do último login do usuário',
    nullable: true,
  })
  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt: Date;

  @ApiProperty({
    example: '2024-03-15T00:00:00.000Z',
    description: 'Data de criação do usuário',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    example: '2024-03-15T00:00:00.000Z',
    description: 'Data da última atualização do usuário',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
