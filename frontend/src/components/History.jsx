import React from 'react';
import { motion } from 'framer-motion';
import { translations } from '../utils/translations';

const History = ({ history, onSelect, language }) => {
    const t = translations[language];

    if (!history || history.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl mt-12"
        >
            <div className="flex items-center gap-4 mb-6">
                <div className="h-px bg-gray-300 dark:bg-cyber-gray flex-grow"></div>
                <h3 className="text-gray-500 dark:text-gray-400 text-sm font-mono uppercase tracking-widest">
                    RECENT SEARCHES
                </h3>
                <div className="h-px bg-gray-300 dark:bg-cyber-gray flex-grow"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {history.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => onSelect(item)}
                        className="bg-white dark:bg-cyber-dark border border-gray-200 dark:border-cyber-gray rounded-xl overflow-hidden hover:border-cyber-primary transition-all group cursor-pointer relative aspect-[2/3] shadow-sm dark:shadow-none"
                    >
                        <img
                            src={item.portada_url || 'https://placehold.co/200x300/1e1e1e/FFF?text=No+Image'}
                            alt={item.titulo}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                            <p className="text-xs font-bold text-white truncate">
                                {item.titulo}
                            </p>
                            <p className="text-[10px] text-cyber-primary font-mono">
                                {new Date(item.timestamp).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default History;
