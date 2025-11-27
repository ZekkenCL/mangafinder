import React from 'react';
import { motion } from 'framer-motion';
import { translations } from '../utils/translations';

const SourcesCard = ({ result, language }) => {
    const t = translations[language];

    if (!result) return null;

    const officialSearchLinks = [
        { name: 'MangaPlus', url: `https://mangaplus.shueisha.co.jp/search_result?keyword=${encodeURIComponent(result.titulo)}` },
        { name: 'Viz Media', url: `https://www.viz.com/search?search=${encodeURIComponent(result.titulo)}` },
        { name: 'BookWalker', url: `https://global.bookwalker.jp/search/?word=${encodeURIComponent(result.titulo)}` },
    ];

    const unofficialSources = [
        { name: 'ZonaTMO', url: 'https://zonatmo.com/library' },
        { name: 'MangaDex', url: `https://mangadex.org/search?q=${encodeURIComponent(result.titulo)}` },
        { name: 'Mangakatana', url: `https://mangakatana.com/?search=${encodeURIComponent(result.titulo)}&search_by=book_name` },
    ];

    const getFaviconUrl = (url) => {
        try {
            const domain = new URL(url).hostname;
            return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
        } catch (e) {
            return null;
        }
    };

    // Filter out Wikipedia from external links if you want to keep it strictly "reading/buying"
    // But "Official Site" is good to keep.
    const externalLinks = result.external_links ? result.external_links.filter(l => !l.name.toLowerCase().includes('wikipedia')) : [];
    const hasOfficial = officialSearchLinks.length > 0 || externalLinks.length > 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full max-w-4xl bg-white dark:bg-cyber-dark border border-gray-200 dark:border-cyber-gray rounded-2xl overflow-hidden shadow-lg mt-6 p-6 relative"
        >
            <div className="absolute top-0 left-0 w-1 h-full bg-cyber-primary"></div>

            <h3 className="text-cyber-primary text-xs font-mono mb-6 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-cyber-primary rounded-full"></span>
                {t.sources}
            </h3>

            {/* Official Sources */}
            {hasOfficial && (
                <div className="mb-8">
                    <h4 className="text-cyber-primary text-xs font-bold font-mono mb-3 uppercase tracking-wider drop-shadow-sm">{t.officialSources}</h4>
                    <div className="flex flex-wrap gap-3">
                        {/* Render Search Links first */}
                        {officialSearchLinks.map((source, index) => (
                            <a
                                key={`search-${index}`}
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-5 py-3 bg-gray-100 dark:bg-cyber-black border border-gray-200 dark:border-cyber-gray rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:border-cyber-primary hover:text-cyber-primary dark:hover:text-cyber-primary hover:bg-cyber-primary/10 transition-all flex items-center gap-2 group relative overflow-hidden shadow-sm hover:shadow-md hover:shadow-cyber-primary/20"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-cyber-primary/0 via-cyber-primary/5 to-cyber-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                <img
                                    src={getFaviconUrl(source.url)}
                                    alt=""
                                    className="w-4 h-4 rounded-sm z-10 relative"
                                    onError={(e) => e.target.style.display = 'none'}
                                />
                                <span className="z-10 relative">{source.name}</span>
                                <span className="text-xs opacity-50 group-hover:opacity-100 z-10 relative">↗</span>
                            </a>
                        ))}

                        {/* Render Fetched External Links */}
                        {externalLinks.map((link, index) => (
                            <a
                                key={`ext-${index}`}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-5 py-3 bg-gray-100 dark:bg-cyber-black border border-gray-200 dark:border-cyber-gray rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:border-cyber-primary hover:text-cyber-primary dark:hover:text-cyber-primary hover:bg-cyber-primary/10 transition-all flex items-center gap-2 group relative overflow-hidden shadow-sm hover:shadow-md hover:shadow-cyber-primary/20"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-cyber-primary/0 via-cyber-primary/5 to-cyber-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                <img
                                    src={getFaviconUrl(link.url)}
                                    alt=""
                                    className="w-4 h-4 rounded-sm z-10 relative"
                                    onError={(e) => e.target.style.display = 'none'}
                                />
                                <span className="z-10 relative">{link.name}</span>
                                <span className="text-xs opacity-50 group-hover:opacity-100 z-10 relative">↗</span>
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* Unofficial Sources */}
            <div>
                <h4 className="text-cyber-primary text-xs font-bold font-mono mb-3 uppercase tracking-wider drop-shadow-sm">{t.unofficialSources}</h4>
                <div className="flex flex-wrap gap-3">
                    {unofficialSources.map((source, index) => (
                        <a
                            key={index}
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-5 py-3 bg-gray-100 dark:bg-cyber-black border border-gray-200 dark:border-cyber-gray rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:border-cyber-secondary hover:text-cyber-secondary dark:hover:text-cyber-secondary hover:bg-cyber-secondary/10 transition-all flex items-center gap-2 group relative overflow-hidden shadow-sm hover:shadow-md hover:shadow-cyber-secondary/20"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-cyber-secondary/0 via-cyber-secondary/5 to-cyber-secondary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                            <img
                                src={getFaviconUrl(source.url)}
                                alt=""
                                className="w-4 h-4 rounded-sm z-10 relative"
                                onError={(e) => e.target.style.display = 'none'}
                            />
                            <span className="z-10 relative">{source.name}</span>
                            <span className="text-xs opacity-50 group-hover:opacity-100 z-10 relative">↗</span>
                        </a>
                    ))}
                </div>
            </div>        </motion.div>
    );
};

export default SourcesCard;
