/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  X, 
  Maximize2, 
  ChevronLeft, 
  Play
} from 'lucide-react';
import gamesData from './data/games.json';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedGame, setSelectedGame] = useState(null);

  const categories = useMemo(() => {
    const cats = ['All', ...new Set(gamesData.map(g => g.category))];
    return cats;
  }, []);

  const filteredGames = useMemo(() => {
    return gamesData.filter((game) => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          game.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handlePlayGame = (game) => {
    setSelectedGame(game);
  };

  const handleCloseGame = () => {
    setSelectedGame(null);
  };

  return (
    <div className="flex min-h-screen bg-[#080808] text-white dotted-bg overflow-hidden font-sans">
      {/* Structural Sidebar */}
      <aside className="fixed left-0 top-0 w-[80px] h-full border-r border-white/10 flex flex-col items-center justify-between py-10 bg-black/40 backdrop-blur-xl z-50">
        <div 
          className="text-2xl font-bold border-2 border-white w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-white hover:text-black transition-colors"
          onClick={() => setSelectedGame(null)}
        >
          N
        </div>
        <div className="vertical-text text-sm tracking-[0.5em] text-white/40 uppercase font-bold">
          Nexus // Unblocked // 2024
        </div>
        <div className="flex flex-col gap-4">
          <div className={`w-2 h-2 rounded-full transition-colors ${selectedGame ? 'bg-white/20' : 'bg-gaming-accent'}`}></div>
          <div className="w-2 h-2 bg-white/20 rounded-full"></div>
          <div className="w-2 h-2 bg-white/20 rounded-full"></div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`flex-1 flex flex-col pl-[80px] h-screen overflow-y-auto styled-scrollbar scroll-smooth`}>
        {/* Header */}
        <div className="p-8 lg:p-12 pb-0">
          <header className="flex flex-col lg:flex-row justify-between items-end mb-12 border-b border-white/10 pb-8 gap-8">
            <div className="space-y-1">
              <h1 className="display-font text-5xl md:text-7xl leading-none uppercase tracking-tighter">
                Nexus<span className="text-gaming-accent">.</span>Play
              </h1>
              <p className="text-white/40 text-sm tracking-widest uppercase font-light">
                Curated Game Repository v1.2.0
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row items-end md:items-center gap-6 w-full lg:w-auto">
              {!selectedGame && (
                <div className="relative w-full md:w-64 order-2 md:order-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input 
                    type="text" 
                    placeholder="QUERY REPOSITORY..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded px-10 py-2 text-xs font-mono uppercase tracking-wider focus:outline-none focus:border-gaming-accent transition-colors"
                  />
                </div>
              )}
              <div className="text-right order-1 md:order-2">
                <div className="text-xs text-gaming-accent mb-1 font-mono uppercase tracking-[0.2em]">
                  Repository Status: Stable
                </div>
                <div className="text-3xl font-bold uppercase tracking-tight tabular-nums">
                  {gamesData.length} Indexed
                </div>
              </div>
            </div>
          </header>

          {/* Search/Filters Navigation */}
          {!selectedGame && (
            <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-4 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex-shrink-0 px-4 py-2 border text-[10px] uppercase font-bold tracking-widest transition-all ${
                    selectedCategory === cat 
                      ? 'border-gaming-accent text-gaming-accent bg-gaming-accent/5' 
                      : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 p-8 lg:p-12 pt-0">
          {!selectedGame ? (
            /* Game Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
              <AnimatePresence mode="popLayout">
                {filteredGames.map((game) => (
                  <motion.div
                    key={game.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/5 border border-white/10 group relative p-6 cursor-pointer flex flex-col h-full hover:border-gaming-accent hover:bg-gaming-accent/5 transition-all"
                    onClick={() => handlePlayGame(game)}
                  >
                    <div className="absolute top-0 right-0 p-3 text-[10px] font-mono text-white/20 uppercase">
                      ID: {game.id.substring(0, 6)}
                    </div>
                    
                    <div className="w-full h-48 mb-6 border border-white/10 group-hover:border-gaming-accent/30 overflow-hidden relative">
                      <img 
                        src={game.thumbnail} 
                        alt={game.title} 
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700 blur-[2px] group-hover:blur-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#080808] to-transparent opacity-60"></div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-12 h-12 border border-gaming-accent flex items-center justify-center text-gaming-accent">
                          <Play className="w-6 h-6 fill-current" />
                        </div>
                      </div>
                    </div>

                    <h3 className="display-font text-2xl mb-1 group-hover:text-gaming-accent transition-colors leading-tight">
                      {game.title}
                    </h3>
                    <p className="text-white/40 text-xs mb-6 font-light leading-relaxed flex-grow">
                      {game.description}
                    </p>
                    
                    <div className="flex justify-between items-center mt-auto">
                      <span className="px-2 py-1 bg-white/5 border border-white/10 text-[9px] uppercase font-bold tracking-widest text-white/60">
                        {game.category}
                      </span>
                      <button className="px-4 py-2 border border-gaming-accent text-gaming-accent text-[10px] uppercase font-bold tracking-widest hover:bg-gaming-accent hover:text-black transition-all">
                        Initialize
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredGames.length === 0 && (
                <div className="col-span-full py-20 border border-dashed border-white/10 flex flex-col items-center justify-center text-center opacity-40">
                  <span className="display-font text-4xl mb-4">No Manifest</span>
                  <p className="text-sm tracking-widest uppercase">Query returned zero results</p>
                </div>
              )}
            </div>
          ) : (
            /* Game Player View */
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-[calc(100vh-25rem)] lg:h-[calc(100vh-20rem)] flex flex-col gap-6"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={handleCloseGame}
                    className="flex items-center gap-2 text-white/40 hover:text-gaming-accent transition-colors text-[10px] font-bold uppercase tracking-widest"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back to Matrix
                  </button>
                  <div className="h-4 w-[1px] bg-white/10"></div>
                  <span className="text-[10px] font-mono text-gaming-accent uppercase">
                    Session: {selectedGame.title}
                  </span>
                </div>
                <div className="flex gap-4">
                   <button className="text-white/40 hover:text-white transition-colors"><Maximize2 className="w-4 h-4" /></button>
                   <button onClick={handleCloseGame} className="text-white/40 hover:text-red-500 transition-colors"><X className="w-4 h-4" /></button>
                </div>
              </div>

              <div className="flex-1 bg-black border border-white/10 relative group shadow-2xl">
                <iframe 
                  src={selectedGame.url} 
                  title={selectedGame.title}
                  className="w-full h-full border-none"
                  allowFullScreen
                  referrerPolicy="no-referrer"
                  id="game-iframe-v2"
                />
              </div>

              <div className="border border-white/10 bg-white/5 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                     <h2 className="display-font text-3xl">{selectedGame.title}</h2>
                     <span className="text-[10px] px-2 py-0.5 bg-gaming-accent/10 text-gaming-accent font-bold uppercase tracking-widest border border-gaming-accent/20">
                       {selectedGame.category}
                     </span>
                  </div>
                  <p className="text-white/40 text-sm max-w-2xl font-light italic">{selectedGame.description}</p>
                </div>
                <div className="flex gap-4">
                   <button className="px-6 py-2 border border-gaming-accent text-gaming-accent text-xs font-bold uppercase tracking-widest hover:bg-gaming-accent hover:text-black transition-all">
                     Save Progress
                   </button>
                   <button className="px-6 py-2 border border-white/20 text-white/60 text-xs font-bold uppercase tracking-widest hover:border-white hover:text-white transition-all">
                     Share CID
                   </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Footer inside main scroll */}
          {!selectedGame && (
            <footer className="mt-20 py-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-widest text-white/30 gap-6">
              <div className="flex gap-8 flex-wrap justify-center">
                <span className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-gaming-accent rounded-full animate-pulse"></div>
                  Database / 12 Segments
                </span>
                <span>Server / US-EAST-1</span>
                <span>Latency / 14ms</span>
              </div>
              <div className="font-mono">
                Pure Core / No AI Integrated / Nexus Hub
              </div>
            </footer>
          )}
        </div>
      </main>

      {/* Decorative Overlays */}
      <div className="fixed top-0 right-0 w-1/3 h-full bg-gradient-to-l from-gaming-accent/5 to-transparent pointer-events-none z-0"></div>
      <div className="fixed bottom-0 left-20 w-1/4 h-64 bg-purple-500/5 blur-[100px] pointer-events-none z-0"></div>
    </div>
  );
}
