import React from 'react';

const ProductSkeleton = () => {
    return (
        <div className="bg-[#121215] border border-zinc-900/80 rounded-xl overflow-hidden animate-pulse">
            {/* Image Skeleton */}
            <div className="relative aspect-square bg-zinc-900/60">
                <div className="absolute top-3 left-3 bg-zinc-800 w-16 h-4 rounded-sm" />
            </div>

            {/* Info Skeleton */}
            <div className="p-4 space-y-4 min-h-[168px] flex flex-col justify-between">
                <div className="space-y-2">
                    <div className="h-3 bg-zinc-800/80 rounded w-1/4" />
                    <div className="h-4 bg-zinc-800/80 rounded w-3/4" />
                </div>
                <div className="space-y-3 mt-auto">
                    <div className="h-6 bg-zinc-800/80 rounded w-1/3" />
                    <div className="h-9 bg-zinc-800/80 rounded-lg w-full" />
                </div>
            </div>
        </div>
    );
};

export default ProductSkeleton;
