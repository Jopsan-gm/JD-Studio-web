'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, X, Trash2, CreditCard, Truck, AlertTriangle, Info } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isImportantOpen, setIsImportantOpen] = useState(false);
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

                        <button
                            onClick={() => {
                                toggleMenu();
                                setIsImportantOpen(true);
                            }}
                            className="text-xl font-serif font-bold hover:text-vintage-gold transition-colors text-left cursor-pointer"
                        >
                            Importante
                        </button>

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

            {/* Modal de Información Importante */}
            <AnimatePresence>
                {isImportantOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 pointer-events-none">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsImportantOpen(false)}
                            className="fixed inset-0 bg-black/85 backdrop-blur-md pointer-events-auto"
                        />

                        {/* Modal Container */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: 'spring', duration: 0.5, bounce: 0.15 }}
                            className="relative bg-zinc-950 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl p-6 md:p-8 flex flex-col gap-6 text-white pointer-events-auto scrollbar-thin"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setIsImportantOpen(false)}
                                className="absolute top-4 right-4 p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white cursor-pointer"
                                aria-label="Cerrar"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            {/* Header */}
                            <div className="flex flex-col gap-2 border-b border-white/5 pb-4">
                                <span className="text-[10px] md:text-xs font-mono font-bold uppercase tracking-[0.25em] text-[#C5FF30]">
                                    Información Útil
                                </span>
                                <h3 className="text-2xl md:text-3xl font-serif font-black tracking-wide uppercase">
                                    Pautas & Condiciones
                                </h3>
                                <div className="h-0.5 w-16 bg-[#C5FF30] mt-1" />
                            </div>

                            {/* Grid of Sections */}
                            <div className="flex flex-col gap-6 font-sans">
                                {/* Section: Métodos de Pago */}
                                <div className="flex gap-4 items-start">
                                    <div className="p-2.5 bg-[#C5FF30]/10 border border-[#C5FF30]/20 rounded-xl text-[#C5FF30] shrink-0">
                                        <CreditCard className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                                            Métodos de Pago
                                        </h4>
                                        <ul className="text-xs text-gray-400 space-y-1 leading-relaxed">
                                            <li>
                                                <strong className="text-gray-300">SINPE Móvil:</strong> Pago inmediato al número <span className="text-[#C5FF30] font-bold font-mono">+506 8636 0118</span>.
                                            </li>
                                            <li>
                                                <strong className="text-gray-300">Transferencias Bancarias:</strong> Disponibles previa coordinación directa.
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Section: Envíos */}
                                <div className="flex gap-4 items-start">
                                    <div className="p-2.5 bg-[#C5FF30]/10 border border-[#C5FF30]/20 rounded-xl text-[#C5FF30] shrink-0">
                                        <Truck className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                                            Envíos & Entregas
                                        </h4>
                                        <ul className="text-xs text-gray-400 space-y-2 leading-relaxed">
                                            <li>
                                                Realizamos envíos a todo Costa Rica por medio de <strong className="text-gray-200 font-semibold">Correos de Costa Rica</strong>.
                                            </li>
                                            <li>
                                                El costo del envío corre por cuenta del comprador y se coordina al momento de confirmar el pedido.
                                            </li>
                                            <li>
                                                Una vez entregado el paquete a Correos, el tiempo de entrega depende del servicio postal — <strong className="text-white font-semibold">JD Studio</strong> no se hace responsable por demoras una vez que el pedido está en tránsito.
                                            </li>
                                            <li>
                                                Te compartimos el número de rastreo para que puedas seguir tu pedido.
                                            </li>
                                            <li className="pt-1.5 border-t border-white/5">
                                                <strong className="text-gray-300">Entregas Físicas:</strong> Coordinadas únicamente en el centro de <span className="text-white">Turrialba, Cartago</span>.
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Section: Devoluciones */}
                                <div className="flex gap-4 items-start">
                                    <div className="p-2.5 bg-[#C5FF30]/10 border border-[#C5FF30]/20 rounded-xl text-[#C5FF30] shrink-0">
                                        <AlertTriangle className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                                            Cambios & Devoluciones
                                        </h4>
                                        <ul className="text-xs text-gray-400 space-y-1 leading-relaxed">
                                            <li>
                                                Debido a la exclusividad y la rotación constante de nuestras colecciones, <strong className="text-white">todas las compras son finales</strong> (sin devoluciones de dinero ni cambios de mercadería).
                                            </li>
                                            <li>
                                                <strong className="text-gray-300">Garantía:</strong> Solo aplica en caso de fallos de fábrica evidentes, reportados por WhatsApp dentro de las 24 horas siguientes a la recepción de la prenda o joya.
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Section: Guía de Compra */}
                                <div className="flex gap-4 items-start">
                                    <div className="p-2.5 bg-[#C5FF30]/10 border border-[#C5FF30]/20 rounded-xl text-[#C5FF30] shrink-0">
                                        <Info className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                                            ¿Cómo comprar en JD Studio?
                                        </h4>
                                        <ol className="text-xs text-gray-400 list-decimal pl-4 space-y-1 leading-relaxed">
                                            <li>Explora las colecciones de Ropa y Joyería y añade piezas a tu carrito.</li>
                                            <li>Abre tu carrito y pulsa en <strong className="text-white">"Finalizar Compra"</strong>.</li>
                                            <li>Serás redirigido(a) a WhatsApp con tu lista detallada para definir el pago y tu dirección de entrega.</li>
                                        </ol>
                                    </div>
                                </div>
                            </div>

                            {/* Footer / CTA */}
                            <div className="border-t border-white/5 pt-4 mt-2 flex justify-end">
                                <button
                                    onClick={() => setIsImportantOpen(false)}
                                    className="px-6 py-2.5 bg-[#C5FF30] text-black font-bold font-mono text-xs uppercase tracking-widest rounded-lg hover:bg-white hover:text-black transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(197,255,48,0.2)] cursor-pointer"
                                >
                                    Entendido
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
