import React, { useState, useEffect } from 'react';
import DropZone from './components/DropZone';
import ResultCard from './components/ResultCard';
import AuthorCard from './components/AuthorCard';
import RelatedWorksCard from './components/RelatedWorksCard';
import SourcesCard from './components/SourcesCard';
import OtherMatches from './components/OtherMatches';
import History from './components/History';
import ImageCropper from './components/ImageCropper';
import ImagePreview from './components/ImagePreview';
import ResultSkeleton from './components/ResultSkeleton';
import ConfirmationModal from './components/ConfirmationModal';
import { translations } from './utils/translations';
import { useSearchManga, useMangaDetails } from './hooks/useMangaSearch';
import ThemeToggle from './components/ThemeToggle';

function App() {
  const [result, setResult] = useState(null);
  const [language, setLanguage] = useState('en');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [nsfw, setNsfw] = useState(false);
  const [history, setHistory] = useState([]);

  // Cropper State
  const [selectedFile, setSelectedFile] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [cropperImageSrc, setCropperImageSrc] = useState(null);

  // Confirmation Modal State
  const [showConfirmation, setShowConfirmation] = useState(false);

  const searchMutation = useSearchManga();
  const detailsMutation = useMangaDetails();

  useEffect(() => {
    const savedHistory = localStorage.getItem('manga_history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const addToHistory = (item) => {
    const newItem = { ...item, timestamp: Date.now() };
    setHistory(prev => {
      const filtered = prev.filter(h => h.titulo !== item.titulo);
      const newHistory = [newItem, ...filtered].slice(0, 5);
      localStorage.setItem('manga_history', JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('manga_history');
  };

  const removeFromHistory = (itemToRemove) => {
    setHistory(prev => {
      const newHistory = prev.filter(item => item.titulo !== itemToRemove.titulo);
      localStorage.setItem('manga_history', JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const t = translations[language];

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'es' : 'en');
  };

  const toggleNsfw = () => {
    if (!nsfw) {
      // If currently off, ask for confirmation to turn on
      setShowConfirmation(true);
    } else {
      // If currently on, just turn off
      setNsfw(false);
    }
  };

  const confirmNsfw = () => {
    setNsfw(true);
    setShowConfirmation(false);
  };

  const onFileSelected = (file) => {
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setCropperImageSrc(objectUrl);
    // Don't show cropper automatically anymore
    // setShowCropper(true);
  };

  const handleSearch = () => {
    if (!selectedFile) return;

    setResult(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('lang', language);
    formData.append('include_nsfw', nsfw);

    searchMutation.mutate(formData, {
      onSuccess: (data) => {
        if (!data.found) {
          setResult(null);
        } else {
          setResult(data);
          addToHistory(data);
        }
      },
      onError: (error) => {
        console.error(error);
      }
    });
  };

  const handleManualCrop = () => {
    setShowCropper(true);
  };

  const handleCancelSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setCropperImageSrc(null);
    setResult(null);
  };

  const handleCropComplete = async (croppedBlob) => {
    setShowCropper(false);

    // Create a new File object from the blob
    const file = new File([croppedBlob], "cropped.jpg", { type: "image/jpeg" });

    // Set preview for the result
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setSelectedFile(file); // Update selected file with cropped version

    setResult(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('lang', language);
    formData.append('include_nsfw', nsfw);

    searchMutation.mutate(formData, {
      onSuccess: (data) => {
        if (!data.found) {
          setResult(null);
        } else {
          setResult(data);
          addToHistory(data);
        }
      },
      onError: (error) => {
        console.error(error);
      }
    });
  };

  const handleCancelCrop = () => {
    setShowCropper(false);
    // Don't clear selection on cancel crop, just close modal
  };

  const handleReset = () => {
    setResult(null);
    setPreviewUrl(null);
    setSelectedFile(null);
    setCropperImageSrc(null);
    searchMutation.reset();
  };

  const handleSelectMatch = (match) => {
    const formData = new FormData();
    formData.append('title', match.titulo);

    detailsMutation.mutate(formData, {
      onSuccess: (data) => {
        setResult(prev => ({
          ...(prev || {}),
          ...data,
          otras_coincidencias: prev?.otras_coincidencias || data.otras_coincidencias,
          match_image_url: match.portada_url
        }));
        addToHistory({ ...data, portada_url: match.portada_url });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  };

  const isLoading = searchMutation.isPending || detailsMutation.isPending;
  const error = searchMutation.error || detailsMutation.error;
  const errorMessage = error ? t.error : (result && !result.found ? (result.message || t.warning) : null);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-cyber-black text-gray-900 dark:text-white font-sans selection:bg-cyber-secondary selection:text-white overflow-x-hidden relative transition-colors duration-300">
      {/* Background Grid Animation - Dark Mode Only */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] hidden dark:block"></div>

      {/* Ambient Glow - Dark Mode Only */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-cyber-primary/10 blur-[100px] rounded-full pointer-events-none z-0 hidden dark:block"></div>

      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={confirmNsfw}
        title="Content Warning"
        message="This action enables R18+ content. Are you sure you want to proceed? You must be 18 years or older."
      />

      {showCropper && cropperImageSrc && (
        <ImageCropper
          imageSrc={cropperImageSrc}
          onCropComplete={handleCropComplete}
          onCancel={handleCancelCrop}
        />
      )}

      <div className="relative z-10 container mx-auto px-4 py-8 flex flex-col items-center min-h-screen">
        {/* Header */}
        <header className="w-full flex justify-between items-center mb-12 md:mb-20">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-cyber-primary rounded-full animate-pulse shadow-[0_0_10px_#00f3ff]"></div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tighter italic pr-4">
              <span className="text-gray-900 dark:text-white drop-shadow-[0_0_10px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">{t.title}</span>
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
              className="relative w-16 h-8 bg-gray-200 dark:bg-cyber-black border border-gray-300 dark:border-cyber-gray rounded-full overflow-hidden group hover:border-cyber-primary transition-colors duration-300"
            >
              <div className={`absolute top-0 bottom-0 w-1/2 bg-cyber-primary/20 transition-transform duration-300 ${language === 'es' ? 'translate-x-full' : 'translate-x-0'}`}></div>
              <div className="absolute inset-0 flex items-center justify-between px-2 text-[10px] font-bold font-mono">
                <span className={`z-10 transition-colors duration-300 ${language === 'en' ? 'text-cyber-primary' : 'text-gray-500'}`}>EN</span>
                <span className={`z-10 transition-colors duration-300 ${language === 'es' ? 'text-cyber-primary' : 'text-gray-500'}`}>ES</span>
              </div>
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </header>

        <main className="w-full flex flex-col items-center pb-20">
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-500 text-red-200 rounded-lg w-full max-w-2xl text-center">
              {errorMessage}
            </div>
          )}

          {isLoading ? (
            <ResultSkeleton />
          ) : !result ? (
            selectedFile && !showCropper ? (
              <ImagePreview
                imageSrc={previewUrl}
                onSearch={handleSearch}
                onCrop={handleManualCrop}
                onCancel={handleCancelSelection}
              />
            ) : (
              <>
                <DropZone onFileSelected={onFileSelected} isLoading={isLoading} language={language} />
                <History
                  history={history}
                  onSelect={handleSelectMatch}
                  language={language}
                  onClear={clearHistory}
                  onRemove={removeFromHistory}
                />
              </>
            )
          ) : (
            <>
              <ResultCard result={result} onReset={handleReset} language={language} previewUrl={previewUrl} />
              {/* ... rest of result view */}


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

              <SourcesCard result={result} language={language} />

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
