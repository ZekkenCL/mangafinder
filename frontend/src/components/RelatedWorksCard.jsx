import React from 'react';
import { motion } from 'framer-motion';
import { translations } from '../utils/translations';

const RelatedWorksCard = ({ works, authorName, language }) => {
    const t = translations[language];

    if (!works || works.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full max-w-4xl bg-cyber-dark border border-cyber-gray rounded-2xl overflow-hidden shadow-lg mt-6 p-6 relative"
        >
            <div className="absolute top-0 right-0 w-1 h-full bg-cyber-accent"></div>

            <h3 className="text-cyber-accent text-xs font-mono mb-4 uppercase tracking-widest flex items-center gap-2 justify-end">
                {t.moreBy} {authorName}
                <span className="w-2 h-2 bg-cyber-accent rounded-full"></span>
            </h3>

            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-cyber-accent scrollbar-track-cyber-black">
                {works.map((work, index) => (
                    <a
                        key={index}
                        href={work.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 w-32 group"
                    >
                        <div className="relative overflow-hidden rounded-lg aspect-[2/3] mb-2 border border-cyber-gray group-hover:border-cyber-accent transition-all">
                            <img
                                src={work.image_url || 'https://placehold.co/200x300/1e1e1e/FFF?text=No+Image'}
                                alt={work.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                                <span className="text-xs text-cyber-accent font-mono">VIEW</span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 font-medium truncate group-hover:text-white transition-colors">
                            {work.title}
                        </p>
                    </a>
                ))}
            </div>
        </motion.div>
    );
};

export default RelatedWorksCard;
