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
                className="bg-white p-2 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-wrap justify-center gap-2"
            >
                <button
                    onClick={() => onCategoryChange('All')}
                    className={`px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border ${activeCategory === 'All'
                        ? 'bg-[#242424] text-white border-[#242424] shadow-lg shadow-black/10'
                        : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300 hover:text-black'
                        }`}
                >
                    Todo
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => onCategoryChange(cat)}
                        className={`px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border ${activeCategory === cat
                            ? 'bg-[#242424] text-white border-[#242424] shadow-lg shadow-black/10'
                            : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300 hover:text-black'
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
