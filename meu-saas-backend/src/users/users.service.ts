import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class UsersService {
  constructor(
    @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient,
  ) {}

  async findAll() {
    const { data, error } = await this.supabase
      .from('users')
      .select('id, username, email, role, full_name, created_at, last_login')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Erro ao buscar usuários: ${error.message}`);
    }

    return data;
  }

  async findOne(id: string) {
    const { data, error } = await this.supabase
      .from('users')
      .select('id, username, email, role, full_name, created_at, last_login')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return data;
  }

  async updateProfile(
    userId: string,
    updateData: { full_name?: string; email?: string },
  ) {
    const { data, error } = await this.supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao atualizar perfil: ${error.message}`);
    }

    return data;
  }
}
