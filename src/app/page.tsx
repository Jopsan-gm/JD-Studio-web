'use client';

import React, { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import FilterBar from '@/components/FilterBar';
import ProductGrid from '@/components/ProductGrid';
import Footer from '@/components/Footer';
import { supabase } from '@/utils/supabase';
import { Product, Category } from '@/types/product';

export default function Home() {
    const [activeCategory, setActiveCategory] = useState<string>('All');
    const [activeMainTab, setActiveMainTab] = useState<'All' | 'Oversize' | 'Vintage' | 'Joyeria'>('All');
    const [showCatalog, setShowCatalog] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching products:', error);
            } else {
                // Map 'Vestidos' and 'Prendas' records to 'Oversize', and 'Jackets' to 'Hoodies'
                const mappedData = (data || []).map((p: any) => {
                    let cat = p.category;
                    if (cat === 'Vestidos' || cat === 'Prendas') {
                        cat = 'Oversize';
                    } else if (cat === 'Jackets') {
                        cat = 'Hoodies';
                    }
                    return {
                        ...p,
                        category: cat
                    };
                });
                setProducts(mappedData);
            }
            setLoading(false);
        };

        fetchProducts();
    }, []);

    // Extract unique categories from products
    const categories: Category[] = Array.from(
        new Set(products.map((p) => p.category))
    ) as Category[];

    const joyeriaCategories: Category[] = ['Collares', 'Aretes', 'Pulseras', 'Anillos', 'Conjuntos', 'Van Cleef'];
    const oversizeCategories: string[] = ['Oversize'];
    
    // Any clothing category that isn't jewelry and isn't oversize goes into Vintage
    const vintageCategories: string[] = Array.from(
        new Set(categories.filter((cat) => !joyeriaCategories.includes(cat) && !oversizeCategories.includes(cat)))
    );

    const getCategoriesForTab = (): string[] => {
        if (activeMainTab === 'Oversize') return oversizeCategories;
        if (activeMainTab === 'Vintage') return vintageCategories;
        if (activeMainTab === 'Joyeria') return ['Piezas Individuales', 'Sets & Colecciones'];
        return categories;
    };

    const visibleCategories = getCategoriesForTab();

    const filteredProducts = products.filter((p) => {
        if (activeMainTab === 'Oversize' && !oversizeCategories.includes(p.category)) return false;
        if (activeMainTab === 'Vintage' && !vintageCategories.includes(p.category)) return false;
        if (activeMainTab === 'Joyeria' && !joyeriaCategories.includes(p.category)) return false;
        
        if (activeCategory !== 'All') {
            if (activeCategory === 'Piezas Individuales') {
                if (!['Collares', 'Aretes', 'Pulseras', 'Anillos'].includes(p.category)) return false;
            } else if (activeCategory === 'Sets & Colecciones') {
                // Keep the 'Van Cleef' name check logic for Sets & Colecciones just in case
                const isSet = ['Van Cleef', 'Conjuntos'].includes(p.category);
                const nameMatch = p.name.toLowerCase().includes('van cleef');
                const descMatch = p.description?.toLowerCase().includes('van cleef') || false;
                if (!isSet && !nameMatch && !descMatch) return false;
            } else {
                if (p.category !== activeCategory) return false;
            }
        }
        return true;
    });

    const handleSelectCollection = (type: 'ropa' | 'joyeria') => {
        setActiveMainTab(type === 'ropa' ? 'Oversize' : 'Joyeria');
        setActiveCategory('All');
        setShowCatalog(true);
        setTimeout(() => {
            document.getElementById('catalogo-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    return (
        <main className="min-h-screen flex flex-col justify-between bg-black">
            <Navbar />
            <div className="flex-1">
                <Hero onSelectCollection={handleSelectCollection} />
            </div>

            <section
                id="catalogo-section"
                className={`bg-[#0A0A0C] relative z-20 -mt-16 md:-mt-24 rounded-t-[40px] shadow-[0_-15px_40px_rgba(0,0,0,0.5)] border-t border-[#C5FF30]/10 overflow-hidden ${
                    showCatalog ? 'py-12 block' : 'hidden'
                }`}
            >
                {showCatalog && (
                    <>
                        {/* Background Watermark Logo */}
                        <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden">
                            <img
                                src="/images/jd-logo.png"
                                alt="JD Studio Background Watermark"
                                className="w-[90%] max-w-[850px] h-auto object-contain select-none opacity-[0.06] scale-[0.95]"
                            />
                        </div>

                        <div className="max-w-7xl mx-auto relative z-10">
                            {/* Custom Tab Selector */}
                            <div className="flex justify-center gap-2 md:gap-3 mb-6 flex-wrap px-2">
                                <button
                                    onClick={() => {
                                        setActiveMainTab('Oversize');
                                        setActiveCategory('All');
                                    }}
                                    className={`px-4 md:px-6 py-2.5 md:py-3 rounded-lg text-[10px] md:text-xs uppercase tracking-[0.15em] transition-all duration-300 border font-mono whitespace-nowrap ${
                                        activeMainTab === 'Oversize'
                                            ? 'bg-[#C5FF30] text-black border-[#C5FF30] font-black shadow-[0_0_20px_rgba(197,255,48,0.2)]'
                                            : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white'
                                    }`}
                                >
                                    Brand New
                                </button>
                                <button
                                    onClick={() => {
                                        setActiveMainTab('Vintage');
                                        setActiveCategory('All');
                                    }}
                                    className={`px-4 md:px-6 py-2.5 md:py-3 rounded-lg text-[10px] md:text-xs uppercase tracking-[0.15em] transition-all duration-300 border font-mono whitespace-nowrap ${
                                        activeMainTab === 'Vintage'
                                            ? 'bg-[#C5FF30] text-black border-[#C5FF30] font-black shadow-[0_0_20px_rgba(197,255,48,0.2)]'
                                            : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white'
                                    }`}
                                >
                                    2Hand
                                </button>
                                <button
                                    onClick={() => {
                                        setActiveMainTab('Joyeria');
                                        setActiveCategory('All');
                                    }}
                                    className={`px-4 md:px-6 py-2.5 md:py-3 rounded-lg text-[10px] md:text-xs uppercase tracking-[0.15em] transition-all duration-300 border font-mono whitespace-nowrap ${
                                        activeMainTab === 'Joyeria'
                                            ? 'bg-[#C5FF30] text-black border-[#C5FF30] font-black shadow-[0_0_20px_rgba(197,255,48,0.2)]'
                                            : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white'
                                    }`}
                                >
                                    Joyería
                                </button>
                            </div>
                            
                            <FilterBar
                                categories={visibleCategories}
                                activeCategory={activeCategory}
                                onCategoryChange={setActiveCategory}
                            />

                            <ProductGrid products={filteredProducts} isLoading={loading} />
                        </div>
                    </>
                )}
            </section>

            <Footer />
        </main>
    );
}
