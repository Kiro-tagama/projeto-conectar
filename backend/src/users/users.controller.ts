import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Criar novo usuário' })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        name: { type: 'string', example: 'John Doe' },
        email: { type: 'string', example: 'user@example.com' },
        role: { type: 'string', example: 'user' },
        createdAt: { type: 'string', example: '2024-03-15T00:00:00.000Z' },
        updatedAt: { type: 'string', example: '2024-03-15T00:00:00.000Z' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Email já existe' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'Listar todos os usuários' })
  @ApiQuery({
    name: 'role',
    required: false,
    type: String,
    description: 'Filtrar por papel (user/admin)',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    description: 'Campo para ordenação (name/email/createdAt)',
  })
  @ApiQuery({
    name: 'order',
    required: false,
    type: String,
    description: 'Ordem da ordenação (ASC/DESC)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários retornada com sucesso',
  })
  findAll(
    @Query('role') role?: 'user' | 'admin',
    @Query('sortBy') sortBy?: 'name' | 'email' | 'createdAt',
    @Query('order') order?: 'ASC' | 'DESC',
  ) {
    return this.usersService.findAll({ role, sortBy, order });
  }

  @Get(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Buscar usuário por ID' })
  @ApiResponse({
    status: 200,
    description: 'Usuário encontrado com sucesso',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        name: { type: 'string', example: 'John Doe' },
        email: { type: 'string', example: 'user@example.com' },
        role: { type: 'string', example: 'user' },
        createdAt: { type: 'string', example: '2024-03-15T00:00:00.000Z' },
        updatedAt: { type: 'string', example: '2024-03-15T00:00:00.000Z' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar usuário' })
  @ApiResponse({
    status: 200,
    description: 'Usuário atualizado com sucesso',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        name: { type: 'string', example: 'John Doe' },
        email: { type: 'string', example: 'user@example.com' },
        role: { type: 'string', example: 'user' },
        createdAt: { type: 'string', example: '2024-03-15T00:00:00.000Z' },
        updatedAt: { type: 'string', example: '2024-03-15T00:00:00.000Z' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 409, description: 'Email já existe' })
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    // Se não for admin, só pode atualizar seus próprios dados
    if (req.user.role !== 'admin' && req.user.id !== id) {
      throw new ForbiddenException(
        'Você não tem permissão para atualizar este usuário',
      );
    }

    // Se não for admin, não pode alterar a role
    if (req.user.role !== 'admin' && updateUserDto.role) {
      throw new ForbiddenException(
        'Você não tem permissão para alterar a role',
      );
    }

    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Remover usuário' })
  @ApiResponse({ status: 200, description: 'Usuário removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Get('inactive')
  @Roles('admin')
  @ApiOperation({ summary: 'Listar usuários inativos nos últimos 30 dias' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários inativos retornada com sucesso',
  })
  findInactive() {
    return this.usersService.findInactiveUsers();
  }
}
