import React from 'react';
import { motion } from 'framer-motion';
import { translations } from '../utils/translations';

const AuthorCard = ({ authors, language }) => {
    const t = translations[language];

    if (!authors || authors.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-4xl bg-white dark:bg-cyber-dark border border-gray-200 dark:border-cyber-gray rounded-2xl overflow-hidden shadow-lg mt-6 p-6 relative"
        >
            <div className="absolute top-0 left-0 w-1 h-full bg-cyber-secondary"></div>

            <h3 className="text-cyber-secondary text-xs font-mono mb-4 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-cyber-secondary rounded-full"></span>
                {t.author}
            </h3>

            <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                {authors.map((author, index) => (
                    <a
                        key={author.mal_id || index}
                        href={author.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex flex-col md:flex-row items-center gap-6 bg-gray-50 dark:bg-cyber-black/50 px-8 py-6 rounded-2xl border border-gray-200 dark:border-cyber-gray hover:border-cyber-secondary transition-all duration-300 hover:bg-gray-100 dark:hover:bg-cyber-gray/10 min-w-[300px]"
                    >
                        <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gray-200 dark:bg-cyber-gray flex items-center justify-center overflow-hidden border-2 border-gray-300 dark:border-cyber-gray group-hover:border-cyber-secondary transition-colors shadow-lg dark:shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_20px_rgba(255,0,85,0.3)]">
                            {author.image_url ? (
                                <img src={author.image_url} alt={author.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-4xl">✒️</span>
                            )}
                        </div>
                        <div className="text-center md:text-left">
                            <span className="block text-2xl md:text-3xl font-black text-gray-900 dark:text-white group-hover:text-cyber-secondary transition-colors tracking-tight">
                                {author.name}
                            </span>
                            <span className="text-cyber-primary font-mono text-xs tracking-[0.2em] mt-2 block uppercase">
                                Mangaka
                            </span>
                        </div>
                    </a>
                ))}
            </div>
        </motion.div>
    );
};

export default AuthorCard;
