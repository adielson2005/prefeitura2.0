import { Injectable, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class UploadsService {
  constructor(
    @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient,
  ) {}

  async saveFileMetadata(metadata: {
    filename: string;
    originalName: string;
    mimetype: string;
    size: number;
    path: string;
    userId: string | null;
    description: string | null;
  }) {
    const { data, error } = await this.supabase
      .from('uploads')
      .insert({
        filename: metadata.filename,
        original_name: metadata.originalName,
        mimetype: metadata.mimetype,
        size: metadata.size,
        file_path: metadata.path,
        user_id: metadata.userId,
        description: metadata.description,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao salvar metadados do arquivo: ${error.message}`);
    }

    return {
      success: true,
      file: {
        id: data.id,
        filename: data.filename,
        originalName: data.original_name,
        url: `/uploads/${data.filename}`,
        size: data.size,
        mimetype: data.mimetype,
      },
    };
  }

  async getFile(fileId: string) {
    const { data, error } = await this.supabase
      .from('uploads')
      .select('*')
      .eq('id', fileId)
      .single();

    if (error) {
      throw new Error(`Arquivo não encontrado: ${error.message}`);
    }

    return data;
  }

  async getUserFiles(userId: string) {
    const { data, error } = await this.supabase
      .from('uploads')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Erro ao buscar arquivos: ${error.message}`);
    }

    return data;
  }

  async deleteFile(fileId: string) {
    const { error } = await this.supabase
      .from('uploads')
      .delete()
      .eq('id', fileId);

    if (error) {
      throw new Error(`Erro ao deletar arquivo: ${error.message}`);
    }

    return { success: true, message: 'Arquivo deletado com sucesso' };
  }
}
