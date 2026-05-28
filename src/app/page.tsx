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
    const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
    const [activeMainTab, setActiveMainTab] = useState<'All' | 'Ropa' | 'Joyeria'>('All');
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
                // Map 'Vestidos' database records to 'Prendas' to consolidate all clothing
                const mappedData = (data || []).map((p: any) => ({
                    ...p,
                    category: p.category === 'Vestidos' ? 'Prendas' : p.category
                }));
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

    const joyeriaCategories: Category[] = ['Collares', 'Aretes', 'Pulseras', 'Anillos'];
    const baseRopaCategories: Category[] = ['Prendas', 'T-Shirts', 'Pants', 'Jackets'];
    const ropaCategories: Category[] = Array.from(
        new Set([
            ...baseRopaCategories,
            ...categories.filter((cat) => !joyeriaCategories.includes(cat))
        ])
    );

    const getCategoriesForTab = (): Category[] => {
        if (activeMainTab === 'Ropa') return ropaCategories;
        if (activeMainTab === 'Joyeria') return joyeriaCategories;
        return categories;
    };

    const visibleCategories = getCategoriesForTab();

    const filteredProducts = products.filter((p) => {
        if (activeMainTab === 'Ropa' && !ropaCategories.includes(p.category)) return false;
        if (activeMainTab === 'Joyeria' && !joyeriaCategories.includes(p.category)) return false;
        if (activeCategory !== 'All' && p.category !== activeCategory) return false;
        return true;
    });

    const handleSelectCollection = (type: 'ropa' | 'joyeria') => {
        setActiveMainTab(type === 'ropa' ? 'Ropa' : 'Joyeria');
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

            {showCatalog && (
                <section id="catalogo-section" className="bg-[#ECEBE9] relative z-20 -mt-16 md:-mt-24 rounded-t-[40px] shadow-[0_-10px_40px_rgba(0,0,0,0.08)] py-12 border-t border-white/10">
                    <div className="max-w-7xl mx-auto">
                        {/* Custom Tab Selector */}
                        <div className="flex justify-center gap-3 mb-6">
                            <button
                                onClick={() => {
                                    setActiveMainTab('Ropa');
                                    setActiveCategory('All');
                                }}
                                className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border ${
                                    activeMainTab === 'Ropa'
                                        ? 'bg-[#242424] text-white border-[#242424]'
                                        : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300 hover:text-black'
                                }`}
                            >
                                Ropa
                            </button>
                            <button
                                onClick={() => {
                                    setActiveMainTab('Joyeria');
                                    setActiveCategory('All');
                                }}
                                className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border ${
                                    activeMainTab === 'Joyeria'
                                        ? 'bg-[#242424] text-white border-[#242424]'
                                        : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300 hover:text-black'
                                }`}
                            >
                                Joyería
                            </button>
                            <button
                                onClick={() => {
                                    setActiveMainTab('All');
                                    setActiveCategory('All');
                                }}
                                className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border ${
                                    activeMainTab === 'All'
                                        ? 'bg-[#242424] text-white border-[#242424]'
                                        : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300 hover:text-black'
                                }`}
                            >
                                Ver Todo
                            </button>
                        </div>
                        
                        <FilterBar
                            categories={visibleCategories}
                            activeCategory={activeCategory}
                            onCategoryChange={setActiveCategory}
                        />

                        <ProductGrid products={filteredProducts} isLoading={loading} />
                    </div>
                </section>
            )}

            <Footer />
        </main>
    );
}
