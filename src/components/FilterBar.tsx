import { Category } from '@/types/product';
import React from 'react';
import { motion } from 'framer-motion';

interface FilterBarProps {
    categories: Category[];
    activeCategory: Category | 'All';
    onCategoryChange: (category: Category | 'All') => void;
}

const FilterBar = ({ categories, activeCategory, onCategoryChange }: FilterBarProps) => {
    return (
        <div className="relative z-30 px-4 py-8 md:py-10 flex justify-center">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-zinc-900/60 backdrop-blur-md p-2 rounded-lg border border-zinc-800/80 flex flex-wrap justify-center gap-2 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
            >
                <button
                    onClick={() => onCategoryChange('All')}
                    className={`px-5 py-2.5 rounded-md text-[10px] font-mono uppercase tracking-[0.15em] transition-all duration-300 border ${activeCategory === 'All'
                        ? 'bg-[#C5FF30] text-black border-[#C5FF30] font-black shadow-[0_0_15px_rgba(197,255,48,0.25)]'
                        : 'bg-zinc-900/40 text-zinc-400 border-zinc-800/60 hover:border-zinc-700 hover:text-white'
                        }`}
                >
                    Todo
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => onCategoryChange(cat)}
                        className={`px-5 py-2.5 rounded-md text-[10px] font-mono uppercase tracking-[0.15em] transition-all duration-300 border ${activeCategory === cat
                            ? 'bg-[#C5FF30] text-black border-[#C5FF30] font-black shadow-[0_0_15px_rgba(197,255,48,0.25)]'
                            : 'bg-zinc-900/40 text-zinc-400 border-zinc-800/60 hover:border-zinc-700 hover:text-white'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </motion.div>
        </div>
    );
};

export default FilterBar;
