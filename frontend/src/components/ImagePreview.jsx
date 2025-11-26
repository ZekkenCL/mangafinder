import React from 'react';
import { motion } from 'framer-motion';

const ImagePreview = ({ imageSrc, onSearch, onCrop, onCancel }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-2xl bg-cyber-black border border-cyber-primary/30 rounded-xl overflow-hidden flex flex-col shadow-[0_0_20px_rgba(0,243,255,0.1)]"
        >
            <div className="relative aspect-video bg-black/50 flex items-center justify-center overflow-hidden group">
                <img
                    src={imageSrc}
                    alt="Preview"
                    className="max-w-full max-h-[60vh] object-contain shadow-2xl"
                />

                {/* Overlay Grid Effect */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,243,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,243,255,0.05)_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none"></div>
            </div>

            <div className="p-6 bg-cyber-black border-t border-cyber-gray flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <button
                        onClick={onCancel}
                        className="px-6 py-2 rounded-full border border-red-500/50 text-red-400 font-mono text-sm hover:bg-red-500/10 transition-colors"
                    >
                        CANCEL
                    </button>

                    <div className="flex gap-4">
                        <button
                            onClick={onCrop}
                            className="px-6 py-2 rounded-full border border-cyber-primary text-cyber-primary font-mono text-sm hover:bg-cyber-primary/10 transition-colors"
                        >
                            CROP IMAGE
                        </button>
                        <button
                            onClick={onSearch}
                            className="px-8 py-2 rounded-full bg-cyber-primary text-black font-bold font-mono text-sm shadow-[0_0_15px_rgba(0,243,255,0.4)] hover:shadow-[0_0_25px_rgba(0,243,255,0.6)] hover:scale-105 transition-all"
                        >
                            SEARCH
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ImagePreview;
