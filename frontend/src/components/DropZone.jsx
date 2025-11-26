import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { translations } from '../utils/translations';

const DropZone = ({ onFileSelected, isLoading, language }) => {
    const t = translations[language];

    const onDrop = useCallback(acceptedFiles => {
        if (acceptedFiles?.length > 0) {
            onFileSelected(acceptedFiles[0]);
        }
    }, [onFileSelected]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.webp']
        },
        multiple: false,
        disabled: isLoading
    });

    return (
        <motion.div
            {...getRootProps()}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`
        relative overflow-hidden rounded-2xl border-2 border-dashed 
        flex flex-col items-center justify-center p-10 cursor-pointer transition-all duration-300
        h-64 w-full max-w-2xl mx-auto
        ${isDragActive
                    ? 'border-cyber-primary bg-cyber-primary/10 shadow-neon-blue'
                    : 'border-gray-300 dark:border-cyber-gray hover:border-cyber-primary/50 hover:bg-gray-50 dark:hover:bg-cyber-gray/30'}
        ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
      `}
        >
            <input {...getInputProps()} />

            <div className="z-10 text-center">
                {isLoading ? (
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-cyber-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-cyber-primary font-mono animate-pulse">{t.scanning}</p>
                    </div>
                ) : (
                    <>
                        <div className="mb-4 text-4xl">📂</div>
                        {isDragActive ? (
                            <p className="text-cyber-primary font-bold text-lg">{t.dropActive}</p>
                        ) : (
                            <div className="space-y-2">
                                <p className="text-xl font-bold text-gray-900 dark:text-white">{t.uploadTitle}</p>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">{t.uploadSubtitle}</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Grid Background Effect */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}>
            </div>
        </motion.div>
    );
};

export default DropZone;
