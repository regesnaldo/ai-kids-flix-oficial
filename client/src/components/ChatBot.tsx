import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useThemeMode } from "@/contexts/ThemeModeContext";

type Message = {
  role: "bot" | "user";
  text: string;
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "Olá! Sou o assistente AI Kids Labs. Como posso ajudar você hoje?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { config } = useThemeMode();
  const chatMutation = trpc.chat.sendMessage.useMutation();

  // ✅ FIX 2: Ref para auto-scroll
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    const updatedMessages: Message[] = [...messages, { role: "user", text: userMessage }];

    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      // ✅ FIX 3: Enviando mensagem para a API
      const response = await chatMutation.mutateAsync({
        message: userMessage,
        context: { timestamp: new Date().toISOString() }
      });

      setMessages((prev) => [...prev, { role: "bot", text: response.botResponse }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Erro ao processar sua mensagem. Tente novamente." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* ✅ FIX 5: aria-label adicionado */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg"
        style={{ backgroundColor: config.colors.primary, boxShadow: `0 0 20px ${config.colors.primary}66` }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Abrir assistente"
      >
        <MessageCircle size={24} color="#fff" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            // ✅ FIX 4: Altura responsiva com max-h
            className="fixed bottom-24 right-6 z-50 w-80 max-h-[28rem] rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            style={{ backgroundColor: config.colors.background, border: `1px solid ${config.colors.primary}33` }}
          >
            <div className="p-4 flex items-center justify-between flex-shrink-0" style={{ backgroundColor: config.colors.primary }}>
              <span className="font-bold text-white">AI Assistant</span>
              {/* ✅ FIX 5: aria-label adicionado */}
              <button onClick={() => setIsOpen(false)} aria-label="Fechar chat">
                <X size={20} color="#fff" />
              </button>
            </div>

            {/* ✅ FIX 4: flex-1 para ocupar espaço disponível dinamicamente */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg max-w-[80%] ${msg.role === "bot" ? "mr-auto" : "ml-auto"}`}
                  style={{
                    backgroundColor: msg.role === "bot" ? `${config.colors.primary}22` : config.colors.primary,
                    color: msg.role === "bot" ? config.colors.text : "#fff"
                  }}
                >
                  {msg.text}
                </div>
              ))}

              {isLoading && (
                <div className="p-3 rounded-lg max-w-[80%] mr-auto" style={{ backgroundColor: `${config.colors.primary}22` }}>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: config.colors.primary }} />
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: config.colors.primary, animationDelay: "0.3s" }} />
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: config.colors.primary, animationDelay: "0.6s" }} />
                  </div>
                </div>
              )}

              {/* ✅ FIX 2: Âncora para auto-scroll */}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t flex-shrink-0" style={{ borderColor: `${config.colors.primary}33` }}>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 px-3 py-2 rounded-lg text-sm"
                  style={{
                    backgroundColor: `${config.colors.primary}11`,
                    color: config.colors.text,
                    border: `1px solid ${config.colors.primary}33`
                  }}
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading}
                  className="px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: config.colors.primary, color: "#fff" }}
                >
                  {isLoading ? "..." : "Enviar"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
