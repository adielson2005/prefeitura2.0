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

  async requestPasswordReset(email: string) {
    try {
      // Verificar se usuário existe
      const { data: users, error } = await this.supabase
        .from('users')
        .select('id, email, full_name')
        .eq('email', email)
        .limit(1);

      if (error || !users || users.length === 0) {
        // Por segurança, retornar sucesso mesmo se email não existir
        return {
          success: true,
          message: 'Se o email existir, um código foi enviado.',
        };
      }

      const user = users[0];

      // Gerar código de 6 dígitos
      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 30); // Válido por 30 minutos

      // Salvar código no banco
      await this.supabase.from('password_reset_tokens').insert({
        user_id: user.id,
        email: user.email,
        reset_code: resetCode,
        expires_at: expiresAt.toISOString(),
        used: false,
      });

      // TODO: Enviar email com o código
      // Por enquanto, apenas log no console para desenvolvimento
      console.log('\n📧 CÓDIGO DE RECUPERAÇÃO DE SENHA');
      console.log('Email:', user.email);
      console.log('Código:', resetCode);
      console.log('Válido até:', expiresAt.toLocaleString('pt-BR'));
      console.log('\n');

      return {
        success: true,
        message: 'Código de recuperação enviado para o email.',
        // Em desenvolvimento, retornar o código
        devCode: process.env.NODE_ENV === 'development' ? resetCode : undefined,
      };
    } catch (error) {
      console.error('Erro ao solicitar recuperação de senha:', error);
      throw new Error('Erro ao processar solicitação');
    }
  }

  async verifyResetCode(email: string, code: string) {
    try {
      const { data: tokens, error } = await this.supabase
        .from('password_reset_tokens')
        .select('*')
        .eq('email', email)
        .eq('reset_code', code)
        .eq('used', false)
        .gte('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1);

      if (error || !tokens || tokens.length === 0) {
        throw new UnauthorizedException('Código inválido ou expirado');
      }

      return {
        success: true,
        message: 'Código válido',
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      console.error('Erro ao verificar código:', error);
      throw new UnauthorizedException('Erro ao verificar código');
    }
  }

  async resetPassword(email: string, code: string, newPassword: string) {
    try {
      // Verificar código novamente
      const { data: tokens, error: tokenError } = await this.supabase
        .from('password_reset_tokens')
        .select('*')
        .eq('email', email)
        .eq('reset_code', code)
        .eq('used', false)
        .gte('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1);

      if (tokenError || !tokens || tokens.length === 0) {
        throw new UnauthorizedException('Código inválido ou expirado');
      }

      const token = tokens[0];

      // Atualizar senha do usuário
      const newPasswordHash = this.hashPassword(newPassword);
      const { error: updateError } = await this.supabase
        .from('users')
        .update({ password_hash: newPasswordHash })
        .eq('id', token.user_id);

      if (updateError) {
        throw new Error('Erro ao atualizar senha');
      }

      // Marcar token como usado
      await this.supabase
        .from('password_reset_tokens')
        .update({ used: true })
        .eq('id', token.id);

      return {
        success: true,
        message: 'Senha redefinida com sucesso',
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      console.error('Erro ao redefinir senha:', error);
      throw new Error('Erro ao redefinir senha');
    }
  }
}
