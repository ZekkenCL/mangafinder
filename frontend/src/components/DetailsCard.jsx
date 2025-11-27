import React from 'react';
import { motion } from 'framer-motion';
import { translations } from '../utils/translations';

const DetailsCard = ({ result, language }) => {
    const t = translations[language];

    if (!result) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="w-full max-w-4xl bg-white dark:bg-cyber-dark border border-gray-200 dark:border-cyber-gray rounded-2xl overflow-hidden shadow-lg mt-6 p-6 relative"
        >
            <div className="absolute top-0 left-0 w-1 h-full bg-cyber-primary"></div>

            <h3 className="text-cyber-primary text-xs font-mono mb-6 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-cyber-primary rounded-full"></span>
                {t.details}
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                <div className="flex flex-col items-center justify-center text-center p-4 bg-gray-50 dark:bg-cyber-black/50 rounded-xl border border-gray-200 dark:border-cyber-gray/50 hover:border-cyber-primary/50 hover:bg-cyber-primary/5 transition-all duration-300 group relative overflow-hidden shadow-sm hover:shadow-cyber-primary/20">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyber-primary/0 to-cyber-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <h3 className="text-cyber-primary text-xs font-bold font-mono mb-2 uppercase tracking-widest z-10 relative drop-shadow-sm">{t.chapters}</h3>
                    <span className="text-gray-900 dark:text-white font-bold font-mono text-3xl z-10 relative group-hover:text-cyber-primary transition-colors drop-shadow-sm">
                        {result.chapters || '?'}
                    </span>
                </div>
                <div className="flex flex-col items-center justify-center text-center p-4 bg-gray-50 dark:bg-cyber-black/50 rounded-xl border border-gray-200 dark:border-cyber-gray/50 hover:border-cyber-primary/50 hover:bg-cyber-primary/5 transition-all duration-300 group relative overflow-hidden shadow-sm hover:shadow-cyber-primary/20">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyber-primary/0 to-cyber-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <h3 className="text-cyber-primary text-xs font-bold font-mono mb-2 uppercase tracking-widest z-10 relative drop-shadow-sm">{t.status}</h3>
                    <span className="text-gray-900 dark:text-white font-bold font-mono text-xl z-10 relative group-hover:text-cyber-primary transition-colors drop-shadow-sm">
                        {result.status === "Publishing" ? t.statusPublishing :
                            result.status === "Finished" ? t.statusFinished :
                                result.status === "On Hiatus" ? t.statusOnHiatus :
                                    result.status === "Discontinued" ? t.statusDiscontinued :
                                        result.status === "Not yet aired" ? t.statusNotYetAired :
                                            result.status || '?'}
                    </span>
                </div>
                <div className="flex flex-col items-center justify-center text-center p-4 bg-gray-50 dark:bg-cyber-black/50 rounded-xl border border-gray-200 dark:border-cyber-gray/50 hover:border-cyber-primary/50 hover:bg-cyber-primary/5 transition-all duration-300 group relative overflow-hidden shadow-sm hover:shadow-cyber-primary/20">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyber-primary/0 to-cyber-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <h3 className="text-cyber-primary text-xs font-bold font-mono mb-2 uppercase tracking-widest z-10 relative drop-shadow-sm">{t.published}</h3>
                    <span className="text-gray-900 dark:text-white font-bold font-mono text-sm z-10 relative group-hover:text-cyber-primary transition-colors drop-shadow-sm">
                        {result.published || '?'}
                    </span>
                </div>
                <div className="flex flex-col items-center justify-center text-center p-4 bg-gray-50 dark:bg-cyber-black/50 rounded-xl border border-gray-200 dark:border-cyber-gray/50 hover:border-cyber-primary/50 hover:bg-cyber-primary/5 transition-all duration-300 group relative overflow-hidden shadow-sm hover:shadow-cyber-primary/20">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyber-primary/0 to-cyber-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <h3 className="text-cyber-primary text-xs font-bold font-mono mb-2 uppercase tracking-widest z-10 relative drop-shadow-sm">{t.score}</h3>
                    <span className="text-gray-900 dark:text-white font-bold font-mono text-3xl z-10 relative group-hover:text-cyber-primary transition-colors drop-shadow-sm">
                        {result.score || '?'}
                    </span>
                </div>
            </div>

            {/* Relations Section */}
            {result.related_manga && result.related_manga.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-cyber-gray/30">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                        {result.related_manga.map((manga, index) => (
                            <div key={index} className="bg-gray-50 dark:bg-cyber-black/50 rounded-xl p-4 border border-gray-200 dark:border-cyber-gray/50 backdrop-blur-sm flex flex-col items-center justify-center text-center hover:border-cyber-primary/50 hover:bg-cyber-primary/5 transition-all duration-300 group relative overflow-hidden shadow-sm hover:shadow-cyber-primary/20">
                                <div className="absolute inset-0 bg-gradient-to-br from-cyber-primary/0 to-cyber-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <h3 className="text-cyber-primary text-[10px] font-mono mb-1 uppercase tracking-widest z-10 relative">
                                    {manga.relation_type === 'Prequel' ? t.prequel :
                                        manga.relation_type === 'Sequel' ? t.sequel :
                                            manga.relation_type === 'Spin-Off' ? t.spinOff :
                                                manga.relation_type === 'Side Story' ? t.sideStory :
                                                    manga.relation_type === 'Parent Story' ? t.parentStory :
                                                        manga.relation_type === 'Alternative Setting' ? t.alternativeSetting :
                                                            manga.relation_type === 'Alternative Version' ? t.alternativeVersion :
                                                                manga.relation_type}
                                </h3>
                                <a
                                    href={manga.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-900 dark:text-white font-bold font-mono text-sm hover:text-cyber-primary transition-colors w-full break-words z-10 relative"
                                >
                                    {manga.title}
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default DetailsCard;
