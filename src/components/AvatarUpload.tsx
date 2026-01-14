import { Camera, Upload, X } from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AvatarUploadProps {
  currentAvatar?: string;
  userName: string;
  userId: string;
  onAvatarUpdate: (avatarUrl: string) => void;
}

export function AvatarUpload({
  currentAvatar,
  userName,
  userId,
  onAvatarUpdate,
}: AvatarUploadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo
    if (!file.type.startsWith("image/")) {
      toast({
        title: "❌ Arquivo inválido",
        description: "Selecione uma imagem (JPG, PNG, GIF)",
        variant: "destructive",
      });
      return;
    }

    // Validar tamanho (máx 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "❌ Arquivo muito grande",
        description: "A imagem deve ter no máximo 2MB",
        variant: "destructive",
      });
      return;
    }

    // Criar preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
      setSelectedFile(file);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      // Gerar nome único para o arquivo
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload para o Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("user-files")
        .upload(filePath, selectedFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      // Obter URL pública
      const {
        data: { publicUrl },
      } = supabase.storage.from("user-files").getPublicUrl(filePath);

      // Atualizar perfil do usuário
      const { error: updateError } = await supabase
        .from("users")
        .update({ avatar_url: publicUrl })
        .eq("id", userId);

      if (updateError) {
        throw new Error(updateError.message);
      }

      onAvatarUpdate(publicUrl);
      toast({
        title: "✅ Foto atualizada",
        description: "Sua foto de perfil foi alterada com sucesso!",
      });
      setIsOpen(false);
      setPreview(null);
      setSelectedFile(null);
    } catch (error) {
      console.error("Erro no upload:", error);
      toast({
        title: "❌ Erro no upload",
        description:
          error instanceof Error
            ? error.message
            : "Erro ao fazer upload. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getInitials = () => {
    return userName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <>
      {/* Avatar Display */}
      <div className="relative inline-block">
        {currentAvatar || preview ? (
          <img
            src={preview || currentAvatar}
            alt={userName}
            className="w-24 h-24 rounded-full object-cover border-4 border-white/20"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-4xl font-bold border-4 border-white/10">
            {getInitials()}
          </div>
        )}

        <button
          onClick={() => setIsOpen(true)}
          className="absolute bottom-0 right-0 bg-white text-blue-600 rounded-full p-2 shadow-lg hover:bg-blue-50 transition-all hover:scale-110"
        >
          <Camera className="h-4 w-4" />
        </button>
      </div>

      {/* Upload Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Alterar Foto de Perfil</DialogTitle>
            <DialogDescription>
              Escolha uma imagem para seu avatar (JPG, PNG, GIF - máx 2MB)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Preview */}
            <div className="flex justify-center">
              {preview ? (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-40 h-40 rounded-full object-cover border-4 border-blue-500"
                  />
                  <button
                    onClick={handleRemove}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-5xl font-bold text-white border-4 border-blue-500">
                  {getInitials()}
                </div>
              )}
            </div>

            {/* File Input */}
            <div className="flex flex-col gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {!preview ? (
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Selecionar Imagem
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="flex-1"
                  >
                    {uploading ? "Enviando..." : "Confirmar"}
                  </Button>
                  <Button
                    onClick={handleRemove}
                    variant="outline"
                    disabled={uploading}
                  >
                    Cancelar
                  </Button>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Formatos aceitos: JPG, PNG, GIF</p>
              <p>• Tamanho máximo: 2MB</p>
              <p>• Recomendado: imagem quadrada</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
