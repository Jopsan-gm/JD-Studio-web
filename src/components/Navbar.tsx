'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, X, Trash2, CreditCard, Truck, AlertTriangle, Info } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/utils/supabase';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isImportantOpen, setIsImportantOpen] = useState(false);
    const [isLoyaltyOpen, setIsLoyaltyOpen] = useState(false);
    const [loyaltyUser, setLoyaltyUser] = useState<any>(null);
    const [loyaltyFirstName, setLoyaltyFirstName] = useState('');
    const [loyaltyLastName, setLoyaltyLastName] = useState('');
    const [loyaltyLoading, setLoyaltyLoading] = useState(false);
    const [loyaltyError, setLoyaltyError] = useState<string | null>(null);
    const { cart, removeFromCart } = useCart();

    const toggleMenu = () => setIsOpen(!isOpen);
    const toggleCart = () => setIsCartOpen(!isCartOpen);

    const refreshLoyaltyCard = async (firstName: string, lastName: string) => {
        setLoyaltyLoading(true);
        setLoyaltyError(null);
        try {
            const { data, error } = await supabase
                .from('loyalty_cards')
                .select('*')
                .eq('first_name', firstName.trim())
                .eq('last_name', lastName.trim())
                .maybeSingle();

            if (error) throw error;

            if (data) {
                setLoyaltyUser(data);
                localStorage.setItem('loyaltyUser', JSON.stringify({ first_name: data.first_name, last_name: data.last_name }));
            } else {
                setLoyaltyUser(null);
                localStorage.removeItem('loyaltyUser');
            }
        } catch (err: any) {
            console.error('Error fetching loyalty card:', err);
            setLoyaltyError('No se pudo actualizar los sellos.');
        } finally {
            setLoyaltyLoading(false);
        }
    };

    useEffect(() => {
        const savedUser = localStorage.getItem('loyaltyUser');
        if (savedUser) {
            try {
                const { first_name, last_name } = JSON.parse(savedUser);
                refreshLoyaltyCard(first_name, last_name);
            } catch (e) {
                console.error(e);
            }
        }
    }, []);

    const handleLoyaltyLookup = async (e: React.FormEvent) => {
        e.preventDefault();
        const fName = loyaltyFirstName.trim();
        const lName = loyaltyLastName.trim();
        if (!fName || !lName) {
            setLoyaltyError('Por favor ingresa nombre y apellido');
            return;
        }

        setLoyaltyLoading(true);
        setLoyaltyError(null);

        try {
            const { data, error } = await supabase
                .from('loyalty_cards')
                .select('*')
                .eq('first_name', fName)
                .eq('last_name', lName)
                .maybeSingle();

            if (error) throw error;

            if (data) {
                setLoyaltyUser(data);
                localStorage.setItem('loyaltyUser', JSON.stringify({ first_name: data.first_name, last_name: data.last_name }));
            } else {
                const { data: newData, error: insertError } = await supabase
                    .from('loyalty_cards')
                    .insert([{ first_name: fName, last_name: lName, stamps: 0 }])
                    .select()
                    .single();

                if (insertError) throw insertError;

                if (newData) {
                    setLoyaltyUser(newData);
                    localStorage.setItem('loyaltyUser', JSON.stringify({ first_name: newData.first_name, last_name: newData.last_name }));
                }
            }
        } catch (err: any) {
            console.error('Error in loyalty lookup:', err);
            setLoyaltyError('Error al conectar con la base de datos.');
        } finally {
            setLoyaltyLoading(false);
        }
    };

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

                        <button
                            onClick={() => {
                                toggleMenu();
                                setIsLoyaltyOpen(true);
                            }}
                            className="text-xl font-serif font-bold hover:text-vintage-gold transition-colors text-left cursor-pointer"
                        >
                            Cliente Frecuente
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
                                                <strong className="text-gray-300">Pagos en Efectivo:</strong> Aceptamos pagos en efectivo, exclusivo para entregas personales.
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

            {/* Modal de Cliente Frecuente */}
            <AnimatePresence>
                {isLoyaltyOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 pointer-events-none">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsLoyaltyOpen(false)}
                            className="fixed inset-0 bg-black/85 backdrop-blur-md pointer-events-auto"
                        />

                        {/* Modal Container */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: 'spring', duration: 0.5, bounce: 0.15 }}
                            className="relative bg-zinc-950 border border-white/10 rounded-2xl w-full max-w-lg overflow-y-auto shadow-2xl p-6 md:p-8 flex flex-col gap-6 text-white pointer-events-auto scrollbar-thin"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setIsLoyaltyOpen(false)}
                                className="absolute top-4 right-4 p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white cursor-pointer animate-none"
                                aria-label="Cerrar"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            {/* Header */}
                            <div className="flex flex-col gap-2 border-b border-white/5 pb-4">
                                <span className="text-[10px] md:text-xs font-mono font-bold uppercase tracking-[0.25em] text-[#C5FF30]">
                                    Beneficios Exclusivos
                                </span>
                                <h3 className="text-2xl md:text-3xl font-serif font-black tracking-wide uppercase">
                                    Cliente Frecuente
                                </h3>
                            </div>

                            {/* Content */}
                            {loyaltyUser ? (
                                <div className="flex flex-col gap-6">
                                    {/* Virtual Loyalty Card Display */}
                                    <div className="relative w-full max-w-[440px] aspect-[1.609/1] bg-[#0D0D0F] rounded-3xl p-6 border border-zinc-800 flex flex-col justify-between overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.6)] font-sans mx-auto">
                                        {/* Card background glowing elements */}
                                        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#C5FF30]/5 rounded-full blur-3xl pointer-events-none" />
                                        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-pink-500/5 rounded-full blur-3xl pointer-events-none" />

                                        {/* Header */}
                                        <div className="flex justify-between items-center z-10">
                                            <span className="text-lg font-black tracking-widest text-white font-sans uppercase">
                                                JD<span className="text-[#C5FF30]">.</span>Studio
                                            </span>
                                            <span className="text-[8px] font-mono font-bold tracking-[0.2em] border border-zinc-800 bg-zinc-900/50 text-zinc-400 px-3 py-1.5 rounded-full uppercase">
                                                Tarjeta Virtual
                                            </span>
                                        </div>

                                        {/* Reward description */}
                                        <div className="text-center my-1 z-10">
                                            <p className="text-[8px] md:text-[9px] font-mono tracking-[0.18em] text-[#C5FF30] font-black uppercase">
                                                ✦ COMPRA 4 Y LA 5ª ES GRATIS ✦
                                            </p>
                                        </div>

                                        {/* 5 Stamp Circles */}
                                        <div className="flex justify-between items-center px-2 z-10">
                                            {[...Array(5)].map((_, idx) => {
                                                const stampsNum = typeof loyaltyUser.stamps === 'number' ? loyaltyUser.stamps : parseInt(loyaltyUser.stamps || '0');
                                                const isStamped = stampsNum > idx;
                                                const isSpecialThird = idx === 2;
                                                const isGiftFifth = idx === 4;

                                                return (
                                                    <div
                                                        key={idx}
                                                        className={`relative w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                                                            isGiftFifth 
                                                                ? isStamped 
                                                                    ? 'border-2 border-dashed border-pink-500/60 bg-pink-950/20' 
                                                                    : 'border-2 border-dashed border-red-500/40 bg-red-950/5'
                                                                : isSpecialThird
                                                                    ? isStamped
                                                                        ? 'border-2 border-dashed border-yellow-500/60 bg-yellow-950/20'
                                                                        : 'border-2 border-dashed border-yellow-500/20 bg-yellow-950/5'
                                                                    : isStamped
                                                                        ? 'border-2 border-dashed border-[#C5FF30]/60 bg-[#C5FF30]/10'
                                                                        : 'border border-dashed border-zinc-700/60 bg-zinc-900/30'
                                                        }`}
                                                    >
                                                        {isStamped ? (
                                                            <motion.div
                                                                initial={{ scale: 0, rotate: -20 }}
                                                                animate={{ scale: 1, rotate: 0 }}
                                                                transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                                                            >
                                                                {isGiftFifth ? (
                                                                    <span className="text-xl">🎀</span>
                                                                ) : isSpecialThird ? (
                                                                    <span className="text-xl filter drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]">💎</span>
                                                                ) : (
                                                                    <span className="text-xl text-cyan-400">💎</span>
                                                                )}
                                                            </motion.div>
                                                        ) : (
                                                            <span className={`text-[9px] font-mono font-bold ${
                                                                isGiftFifth
                                                                    ? 'text-red-400/50'
                                                                    : isSpecialThird
                                                                        ? 'text-yellow-500/50'
                                                                        : 'text-zinc-600'
                                                            }`}>
                                                                {isGiftFifth ? '🎁' : isSpecialThird ? '20%' : idx + 1}
                                                            </span>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Footer */}
                                        <div className="flex justify-between items-end border-t border-zinc-900 pt-3 mt-1 z-10">
                                            <div className="flex flex-col">
                                                <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">Nombre:</span>
                                                <span className="text-xs font-bold text-zinc-200 border-b border-zinc-800/80 pb-0.5 min-w-[120px] uppercase font-mono truncate max-w-[200px]">
                                                    {loyaltyUser.first_name} {loyaltyUser.last_name}
                                                </span>
                                            </div>
                                            <div className="flex flex-col text-right font-mono">
                                                <span className="text-[7px] md:text-[8px] text-zinc-500 uppercase tracking-wider">Turrialba, Cartago</span>
                                                <span className="text-[8px] md:text-[9px] text-[#C5FF30]/80 font-bold mt-0.5">@jdstudio.cr</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Subtitle explaining stamps */}
                                    <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-4 text-xs text-zinc-400 space-y-2 leading-relaxed">
                                        <p>
                                            <strong className="text-white">¿Cómo funciona?</strong> Cada compra te otorga un sello (administrado por el dueño de la tienda). 
                                        </p>
                                        <ul className="list-disc pl-4 space-y-1">
                                            <li><strong className="text-yellow-500">3er sello (Compra 3):</strong> Obtienes un <strong className="text-white">20% de descuento</strong> en esa compra.</li>
                                            <li><strong className="text-pink-400">5to sello (Compra 5):</strong> ¡Reclama un <strong className="text-white">accesorio GRATIS</strong>!</li>
                                        </ul>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 justify-end items-center mt-2">
                                        <button
                                            onClick={() => refreshLoyaltyCard(loyaltyUser.first_name, loyaltyUser.last_name)}
                                            disabled={loyaltyLoading}
                                            className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold font-mono text-[10px] uppercase tracking-widest rounded-lg hover:bg-zinc-800 active:scale-95 transition-all disabled:opacity-50"
                                        >
                                            {loyaltyLoading ? 'Actualizando...' : '🔄 Refrescar'}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setLoyaltyUser(null);
                                                localStorage.removeItem('loyaltyUser');
                                                setLoyaltyFirstName('');
                                                setLoyaltyLastName('');
                                            }}
                                            className="px-4 py-2 bg-red-950/20 border border-red-900/40 text-red-400 font-bold font-mono text-[10px] uppercase tracking-widest rounded-lg hover:bg-red-950/40 active:scale-95 transition-all"
                                        >
                                            Buscar Otra
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleLoyaltyLookup} className="flex flex-col gap-4">
                                    <p className="text-xs text-zinc-400 leading-relaxed mb-2">
                                        Ingresa tu nombre y apellido para consultar tu tarjeta de cliente frecuente virtual. Si no tienes una registrada, la crearemos en este momento con 0 sellos.
                                    </p>

                                    {loyaltyError && (
                                        <div className="bg-red-950/40 border border-red-900/50 rounded-lg p-3 text-red-400 text-xs flex gap-2 items-center">
                                            <span>⚠️</span>
                                            <p className="font-semibold">{loyaltyError}</p>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Nombre</label>
                                            <input
                                                type="text"
                                                value={loyaltyFirstName}
                                                onChange={(e) => setLoyaltyFirstName(e.target.value)}
                                                className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:border-[#C5FF30] text-sm text-white"
                                                placeholder="Ej. Jopsan"
                                                required
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Apellido</label>
                                            <input
                                                type="text"
                                                value={loyaltyLastName}
                                                onChange={(e) => setLoyaltyLastName(e.target.value)}
                                                className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:border-[#C5FF30] text-sm text-white"
                                                placeholder="Ej. GM"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loyaltyLoading}
                                        className="w-full py-4 bg-[#C5FF30] text-black font-bold font-mono text-xs uppercase tracking-widest rounded-lg hover:bg-white transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(197,255,48,0.2)] mt-4 disabled:opacity-50"
                                    >
                                        {loyaltyLoading ? 'Buscando...' : 'Ver Mi Tarjeta'}
                                    </button>
                                </form>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
