import React from 'react';
import { Instagram, Facebook } from 'lucide-react';

const TiktokIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
    </svg>
);

const Footer = () => {
    return (
        <footer className="bg-[#242424] text-white py-16 px-4 border-t border-white/5">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
                {/* Brand Section */}
                <div className="flex flex-col items-center md:items-start justify-center md:justify-start">
                    <div className="flex flex-col mb-1 select-none -ml-4 md:-ml-6">
                        <img
                            src="/images/jd-logo.png"
                            alt="JD Studio Logo"
                            className="h-20 w-auto object-contain filter brightness-125"
                        />
                    </div>
                    <p className="text-gray-300 font-sans leading-relaxed text-sm max-w-sm">
                        Curaduría de ropa sofisticada y piezas de bisutería de alta gama diseñadas para realzar tu belleza y estilo propio.
                    </p>
                </div>

                {/* Links Section */}
                <div className="flex flex-col items-center justify-center gap-4">
                    <h3 className="uppercase tracking-[0.2em] text-xs text-vintage-gold font-bold mb-2">Síguenos</h3>
                    <div className="flex gap-6 text-gray-300">
                        <a href="https://www.instagram.com/jdstudio.cr" target="_blank" rel="noopener noreferrer" className="hover:text-vintage-gold transition-colors"><Instagram /></a>
                        <a href="https://www.tiktok.com/@jdstudio.cr" target="_blank" rel="noopener noreferrer" className="hover:text-vintage-gold transition-colors"><TiktokIcon /></a>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-vintage-gold transition-colors"><Facebook /></a>
                    </div>
                </div>

                {/* Contact info */}
                <div className="md:text-right flex flex-col items-center md:items-end justify-center md:justify-start gap-2">
                    <h3 className="uppercase tracking-[0.2em] text-xs text-vintage-gold font-bold mb-2">Contacto</h3>
                    <p className="text-gray-300 text-sm">Cartago, Costa Rica</p>
                    <p className="text-gray-300 text-sm">+506 8636 0118</p>
                    <p className="mt-2 text-sm italic font-bold text-vintage-gold">jdstudio.cr@gmail.com</p>
                </div>
            </div>

            <div className="mt-16 pt-8 border-t border-white/5 text-center text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                &copy; {new Date().getFullYear()} JD Studio. Todos los derechos reservados.
            </div>
        </footer>
    );
};

export default Footer;
