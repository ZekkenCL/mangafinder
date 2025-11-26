import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { motion } from 'framer-motion';

const ImageCropper = ({ imageSrc, onCropComplete, onCancel }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropChange = (crop) => {
        setCrop(crop);
    };

    const onZoomChange = (zoom) => {
        setZoom(zoom);
    };

    const onCropAreaChange = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const createImage = (url) =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener('load', () => resolve(image));
            image.addEventListener('error', (error) => reject(error));
            image.setAttribute('crossOrigin', 'anonymous');
            image.src = url;
        });

    const getCroppedImg = async (imageSrc, pixelCrop) => {
        const image = await createImage(imageSrc);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
        );

        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    reject(new Error('Canvas is empty'));
                    return;
                }
                blob.name = 'cropped.jpeg';
                resolve(blob);
            }, 'image/jpeg');
        });
    };

    const handleCrop = async () => {
        try {
            const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
            onCropComplete(croppedImage);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-full max-w-4xl h-[80vh] bg-cyber-black border border-cyber-primary/30 rounded-xl overflow-hidden flex flex-col"
            >
                <div className="relative flex-1 bg-black/50">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={undefined} // Free aspect ratio
                        onCropChange={onCropChange}
                        onCropComplete={onCropAreaChange}
                        onZoomChange={onZoomChange}
                        classes={{
                            containerClassName: "bg-transparent",
                            mediaClassName: "",
                            cropAreaClassName: "border-2 border-cyber-primary shadow-[0_0_15px_rgba(0,243,255,0.3)]"
                        }}
                    />
                </div>

                <div className="p-6 bg-cyber-black border-t border-cyber-gray flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-cyber-primary font-mono">ZOOM</span>
                        <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            aria-labelledby="Zoom"
                            onChange={(e) => setZoom(e.target.value)}
                            className="w-full h-1 bg-cyber-gray rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-cyber-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_10px_#00f3ff]"
                        />
                    </div>

                    <div className="flex justify-end gap-4">
                        <button
                            onClick={onCancel}
                            className="px-6 py-2 rounded-full border border-red-500/50 text-red-400 font-mono text-sm hover:bg-red-500/10 transition-colors"
                        >
                            CANCEL
                        </button>
                        <button
                            onClick={handleCrop}
                            className="px-8 py-2 rounded-full bg-cyber-primary text-black font-bold font-mono text-sm shadow-[0_0_15px_rgba(0,243,255,0.4)] hover:shadow-[0_0_25px_rgba(0,243,255,0.6)] hover:scale-105 transition-all"
                        >
                            SEARCH THIS AREA
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ImageCropper;
