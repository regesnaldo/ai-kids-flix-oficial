import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { Upload, Film, Check, AlertCircle, ArrowLeft, Link2, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function AdminUpload() {
  const { user, isAuthenticated } = useAuth();
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [urlMode, setUrlMode] = useState(false);
  const [externalUrl, setExternalUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: episodes, isLoading: loadingEpisodes } = trpc.admin.getEpisodes.useQuery(
    undefined,
    { enabled: isAuthenticated && user?.role === "admin" }
  );
  const { data: seriesList } = trpc.admin.getSeries.useQuery(
    undefined,
    { enabled: isAuthenticated && user?.role === "admin" }
  );

  const uploadMutation = trpc.admin.uploadVideo.useMutation({
    onSuccess: (data) => {
      toast.success(`Vídeo enviado! URL: ${data.url.substring(0, 60)}...`);
      setSelectedEpisodeId(null);
      setUploading(false);
    },
    onError: (err) => {
      toast.error(`Erro no upload: ${err.message}`);
      setUploading(false);
    },
  });

  const updateUrlMutation = trpc.admin.updateVideoUrl.useMutation({
    onSuccess: () => {
      toast.success("URL do vídeo atualizada!");
      setSelectedEpisodeId(null);
      setExternalUrl("");
    },
    onError: (err) => {
      toast.error(`Erro: ${err.message}`);
    },
  });

  const trpcUtils = trpc.useUtils();

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#080c18] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Acesso Restrito</h1>
          <p className="text-gray-400 mb-6">Apenas administradores podem acessar esta página.</p>
          <Link href="/netflix">
            <Button variant="outline" className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10">
              <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedEpisodeId) return;

    if (file.size > 100 * 1024 * 1024) {
      toast.error("Arquivo muito grande. Máximo: 100MB. Use URL externa para arquivos maiores.");
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      uploadMutation.mutate({
        episodeId: selectedEpisodeId,
        fileName: file.name,
        fileBase64: base64,
        contentType: file.type,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleUrlUpdate = () => {
    if (!selectedEpisodeId || !externalUrl) return;
    updateUrlMutation.mutate({
      episodeId: selectedEpisodeId,
      videoUrl: externalUrl,
    }, {
      onSuccess: () => {
        trpcUtils.admin.getEpisodes.invalidate();
      }
    });
  };

  const seriesMap = new Map(seriesList?.map(s => [s.id, s.title]) || []);

  return (
    <div className="min-h-screen bg-[#080c18] text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#080c18]/95 backdrop-blur-md border-b border-cyan-500/20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/netflix">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2">
                <Film className="w-5 h-5 text-cyan-400" />
                Admin: Upload de Vídeos
              </h1>
              <p className="text-sm text-gray-400">Gerencie os vídeos dos episódios</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={urlMode ? "outline" : "default"}
              size="sm"
              onClick={() => setUrlMode(false)}
              className={!urlMode ? "bg-cyan-600 hover:bg-cyan-700" : "border-gray-600 text-gray-300"}
            >
              <Upload className="w-4 h-4 mr-1" /> Upload S3
            </Button>
            <Button
              variant={urlMode ? "default" : "outline"}
              size="sm"
              onClick={() => setUrlMode(true)}
              className={urlMode ? "bg-purple-600 hover:bg-purple-700" : "border-gray-600 text-gray-300"}
            >
              <Link2 className="w-4 h-4 mr-1" /> URL Externa
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loadingEpisodes ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
            <span className="ml-3 text-gray-400">Carregando episódios...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-sm text-gray-400 font-medium">ID</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-400 font-medium">Série</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-400 font-medium">Temp.</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-400 font-medium">Ep.</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-400 font-medium">Título</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-400 font-medium">Vídeo</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-400 font-medium">Ação</th>
                </tr>
              </thead>
              <tbody>
                {episodes?.map((ep) => (
                  <tr key={ep.id} className="border-b border-gray-800 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-sm text-gray-500 font-mono">{ep.id}</td>
                    <td className="py-3 px-4 text-sm text-cyan-300">{seriesMap.get(ep.seriesId) || `Série ${ep.seriesId}`}</td>
                    <td className="py-3 px-4 text-sm">T{ep.seasonNumber}</td>
                    <td className="py-3 px-4 text-sm">E{ep.episodeNumber}</td>
                    <td className="py-3 px-4 text-sm font-medium">{ep.title}</td>
                    <td className="py-3 px-4 text-sm">
                      {ep.videoUrl ? (
                        <span className="flex items-center gap-1 text-green-400">
                          <Check className="w-3 h-3" />
                          <span className="truncate max-w-[200px]" title={ep.videoUrl}>{ep.videoUrl.substring(0, 40)}...</span>
                        </span>
                      ) : (
                        <span className="text-red-400">Sem vídeo</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {selectedEpisodeId === ep.id ? (
                        <div className="flex items-center gap-2">
                          {urlMode ? (
                            <>
                              <input
                                type="text"
                                placeholder="https://..."
                                value={externalUrl}
                                onChange={(e) => setExternalUrl(e.target.value)}
                                className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm w-64 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                              />
                              <Button
                                size="sm"
                                onClick={handleUrlUpdate}
                                disabled={!externalUrl || updateUrlMutation.isPending}
                                className="bg-purple-600 hover:bg-purple-700 text-xs"
                              >
                                {updateUrlMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : "Salvar"}
                              </Button>
                            </>
                          ) : (
                            <>
                              <input
                                ref={fileInputRef}
                                type="file"
                                accept="video/*"
                                onChange={handleFileUpload}
                                className="hidden"
                              />
                              <Button
                                size="sm"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="bg-cyan-600 hover:bg-cyan-700 text-xs"
                              >
                                {uploading ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Upload className="w-3 h-3 mr-1" />}
                                {uploading ? "Enviando..." : "Escolher"}
                              </Button>
                            </>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => { setSelectedEpisodeId(null); setExternalUrl(""); }}
                            className="text-gray-400 text-xs"
                          >
                            Cancelar
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedEpisodeId(ep.id)}
                          className="border-gray-600 text-gray-300 hover:border-cyan-500 hover:text-cyan-400 text-xs"
                        >
                          {urlMode ? <Link2 className="w-3 h-3 mr-1" /> : <Upload className="w-3 h-3 mr-1" />}
                          {urlMode ? "Definir URL" : "Upload"}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
