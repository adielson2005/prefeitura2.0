import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";

/**
 * Componente de Teste - Upload Avatar
 * Cole este componente em qualquer página para testar
 */
export function TesteUpload() {
  const [resultado, setResultado] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const testarConexao = async () => {
    setLoading(true);
    setResultado("Testando...");

    try {
      // Teste 1: Verificar usuário autenticado
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData.user) {
        setResultado(
          "❌ Erro: Usuário não está autenticado!\n" +
            (userError?.message || "")
        );
        setLoading(false);
        return;
      }

      setResultado(
        `✅ Usuário: ${userData.user.email}\nID: ${userData.user.id}\n\n`
      );

      // Teste 2: Listar buckets
      const { data: buckets, error: bucketError } =
        await supabase.storage.listBuckets();

      if (bucketError) {
        setResultado(
          (prev) => prev + `❌ Erro ao listar buckets: ${bucketError.message}\n`
        );
        setLoading(false);
        return;
      }

      setResultado(
        (prev) =>
          prev +
          `✅ Buckets encontrados: ${buckets
            ?.map((b) => b.name)
            .join(", ")}\n\n`
      );

      // Teste 3: Verificar bucket user-files
      const userFilesBucket = buckets?.find((b) => b.name === "user-files");

      if (!userFilesBucket) {
        setResultado(
          (prev) => prev + "❌ Bucket 'user-files' NÃO encontrado!\n"
        );
        setLoading(false);
        return;
      }

      setResultado(
        (prev) =>
          prev +
          `✅ Bucket 'user-files' encontrado!\nPúblico: ${userFilesBucket.public}\n\n`
      );

      // Teste 4: Listar arquivos no bucket
      const { data: files, error: filesError } = await supabase.storage
        .from("user-files")
        .list();

      if (filesError) {
        setResultado(
          (prev) => prev + `❌ Erro ao acessar bucket: ${filesError.message}\n`
        );
      } else {
        setResultado(
          (prev) =>
            prev + `✅ Bucket acessível! Arquivos: ${files?.length || 0}\n\n`
        );
      }

      setResultado((prev) => prev + "🎉 Tudo certo! Pode fazer upload!");
    } catch (error) {
      setResultado(
        `❌ Erro inesperado: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }

    setLoading(false);
  };

  const testarUpload = async () => {
    setLoading(true);
    setResultado("Criando arquivo de teste...");

    try {
      // Criar arquivo de teste
      const testFile = new File(["Teste de upload"], "teste.txt", {
        type: "text/plain",
      });

      const filePath = `test/teste-${Date.now()}.txt`;

      setResultado((prev) => prev + `\nFazendo upload para: ${filePath}...`);

      const { data, error } = await supabase.storage
        .from("user-files")
        .upload(filePath, testFile);

      if (error) {
        setResultado((prev) => prev + `\n❌ Erro no upload: ${error.message}`);
      } else {
        setResultado((prev) => prev + `\n✅ Upload OK! Path: ${data.path}`);

        // Obter URL pública
        const {
          data: { publicUrl },
        } = supabase.storage.from("user-files").getPublicUrl(filePath);

        setResultado((prev) => prev + `\n✅ URL: ${publicUrl}`);
      }
    } catch (error) {
      setResultado(
        `❌ Erro: ${error instanceof Error ? error.message : String(error)}`
      );
    }

    setLoading(false);
  };

  return (
    <div className="p-4 border rounded-lg space-y-4">
      <h3 className="text-lg font-bold">🔧 Teste de Upload - Supabase</h3>

      <div className="flex gap-2">
        <Button onClick={testarConexao} disabled={loading}>
          1. Testar Conexão
        </Button>
        <Button onClick={testarUpload} disabled={loading}>
          2. Testar Upload
        </Button>
      </div>

      {resultado && (
        <pre className="p-4 bg-slate-900 text-green-400 rounded text-xs overflow-auto max-h-96 whitespace-pre-wrap">
          {resultado}
        </pre>
      )}
    </div>
  );
}
