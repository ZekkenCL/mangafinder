import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-cyber-dark border border-cyber-secondary/50 rounded-xl p-6 max-w-sm w-full shadow-[0_0_30px_rgba(255,0,85,0.2)] relative overflow-hidden"
                >
                    {/* Decorative elements */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-secondary to-transparent"></div>

                    <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                        <span className="text-cyber-secondary">⚠️</span>
                        {title}
                    </h3>

                    <p className="text-gray-300 mb-6 text-sm leading-relaxed">
                        {message}
                    </p>

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 rounded-lg text-sm font-bold bg-cyber-secondary/20 text-cyber-secondary border border-cyber-secondary/50 hover:bg-cyber-secondary hover:text-white transition-all duration-300 shadow-[0_0_10px_rgba(255,0,85,0.2)] hover:shadow-[0_0_20px_rgba(255,0,85,0.4)]"
                        >
                            Confirm
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ConfirmationModal;
