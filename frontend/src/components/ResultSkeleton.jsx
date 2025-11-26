import React from 'react';
import Skeleton from './Skeleton';

const ResultSkeleton = () => {
    return (
        <div className="w-full max-w-4xl bg-cyber-dark border border-cyber-gray rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] relative">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-primary/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyber-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Match Header Skeleton */}
            <div className="bg-black/40 border-b border-cyber-gray p-4 pb-10 flex items-center justify-center relative backdrop-blur-sm">
                <div className="flex items-center gap-6">
                    {/* Upload Preview Skeleton */}
                    <div className="w-24 h-36 rounded-lg overflow-hidden border-2 border-cyber-gray/50">
                        <Skeleton className="w-full h-full" />
                    </div>

                    <div className="flex flex-col items-center gap-1">
                        <span className="text-xl font-black text-cyber-gray italic">VS</span>
                        <Skeleton className="w-8 h-4" />
                    </div>

                    {/* Match Preview Skeleton */}
                    <div className="w-24 h-36 rounded-lg overflow-hidden border-2 border-cyber-gray/50">
                        <Skeleton className="w-full h-full" />
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row p-6 gap-8">
                {/* Main Cover Image Skeleton */}
                <div className="w-full md:w-1/3 flex-shrink-0 relative">
                    <div className="relative rounded-xl overflow-hidden border-2 border-cyber-gray/50 aspect-[2/3]">
                        <Skeleton className="w-full h-full" />
                    </div>
                </div>

                {/* Content Skeleton */}
                <div className="flex-grow flex flex-col relative z-10">
                    {/* Title Skeleton */}
                    <Skeleton className="h-12 w-3/4 mb-4" />

                    {/* Badges Skeleton */}
                    <div className="flex gap-2 mb-6">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-6 w-24" />
                    </div>

                    {/* Synopsis Skeleton */}
                    <div className="bg-cyber-black/50 rounded-xl p-6 border border-cyber-gray/50 flex-grow backdrop-blur-sm">
                        <Skeleton className="h-4 w-24 mb-4" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-4/5" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultSkeleton;
