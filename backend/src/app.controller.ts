import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return {
      message: 'Bem-vindo à API da Conecta',
      documentation: '/api',
      description:
        'Acesse a documentação completa da API através do link acima',
    };
  }
}
