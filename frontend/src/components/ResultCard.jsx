import React from 'react';
import { motion } from 'framer-motion';
import { translations } from '../utils/translations';

const ResultCard = ({ result, onReset, language, previewUrl }) => {
    const t = translations[language];
    const [selectedImage, setSelectedImage] = React.useState(null);

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
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-4xl bg-white dark:bg-cyber-dark border border-gray-200 dark:border-cyber-gray rounded-2xl overflow-hidden shadow-xl dark:shadow-[0_0_50px_rgba(0,0,0,0.5)] relative"
            >
                {/* Decorative Elements - Dark Mode Only */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-primary/10 rounded-full blur-3xl pointer-events-none hidden dark:block"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyber-secondary/10 rounded-full blur-3xl pointer-events-none hidden dark:block"></div>

                {/* Match Header - Compact Comparison */}
                {/* Match Header - Compact Comparison */}
                <div className="bg-gray-100/80 dark:bg-black/40 border-b border-gray-200 dark:border-cyber-gray p-4 pb-10 flex items-center justify-center relative backdrop-blur-sm">
                    <div className="flex items-center gap-6">
                        {previewUrl && (
                            <div
                                className="relative group cursor-pointer"
                                onClick={() => setSelectedImage(previewUrl)}
                            >
                                <div className="w-40 h-60 rounded-lg overflow-hidden border-2 border-cyber-gray shadow-lg group-hover:border-cyber-primary transition-colors">
                                    <img src={previewUrl} alt="Upload" className="w-full h-full object-cover" />
                                </div>
                                <div className="absolute -bottom-6 left-0 w-full text-center">
                                    <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest group-hover:text-cyber-primary transition-colors">UPLOAD</span>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col items-center gap-1">
                            <span className="text-xl font-black text-cyber-primary italic">VS</span>
                            <span className={`text-xs font-mono font-bold ${similarity_confidence > 80 ? 'text-green-400' : 'text-yellow-500'}`}>
                                {similarity_confidence}%
                            </span>
                        </div>

                        {result.match_image_url && (
                            <div
                                className="relative group cursor-pointer"
                                onClick={() => setSelectedImage(result.match_image_url)}
                            >
                                <div className="w-40 h-60 rounded-lg overflow-hidden border-2 border-cyber-primary shadow-[0_0_15px_rgba(0,243,255,0.3)] group-hover:shadow-[0_0_25px_rgba(0,243,255,0.5)] transition-shadow">
                                    <img src={result.match_image_url} alt="Match" className="w-full h-full object-cover" />
                                </div>
                                <div className="absolute -bottom-6 left-0 w-full text-center">
                                    <span className="text-[10px] text-cyber-primary uppercase tracking-widest">MATCH</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={onReset}
                        className="absolute right-4 top-1/2 -translate-y-1/2 px-6 py-2 bg-cyber-primary text-black font-bold text-xs font-mono tracking-widest uppercase rounded shadow-[0_0_10px_rgba(0,243,255,0.4)] hover:shadow-[0_0_20px_rgba(0,243,255,0.6)] hover:scale-105 transition-all duration-300 border border-transparent"
                    >
                        {t.searchAgain}
                    </button>
                </div>

                <div className="flex flex-col md:flex-row p-6 gap-8">
                    {/* Main Cover Image */}
                    <div className="w-full md:w-1/3 flex-shrink-0 relative group">
                        <div
                            className="relative rounded-xl overflow-hidden border-2 border-gray-200 dark:border-cyber-gray group-hover:border-cyber-primary transition-colors duration-300 shadow-2xl aspect-[2/3] cursor-pointer"
                            onClick={() => setSelectedImage(portada_url)}
                        >
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
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-2 tracking-tight leading-none">
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
                        <div className="bg-gray-50 dark:bg-cyber-black/50 rounded-xl p-6 border border-gray-200 dark:border-cyber-gray/50 flex-grow backdrop-blur-sm">
                            <h3 className="text-cyber-primary text-xs font-mono mb-2 uppercase tracking-widest">{t.synopsis}</h3>
                            <div className="text-gray-700 dark:text-gray-300 leading-relaxed max-h-64 overflow-y-auto pr-2 text-sm md:text-base scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-cyber-primary scrollbar-track-transparent dark:scrollbar-track-cyber-black">
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

            {/* Image Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative max-w-full max-h-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={selectedImage}
                            alt="Full view"
                            className="max-w-full max-h-[90vh] object-contain rounded-lg border border-cyber-primary shadow-[0_0_30px_rgba(0,243,255,0.2)]"
                        />
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute -top-4 -right-4 w-8 h-8 bg-cyber-black border border-cyber-primary rounded-full flex items-center justify-center text-cyber-primary hover:bg-cyber-primary hover:text-black transition-colors"
                        >
                            ✕
                        </button>
                    </motion.div>
                </div>
            )}
        </>
    );
};

export default ResultCard;
