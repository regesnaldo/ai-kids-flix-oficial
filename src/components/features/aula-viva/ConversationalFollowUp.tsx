"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, 
  Send, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  Loader2,
  RefreshCw,
  Zap,
  ThumbsUp,
  ThumbsDown,
  Lightbulb,
  BookOpen,
  Gamepad2
} from "lucide-react";

// Quick action buttons
const quickActions = [
  { 
    id: 'simplify', 
    label: 'Explicar de novo', 
    icon: Lightbulb,
    prompt: 'Explique de forma ainda mais simples'
  },
  { 
    id: 'example', 
    label: 'Dar exemplo', 
    icon: BookOpen,
    prompt: 'Me dê um exemplo do dia a dia'
  },
  { 
    id: 'game', 
    label: 'Tornar divertido', 
    icon: Gamepad2,
    prompt: 'Transforme isso em um jogo educativo'
  }
];

// Follow-up question suggestions
const followUpSuggestions = [
  "Como isso funciona na prática?",
  "Me dê um exemplo para crianças",
  "Por que isso é importante?",
  "O que acontece se eu mudar algo?",
  "Posso usar isso no meu trabalho?"
];

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

interface ConversationalFollowUpProps {
  lessonTitle: string;
  onFollowUp: (question: string) => void;
  isLoading?: boolean;
}

export default function ConversationalFollowUp({ 
  lessonTitle, 
  onFollowUp,
  isLoading = false 
}: ConversationalFollowUpProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = () => {
    if (!message.trim() || isLoading) return;
    
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: message.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    
    // Trigger follow-up callback
    onFollowUp(message.trim());
    
    // Add AI response placeholder
    const aiMessage: Message = {
      id: `ai-${Date.now()}`,
      role: 'ai',
      content: '',
      timestamp: new Date(),
      isLoading: true
    };
    setTimeout(() => {
      setMessages(prev => prev.map(m => 
        m.id === aiMessage.id 
          ? { ...m, content: 'Entendi! Vou criar uma explicação personalizada para você.', isLoading: false }
          : m
      ));
    }, 1500);
  };
  
  const handleQuickAction = (action: typeof quickActions[0]) => {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: action.prompt,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    onFollowUp(action.prompt);
    
    // AI response placeholder
    const aiMessage: Message = {
      id: `ai-${Date.now()}`,
      role: 'ai',
      content: '',
      timestamp: new Date(),
      isLoading: true
    };
    setTimeout(() => {
      setMessages(prev => prev.map(m => 
        m.id === aiMessage.id 
          ? { ...m, content: `Ótima ideia! Vou adaptar a explicação sobre ${lessonTitle} para ${action.label.toLowerCase()}.`, isLoading: false }
          : m
      ));
    }, 1200);
  };
  
  const handleSuggestion = (suggestion: string) => {
    setMessage(suggestion);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-24 right-4 md:right-8 z-40 w-80 md:w-96"
    >
      <AnimatePresence>
        {/* Expanded chat panel */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-gradient-to-br from-gray-900/95 to-gray-950/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden mb-4"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-cyan-500/10 to-purple-500/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">Continuar Conversa</h4>
                  <p className="text-white/50 text-xs">Sobre: {lessonTitle}</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsExpanded(false)}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 transition-colors"
              >
                <ChevronDown className="w-5 h-5" />
              </motion.button>
            </div>
            
            {/* Messages */}
            <div className="h-72 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-white/40 py-8">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Pergunte qualquer coisa sobre esta aula</p>
                </div>
              )}
              
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white'
                      : 'bg-white/5 border border-white/10'
                  }`}>
                    {msg.isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                        <span className="text-white/60 text-sm">Pensando...</span>
                      </div>
                    ) : (
                      <p className="text-white/90 text-sm">{msg.content}</p>
                    )}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Suggestions */}
            {messages.length === 0 && (
              <div className="px-4 pb-2">
                <p className="text-white/40 text-xs mb-2">Sugestões:</p>
                <div className="flex flex-wrap gap-2">
                  {followUpSuggestions.slice(0, 3).map((suggestion, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSuggestion(suggestion)}
                      className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs hover:bg-white/10 hover:text-white transition-colors"
                    >
                      {suggestion}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Quick Actions */}
            <div className="p-4 border-t border-white/10">
              <div className="flex gap-2 mb-3">
                {quickActions.map((action) => (
                  <motion.button
                    key={action.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleQuickAction(action)}
                    disabled={isLoading}
                    className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white/70 text-xs hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
                  >
                    <action.icon className="w-3 h-3" />
                    <span className="hidden sm:inline">{action.label}</span>
                    <span className="sm:hidden">{action.id === 'simplify' ? 'Simples' : action.id === 'example' ? 'Exemplo' : 'Jogo'}</span>
                  </motion.button>
                ))}
              </div>
              
              {/* Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Faça uma pergunta..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/40 focus:outline-none focus:border-cyan-500/50 disabled:opacity-50"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={!message.trim() || isLoading}
                  className="p-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Toggle button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all ${
          isExpanded 
            ? 'bg-gray-800 text-white border border-white/20' 
            : 'bg-gradient-to-br from-cyan-500 to-purple-500 text-white'
        }`}
      >
        {isExpanded ? (
          <ChevronDown className="w-6 h-6" />
        ) : (
          <div className="relative">
            <MessageCircle className="w-6 h-6" />
            {/* Notification dot */}
            {messages.length === 0 && (
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
          </div>
        )}
      </motion.button>
    </motion.div>
  );
}

// Feedback component for lessons
interface LessonFeedbackProps {
  onFeedback: (type: 'positive' | 'negative', comment?: string) => void;
}

export function LessonFeedback({ onFeedback }: LessonFeedbackProps) {
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState('');
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-8 text-center"
    >
      <p className="text-white/50 text-sm mb-4">Esta aula foi útil para você?</p>
      <div className="flex items-center justify-center gap-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onFeedback('positive')}
          className="p-3 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30 transition-colors"
        >
          <ThumbsUp className="w-5 h-5" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowComment(!showComment)}
          className="p-3 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-colors"
        >
          <ThumbsDown className="w-5 h-5" />
        </motion.button>
      </div>
      
      {showComment && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 max-w-md mx-auto"
        >
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Como podemos melhorar?"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/40 focus:outline-none focus:border-cyan-500/50"
            rows={3}
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              onFeedback('negative', comment);
              setShowComment(false);
              setComment('');
            }}
            className="mt-2 px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-sm font-semibold"
          >
            Enviar Feedback
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}

// Quiz component for interactive learning
interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

interface InteractiveQuizProps {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
}

export function InteractiveQuiz({ questions, onComplete }: InteractiveQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  
  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    
    if (index === questions[currentQuestion].correct) {
      setScore(prev => prev + 1);
    }
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
        onComplete(score + (index === questions[currentQuestion].correct ? 1 : 0));
      }
    }, 1000);
  };
  
  if (showResult) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-8 bg-gradient-to-br from-purple-900/30 to-gray-900/80 rounded-2xl border border-purple-500/20"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5 }}
          className="text-6xl mb-4"
        >
          {score === questions.length ? '🎉' : score >= questions.length / 2 ? '👍' : '📚'}
        </motion.div>
        <h3 className="text-2xl font-bold text-white mb-2">Resultado</h3>
        <p className="text-white/70 text-lg mb-4">
Você acertou <span className="text-cyan-400 font-bold">{score}</span> de <span className="text-purple-400 font-bold">{questions.length}</span> perguntas!
        </p>
        <p className="text-white/50 text-sm">
          {score === questions.length 
            ? 'Perfeito! Você entendeu tudo!' 
            : score >= questions.length / 2 
              ? 'Ótimo trabalho! Continue aprendendo!' 
              : 'Revise a aula e tente novamente!'}
        </p>
      </motion.div>
    );
  }
  
  const q = questions[currentQuestion];
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto p-6 bg-gradient-to-br from-gray-900/80 to-gray-950/90 rounded-2xl border border-white/10"
    >
      {/* Progress */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-white/50 text-sm">
          Pergunta {currentQuestion + 1} de {questions.length}
        </span>
        <div className="flex gap-1">
          {[...Array(questions.length)].map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                i < currentQuestion ? 'bg-cyan-400' : i === currentQuestion ? 'bg-purple-400' : 'bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>
      
      {/* Question */}
      <h3 className="text-xl font-bold text-white mb-6">{q.question}</h3>
      
      {/* Options */}
      <div className="space-y-3">
        {q.options.map((option, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleAnswer(i)}
            disabled={selectedAnswer !== null}
            className={`w-full p-4 rounded-xl text-left transition-all ${
              selectedAnswer === null 
                ? 'bg-white/5 border border-white/10 hover:border-cyan-500/50 text-white/90'
                : selectedAnswer === i
                  ? i === q.correct
                    ? 'bg-green-500/30 border-green-500/50 text-green-300'
                    : 'bg-red-500/30 border-red-500/50 text-red-300'
                  : i === q.correct
                    ? 'bg-green-500/30 border-green-500/50 text-green-300'
                    : 'bg-white/5 border border-white/10 text-white/40'
            }`}
          >
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/10 mr-3 text-sm">
              {String.fromCharCode(65 + i)}
            </span>
            {option}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}