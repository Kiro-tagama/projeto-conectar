import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    console.log('🔒 Roles Guard - Roles requeridas:', requiredRoles);

    if (!requiredRoles) {
      console.log('✅ Roles Guard - Nenhuma role requerida, acesso permitido');
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    console.log('👤 Roles Guard - Usuário atual:', user);

    const hasRole = requiredRoles.some((role) => user.role === role);
    console.log('🔍 Roles Guard - Usuário tem a role necessária?', hasRole);

    return hasRole;
  }
}
