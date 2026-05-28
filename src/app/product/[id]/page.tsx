'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import { Product } from '@/types/product';
import { getWhatsAppLink } from '@/utils/whatsapp';
import { MessageCircle, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/hooks/useCart';
import { Heart, ShoppingBag } from 'lucide-react';

export default function ProductDetail() {
    const { id } = useParams();
    const router = useRouter();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { addToCart, isInCart } = useCart();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const isLoved = product ? isInWishlist(product.id) : false;

    useEffect(() => {
        if (!id) return;

        const fetchProduct = async () => {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('Error fetching product:', error);
            } else {
                setProduct(data);
            }
            setLoading(false);
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white animate-pulse">
                {/* Skeleton Nav */}
                <div className="p-4 border-b border-gray-100 flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-full" />
                    <div className="h-4 bg-gray-100 w-48 rounded" />
                </div>

                <div className="max-w-7xl mx-auto md:grid md:grid-cols-2 md:gap-8 md:p-8">
                    {/* Skeleton Image Container */}
                    <div className="relative aspect-square bg-gray-50 overflow-hidden">
                        <div className="w-full h-full bg-gray-100" />
                    </div>

                    {/* Skeleton Info Detail */}
                    <div className="p-6 flex flex-col gap-6">
                        <div className="space-y-4">
                            <div className="h-3 bg-gray-100 w-24 rounded" />
                            <div className="h-10 bg-gray-100 w-full rounded" />
                            <div className="h-8 bg-gray-100 w-32 rounded" />
                        </div>

                        <div className="h-px bg-gray-100 w-full" />

                        <div className="space-y-4">
                            <div className="h-4 bg-gray-100 w-32 rounded" />
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-100 w-full rounded" />
                                <div className="h-4 bg-gray-100 w-full rounded" />
                                <div className="h-4 bg-gray-100 w-2/3 rounded" />
                            </div>
                        </div>

                        <div className="h-16 bg-gray-100 w-full rounded-sm mt-auto" />
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-vintage-beige">
                <div className="text-center">
                    <h1 className="text-2xl font-serif text-vintage-brown mb-4">Producto no encontrado</h1>
                    <button
                        onClick={() => router.push('/')}
                        className="text-vintage-gold underline uppercase tracking-widest text-sm"
                    >
                        Volver al catálogo
                    </button>
                </div>
            </div>
        );
    }

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    };

    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-white"
        >
            {/* Top Nav */}
            <nav className="p-4 flex items-center gap-4 bg-white sticky top-0 z-50 border-b border-gray-100">
                <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6 text-gray-800" />
                </button>
                <span className="font-bold text-sm uppercase tracking-widest text-gray-800 truncate">
                    {product.name}
                </span>
            </nav>

            {/* Main Content */}
            <div className="max-w-5xl mx-auto md:grid md:grid-cols-[1.2fr_1fr] md:gap-12 md:p-8">
                {/* Image Gallery */}
                <div className="relative aspect-square bg-white overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={currentImageIndex}
                            src={product.images[currentImageIndex]}
                            alt={product.name}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="w-full h-full object-cover"
                        />
                    </AnimatePresence>

                    {/* Wishlist Button */}
                    <button
                        onClick={() => toggleWishlist(product.id)}
                        className="absolute top-4 right-4 z-20 p-3 rounded-full bg-white/80 backdrop-blur-md shadow-md transition-all hover:bg-white hover:scale-110 group/heart"
                    >
                        <Heart
                            className={`w-6 h-6 transition-colors ${isLoved ? 'fill-red-500 text-red-500' : 'text-gray-400 group-hover/heart:text-red-400'}`}
                        />
                    </button>

                    {/* Navigation Arrows */}
                    {product.images.length > 1 && (
                        <>
                            <button
                                onClick={prevImage}
                                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-md backdrop-blur-sm z-10"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-md backdrop-blur-sm z-10"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </>
                    )}

                    {/* Dots Indicator */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 focus:outline-none z-10">
                        {product.images.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentImageIndex(i)}
                                className={`w-2 h-2 rounded-full transition-all ${currentImageIndex === i ? 'bg-black w-4' : 'bg-black/20'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Info Detail */}
                <div className="p-6 flex flex-col gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <span className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mb-2 block">
                            {product.category}
                        </span>
                        <h1 className="text-3xl !font-sans font-bold text-gray-900 leading-tight mb-4 uppercase tracking-wider">
                            {product.name}
                        </h1>
                        <div className="text-3xl font-bold text-gray-900">
                            ₡{product.price.toLocaleString()}
                        </div>
                    </motion.div>

                    <div className="h-px bg-gray-100 w-full" />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h3 className="font-sans font-bold text-sm uppercase tracking-widest text-gray-800 mb-3">Descripción</h3>
                        <p className="font-sans text-gray-600 leading-loose">
                            {product.description}
                        </p>
                    </motion.div>

                    {/* Action Buttons Sticky on Mobile */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 md:static md:p-0 md:bg-transparent md:border-0 z-40 flex flex-col gap-3"
                    >
                        <button
                            onClick={() => product && addToCart(product)}
                            disabled={product ? isInCart(product.id) : true}
                            className={`w-full flex items-center justify-center gap-3 py-4 rounded-sm font-bold uppercase tracking-widest transition-all duration-300 shadow-lg ${product && isInCart(product.id)
                                ? 'bg-gray-100 text-gray-400 cursor-default'
                                : 'bg-white text-black border border-black hover:bg-gray-50'
                                }`}
                        >
                            <ShoppingBag className="w-5 h-5" />
                            {product && isInCart(product.id) ? 'En el Carrito' : 'Agregar al Carrito'}
                        </button>

                        <a
                            href={getWhatsAppLink(product!)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-3 py-4 bg-black text-white hover:bg-vintage-brown transition-all duration-300 rounded-sm font-bold uppercase tracking-widest shadow-xl"
                        >
                            <MessageCircle className="w-6 h-6" />
                            Comprar por WhatsApp
                        </a>
                    </motion.div>
                </div>
            </div>

            <div className="h-24 md:hidden" /> {/* Spacer for sticky button */}

            <Footer />
        </motion.main>
    );
}
