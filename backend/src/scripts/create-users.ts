import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const usersService = app.get(UsersService);

  try {
    // Criar usuário admin
    const adminUser = {
      name: 'Admin User',
      email: 'admin@example.com',
      password: '123456',
      role: 'admin' as const,
    };

    // Criar usuário normal
    const normalUser = {
      name: 'Normal User',
      email: 'user@example.com',
      password: '123456',
      role: 'user' as const,
    };

    // Verificar se os usuários já existem
    const existingAdmin = await usersService.findByEmail(adminUser.email);
    const existingUser = await usersService.findByEmail(normalUser.email);

    // Criar ou atualizar usuário admin
    if (existingAdmin) {
      console.log('Atualizando usuário admin...');
      await usersService.update(existingAdmin.id, adminUser);
      console.log('Usuário admin atualizado com sucesso!');
    } else {
      console.log('Criando usuário admin...');
      await usersService.create(adminUser);
      console.log('Usuário admin criado com sucesso!');
    }

    // Criar ou atualizar usuário normal
    if (existingUser) {
      console.log('Atualizando usuário normal...');
      await usersService.update(existingUser.id, normalUser);
      console.log('Usuário normal atualizado com sucesso!');
    } else {
      console.log('Criando usuário normal...');
      await usersService.create(normalUser);
      console.log('Usuário normal criado com sucesso!');
    }

    console.log('\nCredenciais dos usuários:');
    console.log('\nAdmin:');
    console.log('Email:', adminUser.email);
    console.log('Senha:', adminUser.password);
    console.log('\nUsuário Normal:');
    console.log('Email:', normalUser.email);
    console.log('Senha:', normalUser.password);
  } catch (error) {
    console.error('Erro ao criar usuários:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
