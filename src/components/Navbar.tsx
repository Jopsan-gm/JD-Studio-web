'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, X, Trash2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { cart, removeFromCart } = useCart();

    const toggleMenu = () => setIsOpen(!isOpen);
    const toggleCart = () => setIsCartOpen(!isCartOpen);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const total = cart.reduce((acc, item) => acc + (item.discount_price || item.price), 0);

    return (
        <>
            <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 pointer-events-none ${
                isScrolled ? 'bg-black/90 backdrop-blur-md border-b border-white/5 py-2 md:py-3' : 'bg-transparent py-4 md:py-6'
            }`}>
                <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex justify-between items-center pointer-events-auto">
                    {/* Logo Area */}
                    <div className="pointer-events-auto">
                        <Link href="/" className="block">
                            <img
                                src="/images/jd-logo.png"
                                alt="JD Studio Logo"
                                className="h-24 md:h-36 w-auto object-contain transition-transform hover:scale-105 active:scale-95 filter brightness-125"
                            />
                        </Link>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 pointer-events-auto">
                        {/* Location Pill */}
                        <div className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[9px] font-bold tracking-widest text-gray-300 uppercase select-none">
                            <span>Turrialba, Cartago</span>
                            <span className="text-xs">🇨🇷</span>
                        </div>

                        {/* Cart Button */}
                        <button
                            onClick={toggleCart}
                            className="relative w-10 h-10 flex items-center justify-center bg-black/20 backdrop-blur-md rounded-full border border-white/10 text-white hover:bg-black/40 transition-all font-bold"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            {cart.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-white text-black text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                                    {cart.length}
                                </span>
                            )}
                        </button>

                        {/* Hamburger Button */}
                        <button
                            onClick={toggleMenu}
                            className="w-10 h-10 flex flex-col justify-center items-center gap-1 focus:outline-none group bg-black/20 backdrop-blur-md rounded-full border border-white/10 hover:bg-black/30 transition-all"
                            aria-label="Menu"
                        >
                            <div className={`w-5 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                            <div className={`w-5 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`} />
                            <div className={`w-5 h-0.5 bg-white transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Backdrop / Overlay */}
            <AnimatePresence>
                {(isOpen || isCartOpen) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[60] pointer-events-auto"
                        onClick={() => {
                            setIsOpen(false);
                            setIsCartOpen(false);
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Cart Side Drawer */}
            <AnimatePresence>
                {isCartOpen && (
                    <motion.aside
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-sm bg-white z-[80] shadow-2xl flex flex-col"
                    >
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-xl font-serif font-bold text-gray-900 uppercase tracking-widest">Tu Carrito</h2>
                            <button onClick={toggleCart} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="w-6 h-6 text-gray-400" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center gap-4">
                                    <ShoppingBag className="w-12 h-12 text-gray-100" />
                                    <p className="text-gray-400 font-medium font-serif italic text-lg">Tu carrito está vacío...</p>
                                    <button
                                        onClick={toggleCart}
                                        className="text-xs font-bold uppercase tracking-widest text-vintage-gold underline"
                                    >
                                        Explorar Catálogo
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {cart.map((item) => (
                                        <div key={item.id} className="flex gap-4">
                                            <div className="w-20 h-20 bg-gray-50 rounded-sm overflow-hidden flex-shrink-0">
                                                <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-bold text-gray-900 truncate">{item.name}</h4>
                                                <p className="text-xs text-gray-400 uppercase tracking-tighter mb-1">{item.category}</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-sm text-gray-900">₡{(item.discount_price || item.price).toLocaleString()}</span>
                                                    {item.discount_price && (
                                                        <span className="text-[10px] text-gray-400 line-through">₡{item.price.toLocaleString()}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="p-2 text-gray-300 hover:text-red-500 transition-colors self-center"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {cart.length > 0 && (
                            <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-sm font-bold uppercase tracking-widest text-gray-400">Total</span>
                                    <span className="text-xl font-bold text-gray-900">₡{total.toLocaleString()}</span>
                                </div>
                                <button className="w-full py-4 bg-black text-white rounded-sm font-bold uppercase tracking-widest text-sm hover:bg-vintage-brown transition-all shadow-xl">
                                    Finalizar Compra
                                </button>
                                <p className="text-[10px] text-gray-400 text-center mt-4 uppercase tracking-tighter">
                                    Se redirigirá a WhatsApp para coordinar el envío
                                </p>
                            </div>
                        )}
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Sidebar Menu */}
            <aside
                className={`fixed top-0 right-0 h-full w-64 bg-white z-[70] shadow-2xl transition-transform duration-500 ease-in-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="p-8 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-10">
                        <span className="font-serif font-bold text-xl uppercase tracking-widest text-gray-400">Menu</span>
                        <button onClick={toggleMenu} className="p-2 text-gray-400 hover:text-black transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <nav className="flex flex-col gap-6">
                        <Link
                            href="/"
                            onClick={toggleMenu}
                            className="text-xl font-serif font-bold hover:text-vintage-gold transition-colors"
                        >
                            Catálogo
                        </Link>

                        <button
                            onClick={() => {
                                toggleMenu();
                                toggleCart();
                            }}
                            className="flex items-center justify-between text-xl font-serif font-bold hover:text-vintage-gold transition-colors text-left"
                        >
                            <span>Mi Carrito</span>
                            {cart.length > 0 && (
                                <span className="bg-black text-white text-[10px] px-2 py-0.5 rounded-full ml-3">
                                    {cart.length}
                                </span>
                            )}
                        </button>

                        <Link
                            href="#nosotros"
                            onClick={toggleMenu}
                            className="text-xl font-serif font-bold hover:text-vintage-gold transition-colors"
                        >
                            Nuestra Historia
                        </Link>

                        <div className="h-px bg-gray-100 my-2" />

                        <Link
                            href="/admin"
                            onClick={toggleMenu}
                            className="flex items-center gap-2 text-sm font-sans font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
                        >
                            <span className="text-xl text-vintage-gold">✦</span> Acceso Admin
                        </Link>
                    </nav>

                    <div className="mt-auto">
                        <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">JD Studio</p>
                        <p className="text-xs text-gray-400 mt-1">Costa Rica, 2026</p>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Navbar;
