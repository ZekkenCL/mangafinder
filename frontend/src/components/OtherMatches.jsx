import React from 'react';
import { motion } from 'framer-motion';
import { translations } from '../utils/translations';

const OtherMatches = ({ matches, language, onSelect }) => {
    const t = translations[language];

    if (!matches || matches.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full max-w-4xl mt-12 mb-8"
        >
            <div className="flex items-center gap-4 mb-6">
                <div className="h-px bg-gray-300 dark:bg-cyber-gray flex-grow"></div>
                <h3 className="text-gray-500 dark:text-gray-400 text-sm font-mono uppercase tracking-widest">
                    {t.notWhatYouLookingFor}
                </h3>
                <div className="h-px bg-gray-300 dark:bg-cyber-gray flex-grow"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {matches.map((match, index) => (
                    <div
                        key={index}
                        onClick={() => onSelect(match)}
                        className="bg-white dark:bg-cyber-dark border border-gray-200 dark:border-cyber-gray rounded-xl overflow-hidden hover:border-cyber-primary transition-all group cursor-pointer shadow-sm dark:shadow-none"
                    >
                        <div className="relative aspect-[2/3] overflow-hidden">
                            <img
                                src={match.portada_url || 'https://placehold.co/200x300/1e1e1e/FFF?text=No+Image'}
                                alt={match.titulo}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-xs font-mono text-cyber-primary border border-cyber-primary/30">
                                {match.similarity}%
                            </div>
                        </div>
                        <div className="p-3">
                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate group-hover:text-cyber-primary transition-colors">
                                {match.titulo}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default OtherMatches;
