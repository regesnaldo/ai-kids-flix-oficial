'use client'; 
import { useState, useMemo } from 'react'; 
import AgentCard from '@/components/AgentCard'; 
import { ALL_AGENTS } from '@/canon/agents/all-agents'; 
import type { AgentDefinition } from '@/canon/agents/generated/types'; 
import { motion, AnimatePresence } from 'framer-motion';

export default function AgentesPage() { 
  const [selectedDimension, setSelectedDimension] = useState<string>('all'); 
  const [selectedLevel, setSelectedLevel] = useState<string>('all'); 
  const [selectedFaction, setSelectedFaction] = useState<string>('all'); 
  const [searchTerm, setSearchTerm] = useState(''); 

  const dimensions = useMemo(() => ['all', ...Array.from(new Set(ALL_AGENTS.map(a => a.dimension)))], []); 
  const levels = useMemo(() => ['all', ...Array.from(new Set(ALL_AGENTS.map(a => a.level)))], []); 
  const factions = useMemo(() => ['all', ...Array.from(new Set(ALL_AGENTS.map(a => a.faction)))], []); 

  const filteredAgents = useMemo(() => { 
    return ALL_AGENTS.filter(agent => { 
      const matchesDimension = selectedDimension === 'all' || agent.dimension === selectedDimension; 
      const matchesLevel = selectedLevel === 'all' || agent.level === selectedLevel; 
      const matchesFaction = selectedFaction === 'all' || agent.faction === selectedFaction; 
      const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           agent.personality.approach.toLowerCase().includes(searchTerm.toLowerCase()); 
      
      return matchesDimension && matchesLevel && matchesFaction && matchesSearch; 
    }); 
  }, [selectedDimension, selectedLevel, selectedFaction, searchTerm]); 

  return ( 
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 py-12 px-4 relative overflow-hidden"> 
      {/* Background decorativo */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10"> 
        {/* Header */} 
        <div className="text-center mb-16"> 
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-7xl font-extrabold text-white mb-6 tracking-tighter"
          > 
            🧠 Os 120 Agentes MENTE.AI 
          </motion.h1> 
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-purple-200/80 mb-12 max-w-3xl mx-auto leading-relaxed"
          > 
            Explore e conecte-se com personalidades que guiarão sua jornada de autoconhecimento 
          </motion.p> 

          {/* Barra de Pesquisa */} 
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="max-w-2xl mx-auto mb-10 group"
          > 
            <input 
              type="text" 
              placeholder="Buscar agente por nome ou abordagem..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full px-8 py-5 rounded-2xl bg-white/5 backdrop-blur-xl border-2 border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 shadow-2xl" 
            /> 
          </motion.div> 

          {/* Filtros */} 
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-4 justify-center mb-12"
          > 
            {/* Dimensão */} 
            <div className="relative">
              <select 
                value={selectedDimension} 
                onChange={(e) => setSelectedDimension(e.target.value)} 
                className="appearance-none px-6 py-3 pr-10 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-white focus:outline-none focus:border-purple-500 transition-all hover:bg-white/10 cursor-pointer" 
              > 
                <option value="all" className="text-gray-900">Todas Dimensões</option> 
                {dimensions.filter(d => d !== 'all').map(dim => ( 
                  <option key={dim} value={dim} className="text-gray-900 capitalize">{dim}</option> 
                ))} 
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-purple-400">▼</div>
            </div>

            {/* Nível */} 
            <div className="relative">
              <select 
                value={selectedLevel} 
                onChange={(e) => setSelectedLevel(e.target.value)} 
                className="appearance-none px-6 py-3 pr-10 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-white focus:outline-none focus:border-purple-500 transition-all hover:bg-white/10 cursor-pointer" 
              > 
                <option value="all" className="text-gray-900">Todos Níveis</option> 
                {levels.filter(l => l !== 'all').map(level => ( 
                  <option key={level} value={level} className="text-gray-900 capitalize">{level}</option> 
                ))} 
              </select> 
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-purple-400">▼</div>
            </div>

            {/* Facção */} 
            <div className="relative">
              <select 
                value={selectedFaction} 
                onChange={(e) => setSelectedFaction(e.target.value)} 
                className="appearance-none px-6 py-3 pr-10 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-white focus:outline-none focus:border-purple-500 transition-all hover:bg-white/10 cursor-pointer" 
              > 
                <option value="all" className="text-gray-900">Todas Facções</option> 
                {factions.filter(f => f !== 'all').map(faction => ( 
                  <option key={faction} value={faction} className="text-gray-900 capitalize">{faction}</option> 
                ))} 
              </select> 
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-purple-400">▼</div>
            </div>
          </motion.div> 

          {/* Contador */} 
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-block px-6 py-2 bg-purple-500/20 rounded-full border border-purple-500/30 text-purple-200 font-medium"
          > 
            Mostrando <span className="text-white font-bold">{filteredAgents.length}</span> de {ALL_AGENTS.length} agentes 
          </motion.div> 
        </div> 

        {/* Grid de Cards */} 
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        > 
          <AnimatePresence>
            {filteredAgents.map(agent => ( 
              <motion.div
                key={agent.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <AgentCard agent={agent} /> 
              </motion.div>
            ))} 
          </AnimatePresence>
        </motion.div> 

        {/* Mensagem se não encontrar */} 
        {filteredAgents.length === 0 && ( 
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32 bg-white/5 rounded-3xl border border-dashed border-white/10 mt-12"
          > 
            <p className="text-white/60 text-2xl mb-4">Nenhum agente encontrado para os filtros selecionados.</p> 
            <button 
              onClick={() => {
                setSelectedDimension('all');
                setSelectedLevel('all');
                setSelectedFaction('all');
                setSearchTerm('');
              }}
              className="text-purple-400 hover:text-purple-300 underline font-medium"
            >
              Resetar todos os filtros
            </button>
          </motion.div> 
        )} 
      </div> 
    </div> 
  ); 
}
