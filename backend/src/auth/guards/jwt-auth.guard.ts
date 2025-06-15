import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    console.log('🔑 JWT Guard - Iniciando autenticação');
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    console.log('🔑 JWT Guard - Resultado da autenticação:', {
      error: err ? err.message : null,
      user: user ? { id: user.id, email: user.email, role: user.role } : null,
      info: info ? info.message : null,
    });

    if (err || !user) {
      throw err || new Error('Usuário não autenticado');
    }
    return user;
  }
}
