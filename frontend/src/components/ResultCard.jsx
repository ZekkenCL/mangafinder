import React from 'react';
import { motion } from 'framer-motion';
import { translations } from '../utils/translations';

const ResultCard = ({ result, onReset, language, previewUrl }) => {
    const t = translations[language];
    const {
        titulo,
        sinopsis,
        portada_url,
        capitulo_estimado,
        pagina_estimada,
        similarity_confidence,
        warning
    } = result;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl bg-cyber-dark border border-cyber-gray rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] relative"
        >
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-primary/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyber-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Match Header - Compact Comparison */}
            <div className="bg-black/40 border-b border-cyber-gray p-4 flex items-center justify-between backdrop-blur-sm">
                <div className="flex items-center gap-4">
                    {previewUrl && (
                        <div className="flex items-center gap-2">
                            <div className="w-12 h-12 rounded-lg overflow-hidden border border-cyber-gray">
                                <img src={previewUrl} alt="Upload" className="w-full h-full object-cover" />
                            </div>
                            <span className="text-xs text-gray-500 font-mono">VS</span>
                        </div>
                    )}
                    <div className="flex flex-col">
                        <span className={`text-2xl font-black font-mono ${similarity_confidence > 80 ? 'text-cyber-primary' : 'text-yellow-500'}`}>
                            {similarity_confidence}%
                        </span>
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest">{t.match}</span>
                    </div>
                </div>

                <button
                    onClick={onReset}
                    className="px-4 py-2 bg-cyber-black border border-cyber-gray hover:border-cyber-primary text-gray-300 hover:text-white text-xs font-mono tracking-widest transition-all rounded hover:shadow-[0_0_10px_rgba(0,243,255,0.2)]"
                >
                    {t.searchAgain}
                </button>
            </div>

            <div className="flex flex-col md:flex-row p-6 gap-8">
                {/* Main Cover Image */}
                <div className="w-full md:w-1/3 flex-shrink-0 relative group">
                    <div className="relative rounded-xl overflow-hidden border-2 border-cyber-gray group-hover:border-cyber-primary transition-colors duration-300 shadow-2xl aspect-[2/3]">
                        <img
                            src={portada_url || 'https://placehold.co/400x600/1e1e1e/FFF?text=No+Cover'}
                            alt={titulo}
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-cyber-black via-transparent to-transparent opacity-60"></div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-grow flex flex-col relative z-10">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight leading-none">
                        {titulo || t.unknownTitle}
                    </h2>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {capitulo_estimado && (
                            <span className="px-3 py-1 bg-cyber-secondary/20 border border-cyber-secondary text-cyber-secondary text-xs font-mono font-bold rounded">
                                {capitulo_estimado}
                            </span>
                        )}
                        {pagina_estimada && (
                            <span className="px-3 py-1 bg-cyber-accent/20 border border-cyber-accent text-cyber-accent text-xs font-mono font-bold rounded">
                                {t.page} {pagina_estimada}
                            </span>
                        )}
                    </div>

                    {/* Synopsis */}
                    <div className="bg-cyber-black/50 rounded-xl p-6 border border-cyber-gray/50 flex-grow backdrop-blur-sm">
                        <h3 className="text-cyber-primary text-xs font-mono mb-2 uppercase tracking-widest">{t.synopsis}</h3>
                        <div className="text-gray-300 leading-relaxed max-h-64 overflow-y-auto pr-2 text-sm md:text-base scrollbar-thin scrollbar-thumb-cyber-primary scrollbar-track-cyber-black">
                            {language === 'es' ? (result.sinopsis_es || sinopsis || t.noSynopsis) : (result.sinopsis_en || sinopsis || t.noSynopsis)}
                        </div>
                    </div>

                    {warning && (
                        <div className="mt-4 px-4 py-2 bg-yellow-500/10 border border-yellow-500/50 text-yellow-200 text-xs font-mono rounded flex items-center gap-2">
                            <span>⚠️</span> {warning}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default ResultCard;
