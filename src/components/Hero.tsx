import { motion } from 'framer-motion';

interface HeroProps {
    onSelectCollection: (type: 'ropa' | 'joyeria') => void;
}

const Hero = ({ onSelectCollection }: HeroProps) => {
    return (
        <section className="relative h-screen flex items-center justify-center bg-slate-950 overflow-hidden">
            {/* Background Overlay Effect */}
            <motion.div
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute inset-0 bg-[url('/images/banner-vintage.jpg')] bg-cover bg-center grayscale-[30%] brightness-[60%] contrast-[105%]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-gray-950/80 via-slate-900/40 to-transparent" />

            {/* Added bottom padding to completely clear the catalog's overlap on desktop and mobile */}
            <div className="relative z-10 text-center px-4 max-w-5xl flex flex-col items-center pb-24 md:pb-36 mt-12 md:mt-20">
                <motion.span
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#C5FF30] text-black font-sans uppercase tracking-[0.25em] text-[10px] md:text-[11px] mb-2 font-black rounded-full select-none shadow-lg shadow-[#C5FF30]/10"
                >
                    ✦ Tu estilo, sin límites
                </motion.span>

                {/* Reduced massive logo box height and negative margins to keep the screen ordered and legible */}
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="-mb-10 md:-mb-20 flex justify-center w-full"
                >
                    <img
                        src="/images/jd-logo.png"
                        alt="JD Studio Logo"
                        className="h-60 md:h-[260px] lg:h-[280px] w-auto object-contain filter drop-shadow-[0_12px_36px_rgba(255,255,255,0.25)] brightness-125"
                    />
                </motion.div>

                <motion.p
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="text-gray-200 text-base md:text-xl font-serif italic max-w-2xl mx-auto mb-8 leading-relaxed drop-shadow-lg"
                >
                    Curaduría de prendas streetwear y bisutería fina. Envíos a todo Costa Rica.
                </motion.p>

                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-xl mx-auto z-30"
                >
                    <button
                        onClick={() => onSelectCollection('ropa')}
                        className="w-full sm:w-auto px-8 py-4 bg-[#C5FF30] text-black font-black font-sans uppercase tracking-widest text-xs hover:bg-[#b5eb29] transition-all duration-300 shadow-xl shadow-[#C5FF30]/10 border border-[#C5FF30] cursor-pointer rounded-full"
                    >
                        Nuestras prendas
                    </button>
                    <button
                        onClick={() => onSelectCollection('joyeria')}
                        className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-[#C5FF30] text-[#C5FF30] font-black font-sans uppercase tracking-widest text-xs hover:bg-[#C5FF30]/10 transition-all duration-300 shadow-xl cursor-pointer rounded-full"
                    >
                        Joyería
                    </button>
                    <a
                        href="https://wa.me/50686360118?text=Hola%20JD%20Studio!%20Me%20interesa%20conocer%20m%C3%A1s%20sobre%20sus%20prendas%20y%20joyer%C3%ADa."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto px-8 py-4 bg-black/40 border border-white/10 text-white font-bold font-sans uppercase tracking-widest text-xs hover:bg-white/10 transition-all duration-300 backdrop-blur-md text-center rounded-full"
                    >
                        WhatsApp
                    </a>
                </motion.div>
            </div>

            {/* Scroll Down Hint */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:block"
            >
                <div className="w-px h-8 bg-white/30 animate-pulse" />
            </motion.div>
        </section>
    );
};

export default Hero;
