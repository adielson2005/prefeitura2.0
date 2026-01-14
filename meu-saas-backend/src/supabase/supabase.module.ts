import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    SupabaseService,
    {
      provide: 'SUPABASE_CLIENT',
      useFactory: (configService: ConfigService) => {
        const supabaseUrl = configService.get<string>('SUPABASE_URL', '');

        // Usar ANON_KEY para desenvolvimento (em produção use SERVICE_KEY)
        const supabaseKey =
          configService.get<string>('SUPABASE_SERVICE_KEY') ||
          configService.get<string>('SUPABASE_ANON_KEY', '');

        if (!supabaseUrl || !supabaseKey) {
          throw new Error(
            'Supabase URL e chave devem estar configurados no .env',
          );
        }

        return createClient(supabaseUrl, supabaseKey, {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: ['SUPABASE_CLIENT', SupabaseService],
})
export class SupabaseModule {}
