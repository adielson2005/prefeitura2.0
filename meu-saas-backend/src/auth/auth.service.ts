import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { createHash } from 'crypto';

interface User {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  full_name: string;
  role: string;
  last_login?: string;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient,
  ) {}

  private hashPassword(password: string): string {
    return createHash('sha256').update(password).digest('hex');
  }

  async login(username: string, password: string, loginType?: string) {
    try {
      // Buscar usuário
      const { data: users, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .limit(1);

      if (error || !users || users.length === 0) {
        throw new UnauthorizedException('Usuário não encontrado');
      }

      const user = users[0] as User;
      const passwordHash = this.hashPassword(password);

      if (user.password_hash !== passwordHash) {
        // Registrar falha na auditoria
        await this.registerLoginAudit({
          username,
          login_type: loginType || 'direto',
          success: false,
          error_message: 'Senha incorreta',
        });

        throw new UnauthorizedException('Senha incorreta');
      }

      // Atualizar último login
      await this.supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', user.id);

      // Registrar sucesso na auditoria
      await this.registerLoginAudit({
        user_id: user.id,
        username,
        role: user.role,
        login_type: loginType || 'direto',
        success: true,
      });

      // Remover senha do retorno
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password_hash, ...userWithoutPassword } = user;

      return {
        success: true,
        user: userWithoutPassword,
        message: 'Login realizado com sucesso',
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      console.error('Erro no login:', error);
      throw new UnauthorizedException('Erro ao realizar login');
    }
  }

  private async registerLoginAudit(auditData: {
    user_id?: string;
    username: string;
    role?: string;
    login_type: string;
    success: boolean;
    error_message?: string;
  }) {
    try {
      await this.supabase.from('login_audit').insert({
        ...auditData,
        logged_in_at: new Date().toISOString(),
        ip_address: null, // Pode ser preenchido via middleware
        user_agent: null, // Pode ser preenchido via middleware
        browser: null,
        os: null,
        device: null,
      });
    } catch (error) {
      console.error('Erro ao registrar auditoria:', error);
    }
  }

  async validateUser(userId: string) {
    const { data: user, error } = await this.supabase
      .from('users')
      .select('id, username, email, role, full_name')
      .eq('id', userId)
      .single();

    if (error || !user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    return user;
  }
}
