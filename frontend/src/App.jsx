import React, { useState } from 'react';
import axios from 'axios';
import DropZone from './components/DropZone';
import ResultCard from './components/ResultCard';
import AuthorCard from './components/AuthorCard';
import RelatedWorksCard from './components/RelatedWorksCard';
import OtherMatches from './components/OtherMatches';
import { translations } from './utils/translations';

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('en');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [nsfw, setNsfw] = useState(false);

  const t = translations[language];

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'es' : 'en');
  };

  const toggleNsfw = () => {
    setNsfw(prev => !prev);
  };

  const handleFileSelect = async (file) => {
    setLoading(true);
    setError(null);
    setResult(null);

    // Create preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('lang', language);
    formData.append('include_nsfw', nsfw);

    try {
      // Assuming backend is running on localhost:8000
      const response = await axios.post('http://localhost:8000/search', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log("DEBUG: Backend Response Data:", response.data);
      console.log("DEBUG: match_image_url:", response.data.match_image_url);
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setPreviewUrl(null);
  };

  const handleSelectMatch = async (match) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('title', match.titulo);

      const response = await axios.post('http://localhost:8000/details', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Merge the new details with the existing result, but keep the original alternatives
      setResult(prev => ({
        ...prev,
        ...response.data,
        // Preserve the original list of matches, but maybe highlight the selected one?
        // For now, just keeping them is enough.
        otras_coincidencias: prev.otras_coincidencias,
        // Update the match image url to the selected one's cover if available, 
        // or keep the original if it's a specific panel match.
        // Actually, for a general title match, we probably want to show the cover.
        match_image_url: match.portada_url
      }));

      // Scroll to top to see the new result
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (err) {
      console.error(err);
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-black text-white font-sans selection:bg-cyber-secondary selection:text-white overflow-x-hidden relative">
      {/* Background Grid Animation */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      {/* Ambient Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-cyber-primary/10 blur-[100px] rounded-full pointer-events-none z-0"></div>

      <div className="relative z-10 container mx-auto px-4 py-8 flex flex-col items-center min-h-screen">
        {/* Header */}
        <header className="w-full flex justify-between items-center mb-12 md:mb-20">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-cyber-primary rounded-full animate-pulse shadow-[0_0_10px_#00f3ff]"></div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tighter italic pr-4">
              <span className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">{t.title}</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-primary to-cyber-secondary ml-1 pr-2">
                {t.subtitle}
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* NSFW Toggle */}
            <button
              onClick={toggleNsfw}
              className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-all duration-300 ${nsfw
                ? 'bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                : 'bg-cyber-black border-cyber-gray text-gray-400 hover:border-cyber-primary hover:text-cyber-primary'
                }`}
            >
              <span className="text-[10px] font-mono font-bold tracking-widest">
                {nsfw ? 'R18 ON' : 'R18 OFF'}
              </span>
            </button>

            {/* Language Switch */}
            <button
              onClick={toggleLanguage}
              className="relative w-16 h-8 bg-cyber-black border border-cyber-gray rounded-full overflow-hidden group hover:border-cyber-primary transition-colors duration-300"
            >
              <div className={`absolute top-0 bottom-0 w-1/2 bg-cyber-primary/20 transition-transform duration-300 ${language === 'es' ? 'translate-x-full' : 'translate-x-0'}`}></div>
              <div className="absolute inset-0 flex items-center justify-between px-2 text-[10px] font-bold font-mono">
                <span className={`z-10 transition-colors duration-300 ${language === 'en' ? 'text-cyber-primary' : 'text-gray-500'}`}>EN</span>
                <span className={`z-10 transition-colors duration-300 ${language === 'es' ? 'text-cyber-primary' : 'text-gray-500'}`}>ES</span>
              </div>
            </button>
          </div>
        </header>

        <main className="w-full flex flex-col items-center pb-20">
          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-500 text-red-200 rounded-lg w-full max-w-2xl text-center">
              {error}
            </div>
          )}

          {!result ? (
            <DropZone onFileSelected={handleFileSelect} isLoading={loading} language={language} />
          ) : (
            <>
              <ResultCard result={result} onReset={handleReset} language={language} previewUrl={previewUrl} />

              {result.autores && (
                <AuthorCard authors={result.autores} language={language} />
              )}

              {result.otras_obras && result.autores && result.autores.length > 0 && (
                <RelatedWorksCard
                  works={result.otras_obras}
                  authorName={result.autores[0].name}
                  language={language}
                />
              )}

              {result.otras_coincidencias && (
                <OtherMatches
                  matches={result.otras_coincidencias}
                  language={language}
                  onSelect={handleSelectMatch}
                />
              )}
            </>
          )}
        </main>

        <footer className="mt-16 text-gray-600 text-sm font-mono">
          {t.footer}
        </footer>
      </div>
    </div>
  );
}

export default App;
