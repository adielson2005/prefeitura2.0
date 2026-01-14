import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupabaseService {
  public client: SupabaseClient;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_SERVICE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      console.warn(
        '⚠️  Credenciais do Supabase não configuradas. Configure SUPABASE_URL e SUPABASE_SERVICE_KEY no .env',
      );
    }

    this.client = createClient(supabaseUrl || '', supabaseKey || '');
  }
}
